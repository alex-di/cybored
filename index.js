var app = require('express')()
,   createErrors = require('http-errors')
,   API = require('./api')

const Api = new API()

app.get('/categories', async (req, res) => {
  res.json(await Api.getCategories())
})

app.get('/events', async (req, res) => {
  res.json(await Api.getEvents())
})

app.get('/events/:id/path', async (req, res, next) => {
  let { id } = req.params

  if (!id)
    return next(new createErrors.BadRequest())

  res.json(await Api.getPath(id))
})

app.use((req, res, next, error) => {
  console.log(error.stack)
  res.status(error.status)
  res.json(e)
})
module.exports = app
