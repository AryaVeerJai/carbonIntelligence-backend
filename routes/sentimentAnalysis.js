const { SentimentAnalyzer, PorterStemmer } = require('natural');

const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

function analyzeSentiment(wordsArray) {
  return analyzer.getSentiment(wordsArray);
}

module.exports = analyzeSentiment;
