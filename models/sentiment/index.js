const tf = require("@tensorflow/tfjs");
const loader = require("./loader");
const { OOV_INDEX, padSequences } = require("./sequence_utils");

const HOSTED_URLS = {
  model: "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json",
  metadata: "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json",
};

class SentimentPredictor {
  async init(urls = HOSTED_URLS) {
    this.urls = urls;
    this.model = await loader.loadHostedPretrainedModel(urls.model);
    await this.loadMetadata();
    return this;
  }

  async loadMetadata() {
    const sentimentMetadata = await loader.loadHostedMetadata(this.urls.metadata);
    this.indexFrom = sentimentMetadata["index_from"];
    this.maxLen = sentimentMetadata["max_len"];
    this.wordIndex = sentimentMetadata["word_index"];
    this.vocabularySize = sentimentMetadata["vocabulary_size"];
  }

  predict(text) {
    const inputText = text
      .trim()
      .toLowerCase()
      .replace(/(\.|\,|\!)/g, "")
      .split(" ");
    const sequence = inputText.map((word) => {
      let wordIndex = this.wordIndex[word] + this.indexFrom;
      if (wordIndex > this.vocabularySize) {
        wordIndex = OOV_INDEX;
      }
      return wordIndex;
    });
    const paddedSequence = padSequences([sequence], this.maxLen);
    const input = tf.tensor2d(paddedSequence, [1, this.maxLen]);
    const predictOut = this.model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();

    return score;
  }
}

module.exports = async () => await new SentimentPredictor().init();
