/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

const vision = require('@google-cloud/vision');
const Storage = require('@google-cloud/storage');
const Firestore = require('@google-cloud/firestore');

// Init VisionAPI client
const client = new vision.ImageAnnotatorClient();

exports.vision_analysis = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}`);
  const filename = event.name;
  const filebucket = event.bucket;
  console.log(`New picture uploaded ${filename} in ${filebucket}`);

  // Prepare the VisionAPI request
  const request = {
    image: { source: { imageUri: `gs://${filebucket}/${filename}` } },
    features: [ { type: 'LABEL_DETECTION' }, { type: 'IMAGE_PROPERTIES' } ]
  };

  // Send the request to VisionAPI
  const [response] = await client.annotateImage(request);
  console.log(`Raw vision output for: ${filename}: ${JSON.stringify(response)}`);

  // If the response is ok
  if(response.error === null){
    // Get the resulting labels
    const labels = response.labelAnnotations
            .sort((ann1, ann2) => ann2.score - ann1.score)
            .map(ann => ann.description);
    console.log(`Labels: ${labels.join(', ')}`);

    // Get the dominant color of the image
    const color = response.imagePropertiesAnnotation.dominantColors.colors
        .sort((c1, c2) => c2.score - c1.score)[0].color;
        
    const colorHex = '#' +  Number(color.red).toString(16).padStart(2, '0') + 
                            Number(color.green).toString(16).padStart(2, '0') + 
                            Number(color.blue).toString(16).padStart(2, '0');
    console.log(`Colors: ${colorHex}`);

    // store the image in Firestore database
    const pictureStore = new Firestore().collection('legit-images');
            
    const doc = pictureStore.doc(filename);
    await doc.set({
        labels: labels,
        color: colorHex,
        created: Firestore.Timestamp.now()
    });

    console.log("Stored metadata in Firestore database");
  }
  else {
    throw new Error(`VisionAPI fucked up with: code ${response.error.code}, message: "${response.error.message}"`);
  }
}
