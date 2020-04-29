const express = require('express');
const fileUpload = require('express-fileupload');
const Promise = require("bluebird");

const CosmosClient = require("@azure/cosmos").CosmosClient;
let CosmosKey = 'a8GGHiJ3tMmIfCN1JQpW7u4kVI1hZSAq66cQxOuNZaKyhMzJEiDmDqs0QIQRO9S4TDktl0NjS8lU4sRn7bwJaw==';
let CosmosEndpoint = 'https://cosmosdatabaseaccount.documents.azure.com:443/';

const azureStorage = require('azure-storage');
blobService = azureStorage.createBlobService(cloudcomputingacc, 'yYQgdqIxU2qLLS4TRvH6elCUlnqBksHT6QtlQ9dhL5W1XquGb3NRJ2u5FwQawaStUa2bFmcKup7MZmRRqebpQA==');
const azureBlobQueryValidator = '?sp=rl&st=2020-04-29T19:49:38Z&se=2021-04-30T19:49:00Z&sv=2019-10-10&sr=c&sig=OxSH5PPhwg156M5pUN2QI0PS2sj%2FEH9qbP0rpBTssd8%3D';

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
    // Is there a valid body?
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

    blobService.createBlockBlobFromLocalFile('legit-images', req.files.image.name, newImage, err => {
        if(err) {
            handleError(err);
            return;
        }

        res.render('success', { 
            message: 'File uploaded to Azure Blob storage.' 
        });
    });

    /*
        // Upload the image to the bucket
        const imageBucket = storage.bucket(process.env.BUCKET_PICTURES);
        await imageBucket.upload(newImage, { resumable: false });
        console.log("Uploaded new image into Cloud Storage");
    */

    // Return to the main page
    res.redirect('/');
});

// GET request to return a list of images in JSON format
app.get('/api/images', async (req, res) => {
    console.log('Retrieving list of images');

    const thumbnails = [];
    const DBClient = new CosmosClient({ endpoint: CosmosEndpoint, key: CosmosKey});

    const database = DBClient.database('ImagesDatabase');
    const container = database.container('ImagesContainer');

    const querySpec = {
        query: "SELECT * from c ORDER BY c.created DESC"
    };
      
    const { resources: imagesFromDatabase } = await container.items.query(querySpec).fetchAll();

    if (imagesFromDatabase.empty) {
        console.log('No images found');
    } else {
        imagesFromDatabase.forEach(doc => {
            const pic = doc.data();
            thumbnails.push({
                name: doc.id,
                labels: pic.labels,
                color: pic.color[0],
                created: dayjs(pic.created.toDate()).fromNow()
            });
        });
    }
    res.send(thumbnails);
});

// GET request for the full image from the images bucket
app.get('/api/images/:name', async (req, res) => {
    res.redirect(`https://cloudcomputingacc.blob.core.windows.net/legit-images/${req.params.name}${azureBlobQueryValidator}`);
});

/*
    // GET request for the thumbnail from the thumbnails bucket
    app.get('/api/thumbnails/:name', async (req, res) => {
        res.redirect(`https://storage.cloud.google.com/${process.env.BUCKET_THUMBNAILS}/${req.params.name}`);
    });
*/

// Init the port to default 8080 or host provided one
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`${PORT}`);
});
