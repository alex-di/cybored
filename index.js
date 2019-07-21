var express = require('express')
,   path = require('path')
,   app = express()
,   createErrors = require('http-errors')
,   Event = require('./models/Event')
,   Category = require('./models/Category')
,   mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

app.use(express.static(path.join(__dirname, 'public')))
app.get('/categories', async (req, res) => {
  Category.find()
  .then(categories => res.json({ result: categories.map(c => c.toJSON({ virtuals: true }))}))
})

app.get('/events', (req, res, next) => {
  Event.find()
  .then(events => {
    res.json({ result: events.map(e => e.toJSON({ virtuals: true }))})
  })
  .catch(next)
})

app.get('/events/:id/path', async (req, res, next) => {
  let { id } = req.params
  ,   { coords } = req.query

  if (!coords)
    return next(new createErrors.BadRequest())

  Event.findOne({ _id: id })
  .then(event => {
    if (!event)
      throw new createErrors.BadRequest()
    return event.getPaths(req.query.coords.split(',').map(Number))
  })
  .then(paths => res.json(paths))
  .catch(next)
})

app.use((error, req, res, next) => {
  console.log(error.stack)
  res.status(error.status)
  res.json(error)
})
module.exports = app
