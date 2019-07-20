const fetch = require('node-fetch')
,     BusRoute = require('../models/BusRoute')
,     BusStop = require('../models/BusStop')
,     cheerio = require('cheerio')
,     current = 2
,     _eval = require('eval')
,   mongoose = require('mongoose')


class LatLng {

}
const google = {
  maps: {
    LatLng
  }
}

console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

function getUrl(id) {
  return `http://www.cyprusbybus.com/WebServices/MapService.ashx?_=${Date.now()}&rid=${id}`
}

let buffer = {
  stops: []
}

class RouteClass {
  constructor(cbbId, name, name2, details) {
    console.log("ROUTE CLASS", cbbId)
    buffer.cbbId = cbbId
    buffer.details = details
    this.connections = []
    this.reverseConnections = []
  }
}

class NodeClass {
  constructor(cbbId) {
    buffer.stops.push(cbbId)
  }
}

class ConnectionClass {}

function getNext(id) {
  console.log("LAST", id)
  let url = getUrl(++id)
  return fetch(url, {
    redirect: 'manual'
  })
  .then(res => res.status >= 200 && res.status < 300 ? res.text() : Promise.resolve())
  .then(text => {
    buffer = {
      stops: []
    }

    _eval(`(${text})()`, 'fn.js', { NodeClass, RouteClass, ConnectionClass, google })

    if (!buffer.cbbId)
      return getNext(id)

    return BusStop.find({ cbbId: { $in: buffer.stops }})
    .then(stops => {
      buffer.stops = stops
      BusRoute.create(buffer)
        .then(() => getNext(id))
    })
  })

}

function boot() {
  BusRoute.find({}).sort({cbbId: -1}).limit(1)
  .then(data => {
    let id = data && data[0] ? data[0].cbbId : 0
    getNext(id)
  })
}

boot()
