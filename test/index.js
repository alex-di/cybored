/*
GET Path(from, to, date) {
[
{
  startAt
  endAt
  path
  {
    [
      {
        type<walk/bus/>
        transportNumber
        startAt
        endAt
        price
      }
    ]
  }
}
]
}

*/

const assert = require('assert')
,     fetch = require('node-fetch')
,     app = require('../')
,     ROOT = 'http://localhost:8080'
,     PATH_TYPES = ['walk', 'drive', 'bus']

describe('USER INTERFACE', () => {
  let server
  before(() => {
    server = app.listen(8080)
  })

  it('Shows caregories', async () => {
    let res = await fetch(ROOT + '/categories', {})
    ,   data = await res.json()
    assert.ok(Array.isArray(data))
    assert.ok(data.length)
    data.forEach(cat => {
      assert.ok(cat.id)
      assert.ok(cat.title)
    })
  })

  it('Shows events', async () => {
    let res = await fetch(ROOT + '/events', {})
    ,   data = await res.json()

    assert.ok(data.length)
    data.forEach(event => {
      assert.ok(event.startAt)
      assert.ok(event.endAt)
      assert.ok(event.description)
      assert.ok(event.title)
      assert.ok(event.path)
      assert.ok(Array.isArray(event.path))
      assert.ok(event.path.length)
      event.path.forEach(path => {
        assert.ok(PATH_TYPES.includes(path.type))
      })
    })
  })

  it('Shows paths', async () => {
    let res = await fetch(ROOT + `/events/${id}/path`)
    ,   data = await res.json()

    assert.ok()
  })

  after(() => {
    server.close()
  })
})
