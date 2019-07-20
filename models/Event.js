const mongoose = require('mongoose')
module.exports = mongoose.model('Event', new mongoose.Schema({
  title: String,
  description: String,
  startAt: Number,
  endAt: Number,
  session: Number,
  link: String,
  video: String,
  phone: String,
  contactInfo: String,
  image: String,
  coords: [ Number ],

  category: {
    type: 'ObjectId',
    ref: 'Category',
    required: true
  },
}, {
  timestamps: true
}));
