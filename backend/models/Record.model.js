const mongoose = require('mongoose');

// Define the schema for a record
const recordSchema = new mongoose.Schema({
  Day: { type: String, required: true },
  Age: { type: String, required: true },
  Gender: { type: String, required: true },
  A: { type: Number, required: true },
  B: { type: Number, required: true },
  C: { type: Number, required: true },
  D: { type: Number, required: true },
  E: { type: Number, required: true },
  F: { type: Number, required: true }
});

// Create a model from the schema
const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
