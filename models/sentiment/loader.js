const tf = require("@tensorflow/tfjs");
const fetch = require("node-fetch");

async function urlExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (err) {
    return false;
  }
}

async function loadHostedPretrainedModel(url) {
  try {
    const model = await tf.loadLayersModel(url);
    return model;
  } catch (err) {
    console.error(err);
  }
}
async function loadHostedMetadata(url) {
  try {
    const metadataJson = await fetch(url);
    const metadata = await metadataJson.json();
    return metadata;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  urlExists,
  loadHostedMetadata,
  loadHostedPretrainedModel,
};
