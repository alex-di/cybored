const mongoose = require('mongoose')
,     schema = new mongoose.Schema({
  title: String

})

schema.virtual('image').get(function() {
  return `https://unbored.mm77707.now.sh/c/${this._id}.jpeg`
})

module.exports = mongoose.model('Category', schema);
