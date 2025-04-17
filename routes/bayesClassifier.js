const { BayesClassifier } = require('natural');

const classifier = new BayesClassifier();

// Add some sample documents and their categories
classifier.addDocument('water', 'WaterBill');
classifier.addDocument('watermeter', 'WaterBill');

classifier.addDocument('petroleum', 'FuelBill');
classifier.addDocument('petrol', 'FuelBill');
classifier.addDocument('gasoline', 'FuelBill');
classifier.addDocument('diesel', 'FuelBill');
classifier.addDocument('fuel', 'FuelBill');
classifier.addDocument('gas', 'FuelBill');
classifier.addDocument('refueling', 'FuelBill');
classifier.addDocument('tank', 'FuelBill');
classifier.addDocument('gasstation', 'FuelBill');
classifier.addDocument('fuelpump', 'FuelBill');

classifier.addDocument('electricity', 'ElectricityBill');
classifier.addDocument('power', 'ElectricityBill');
classifier.addDocument('current', 'ElectricityBill');
classifier.addDocument('electrical', 'ElectricityBill');
classifier.addDocument('meter', 'ElectricityBill');
classifier.addDocument('generator', 'ElectricityBill');
classifier.addDocument('transformer', 'ElectricityBill');
classifier.addDocument('wiring', 'ElectricityBill');


// Train the classifier
classifier.train();

function classifyText(text) {
  return classifier.classify(text);
}

module.exports = classifyText;
