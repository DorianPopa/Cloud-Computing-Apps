const express = require('express');
const bodyParser = require('body-parser');
const im = require('imagemagick');
const Promise = require("bluebird");
const path = require('path');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

const app = express();
app.use(bodyParser.json());

app.post('/', async (req, res) => {
    try {
        const pubSubMessage = req.body;
        console.log(`PubSub message: ${JSON.stringify(pubSubMessage)}`);

        const fileEvent = JSON.parse(Buffer.from(pubSubMessage.message.data, 'base64').toString().trim());
        console.log(`Base 64 decoded file event: ${JSON.stringify(fileEvent)}`);
        console.log(`Received thumbnail request for file ${fileEvent.name} from bucket ${fileEvent.bucket}`);

        const bucket = storage.bucket(fileEvent.bucket);
        const thumbBucket = storage.bucket(process.env.BUCKET_THUMBNAILS);

        const originalFile = path.resolve('/tmp/original', fileEvent.name);
        const thumbFile = path.resolve('/tmp/thumbnail', fileEvent.name);

        await bucket.file(fileEvent.name).download({
            destination: originalFile
        });
        console.log(`Downloaded picture into ${originalFile}`);

        const resizeCrop = Promise.promisify(im.crop);
        await resizeCrop({
                srcPath: originalFile,
                dstPath: thumbFile,
                width: 400,
                height: 400
        });
        console.log(`Created local thumbnail in ${thumbFile}`);

        await thumbBucket.upload(thumbFile);
        console.log(`Uploaded thumbnail to Cloud Storage bucket ${process.env.BUCKET_THUMBNAILS}`);

        res.status(204).send(`${fileEvent.name} processed`);
    } catch (err) {
        console.log(`Error: creating the thumbnail: ${err}`);
        console.error(err);
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Started thumbnail generator on port ${PORT}`);
});
