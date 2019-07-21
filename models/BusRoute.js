const mongoose = require('mongoose')
,     schema = new mongoose.Schema({
  cbbId: {
    type: Number,
    required: true
  },
  stops: [
    {
      type: 'ObjectId',
      ref: 'BusStop'
    }
  ]
})

schema.methods.getLineString = function() {
  console.log(this.stops)
  return this.stops
}

schema.index({
  cbbId: 1
}, {
  unique: true
})
module.exports = mongoose.model('BusRoute', schema);
