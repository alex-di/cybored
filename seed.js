const mongoose = require('mongoose')
,     fs = require('fs')
,     Category = require('./models/Category')
,     Event = require('./models/Event')
,     parse = require('csv-parse/lib/sync')
,     data = fs.readFileSync('./data.csv').toString()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

let list = [
  'Diving',
  'Skiing',
  'Kiting',
  'Surfing',
  'Hiking'
]

// Promise.all(list.map(c => Category.create({ title: c })))
Promise.all(parse(data).map((item, i) => {
  let [title, description, link, video, phone, contactInfo, image, mapLink, coords] = item
  ,   category
  switch (i) {
    case 0:
      category = '5d330fa67fefb60ae42df74a'
      break;
    case 1:
      category = '5d330fa67fefb60ae42df74c'
      break
    case 2:
    case 3:
      category = '5d330fa67fefb60ae42df74d'
      break
    case 4:
      category = '5d330fa67fefb60ae42df74e'
      break

    case 5:
      category = '5d330fa67fefb60ae42df74b'

    default:

  }
  return Event.create({
    title,
    description,
    link,
    video,
    phone,
    contactInfo,
    image,
    coords: coords.split(',').map(Number),
    category
  })
}))
.then(() => console.log("done"))
