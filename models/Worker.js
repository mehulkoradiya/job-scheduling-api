const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
});

module.exports = mongoose.model('Worker', workerSchema);
