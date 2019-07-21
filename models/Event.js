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
  geometry: 'Point',

  category: {
    type: 'ObjectId',
    ref: 'Category',
    required: true
  },
}, {
  timestamps: true
})

schema.index({ geometry: "2dsphere" });

schema.virtual('video_preview').get(function() {

  return `https://unbored.mm77707.now.sh/e/${this._id}.jpeg`
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
  .then(({ routes, stops }) => {
    let mutated = {
      type: 'FeatureCollection',
      features: routes.map(route => ({
        type: 'Feature',
        properties: {
          id: route.cbbId
        },
        geometry: {
          type: 'LineString',
          coordinates: route.stops.map(s => s.geometry.coordinates)
        }
      }))
    }
    return pathFinder = new PathFinder(mutated, {
      edgeDataSeed: -1,
      edgeDataReduceFn: function(a, p) {
        // console.log({a, p})
        return {id: p.id};
      },
    })
  })
}

// getGeodata()
// .catch(console.log)

schema.methods.getPaths = function(coordinates) {
  // geolib.orderByDistance(coords, )
  return Promise.all([
    BusStop.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates
          },
          distanceField: 'dist.calculated',
          maxDistance: 1000,
          spherical: true
        }
      }
    ]),
    BusStop.aggregate([
      {
        $geoNear: {
          near: this.geometry,
          distanceField: 'dist.calculated',
          maxDistance: 1000,
          spherical: true
        }
      }
    ])
  ])
  .then(([userStops, eventStops]) => {

    return getPathfinder()
      .then(pf => {
        // let path
        // while(!path && found.length) {
          // let next = found.shift()
          path = pf.findPath(userStops[0], eventStops[0])
        // }

        return BusStop.find({ coords: { $in: path.path }}).select('_id title area coords')
        .then(stops =>
          BusRoute.find({
            stops: {
              $in: stops.map(s => s._id)
            }
          })
          .select('name details stops')
          .then(data => ({
            path: path.path.map(p => {
              let stop = stops.find(s => s.coords[0] === p[0] && s.coords[1] === p[1]).toJSON()
              return ({
                ...stop || {},
                route: data.find(r => r.stops.includes(stop._id))
              })
            }),
            // routes: data
          }))
        )

      })
  })

}
module.exports = mongoose.model('Event', schema);
