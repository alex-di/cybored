const mongoose = require('mongoose')
module.exports = mongoose.model('Path', new mongoose.Schema({
  title: String,
  description: String,
  startAt: Date,
  endAt: Date,
  session: Number,

}, {
  timestamps: true
}));
