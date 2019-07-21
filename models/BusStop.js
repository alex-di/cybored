const mongoose = require('mongoose')
,     schema = new mongoose.Schema({
  title: String,
  cbbId: {
    type: Number,
    required: true
  },
  area: String,
  coords: [ Number ],
  geometry: 'Point'
})

schema.index({
  cbbId: 1
}, {
  unique: true
})
module.exports = mongoose.model('BusStop', schema);
