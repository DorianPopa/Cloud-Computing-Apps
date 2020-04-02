const express = require('express');
const fileUpload = require('express-fileupload');
const Firestore = require('@google-cloud/firestore');
const Promise = require("bluebird");
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const path = require('path');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)


const app = express();

// Reference to the static files folder (html, css ...)
app.use(express.static('public'));

// Limit the size to 10MB and store imgs into /tmp/ folder
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

// POST request to upload a new image. Called from upload.html
app.post('/api/images', async (req, res) => {

    // Is there a file in the body?
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No file uploaded");
        return res.status(400).send('No file was uploaded.');
    }
    console.log(`Receiving file ${JSON.stringify(req.files.image)}`);

    // Get the file and store it into tmp
    const newImage = path.resolve('/tmp', req.files.image.name);
    const mv = Promise.promisify(req.files.image.mv);
    await mv(newImage);
    console.log('File moved in temporary directory');

    // Upload the image to the bucket
    const imageBucket = storage.bucket(process.env.BUCKET_PICTURES);
    await imageBucket.upload(newImage, { resumable: false });
    console.log("Uploaded new image into Cloud Storage");

    // Return to the main page
    res.redirect('/');
});

// GET request to return a list of images in JSON format
app.get('/api/images', async (req, res) => {
    console.log('Retrieving list of images');

    const thumbnails = [];
    const imageStore = new Firestore().collection('legit-images');
    const imagesFromDatabase = await imageStore.orderBy('created', 'desc').get();

    if (imagesFromDatabase.empty) {
        console.log('No images found');
    } else {
        imagesFromDatabase.forEach(doc => {
            const pic = doc.data();
            thumbnails.push({
                name: doc.id,
                labels: pic.labels,
                color: pic.color,
                created: dayjs(pic.created.toDate()).fromNow()
            });
        });
    }
    res.send(thumbnails);
});

// GET request for the full image from the images bucket
app.get('/api/images/:name', async (req, res) => {
    res.redirect(`https://storage.cloud.google.com/${process.env.BUCKET_PICTURES}/${req.params.name}`);
});

// GET request for the thumbnail from the thumbnails bucket
app.get('/api/thumbnails/:name', async (req, res) => {
    res.redirect(`https://storage.cloud.google.com/${process.env.BUCKET_THUMBNAILS}/${req.params.name}`);
});

// Init the port to default 8080 or host provided one
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`${PORT}`);
    console.log(`${process.env.BUCKET_PICTURES}`);
    console.log(`${process.env.BUCKET_THUMBNAILS}`);
});
