const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  day: String,
  startTime: String,
  endTime: String,
});

module.exports = mongoose.model('Schedule', scheduleSchema);
