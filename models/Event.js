const GeoJSON = require('mongoose-geojson-schema')
,     mongoose = require('mongoose')
,     PathFinder = require('geojson-path-finder')
,     geolib = require('geolib')
,     BusStop = require('./BusStop')
,     BusRoute = require('./BusRoute')
,     schema = new mongoose.Schema({
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
  geometry: {
    type: 'Point'
  },

  category: {
    type: 'ObjectId',
    ref: 'Category',
    required: true
  },
}, {
  timestamps: true
})

var geoPromise, geoData, pathFinder
function getGeodata() {
  if (geoData)
    return Promise.resolve(geoData)

  if (geoPromise)
    return geoPromise

  return geoPromise = BusRoute.find().populate('stops').then(routes => (geoData = {
    routes,
    stops: routes.reduce((acc, el) => acc.concat(el.stops), [])
  }))
}

function getPathfinder() {

  if (pathFinder)
    return Promise.resolve(pathFinder)

  return getGeodata()
  .then(data => {
    let mutated = {
      type: 'FeatureCollection',
      features: data.map(route => ({
        type: 'Feature',
        properties: {
          id: route.cbbId
        },
        geometry: {
          type: 'LineString',
          coordinates: route.stops.map(s => s.coords)
        }
      }))
    }
    return pathFinder = new PathFinder(mutated)
  })
}

// getGeodata()
// .catch(console.log)

schema.methods.getPaths = function(coords) {
  geolib.orderByDistance(coords, )
  return getPathfinder()
    .then(pf =>
      pf.findPath(
        { geometry: { type: "Point", coordinates: coords } },
        { geometry: { type: "Point", coordinates: this.coords } })
    )

}
module.exports = mongoose.model('Event', schema);
