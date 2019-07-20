const fetch = require('node-fetch')
,     BusStop = require('../models/BusStop')
,     cheerio = require('cheerio')
,     current = 2
,     _eval = require('eval')
,   mongoose = require('mongoose')

console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

function getUrl(id) {
  return `http://www.cyprusbybus.com/WebServices/MapService.ashx?_=${Date.now()}&uid=${id}`
}

class NodeClass {
  constructor(cbbId, title, lat, lng, area) {
    return BusStop.create({
      cbbId, title, area,
      coords: [lat, lng]
    })
    .then(() => console.log('OK', cbbId))
    .catch(console.log)
  }
}

function getNext(id) {
  console.log("LAST", id)
  return fetch(getUrl(++id), {
    redirect: 'manual'
  })
  .then(res => res.status >= 200 && res.status < 300 ? res.text() : Promise.resolve())
  .then(text => {
    _eval(`(${text})()`, 'fn.js', { NodeClass })
    return getNext(id)
  })

}

function boot() {
  BusStop.find({}).sort({cbbId: -1}).limit(1)
  .then(data => {
    let id = data[0].cbbId
    getNext(id)
  })
}

boot()
