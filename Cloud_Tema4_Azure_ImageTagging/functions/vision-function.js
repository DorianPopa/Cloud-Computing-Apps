const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('ms-rest-js').ApiKeyCredentials;
const CosmosClient = require("@azure/cosmos").CosmosClient;
const generateUniqueId = require('generate-unique-id');

let VisionKey = 'afeaaaf8d690475f9892e5f7773e7a18';
let VisionEndpoint = 'https://se-uita-la-poza-calculator-legit.cognitiveservices.azure.com/';

let CosmosKey = 'a8GGHiJ3tMmIfCN1JQpW7u4kVI1hZSAq66cQxOuNZaKyhMzJEiDmDqs0QIQRO9S4TDktl0NjS8lU4sRn7bwJaw==';
let CosmosEndpoint = 'https://cosmosdatabaseaccount.documents.azure.com:443/';

function formatTags(tags) {
  return tags.map(tag => (`${tag.name} (${tag.confidence.toFixed(2)})`)).join(', ');
}

module.exports = async function (context, myBlob) {
    context.log("JavaScript blob trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlob.length, "Bytes");
    const describeURL = 'https://cloudcomputingacc.blob.core.windows.net/' + context.bindingData.blobTrigger;
    
    let computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({inHeader: {'Ocp-Apim-Subscription-Key': VisionKey}}), VisionEndpoint);

    let imageSpecs = await computerVisionClient.analyzeImage(describeURL, {visualFeatures: ['Tags', 'Color']});
    context.log(`Tags: ${formatTags(imageSpecs.tags)}`);
    context.log(`Dominant colors: ${imageSpecs.color.dominantColors.join(', ')}`);

    const DBClient = new CosmosClient({ endpoint: CosmosEndpoint, key: CosmosKey});

    const database = DBClient.database('ImagesDatabase');
    const container = database.container('ImagesContainer');

    const newId = generateUniqueId({
        length: 16,
        useLetters: true
    });
    const newDatabaseItem = { id: newId, name: context.bindingData.blobTrigger.split("/")[1], labels: imageSpecs.tags.slice(0, 10), color: imageSpecs.color.dominantColors, created: (new Date()).toISOString() };
    context.log(await container.items.create(newDatabaseItem));

    // const querySpec = {
    //     query: "SELECT * from c ORDER BY c.created DESC"
    // };

    // const { resources: items } = await container.items
    //     .query(querySpec)
    //     .fetchAll();
    
    // context.log(items);
};
