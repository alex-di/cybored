const GeoJSON = require('mongoose-geojson-schema')
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

schema.index({ geometry: "2dsphere" });

module.exports = mongoose.model('BusStop', schema);
