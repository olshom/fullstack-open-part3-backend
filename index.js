require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':body'))
app.use(express.static('build'))
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/info', (_request, response) => {
  const date = new Date()
  Person.find({}).then((result) => {
    response.send(
      `Phonebook has info for ${result.length} ${
        persons.length === 1 ? 'person' : 'people'
      } <br/> ${date}`
    )
  })
})

app.get('/api/persons', (_request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons/', (request, response, next) => {
  const body = request.body

  Person.findOne({ name: body.name }).then((person) => {
    if (person) {
      return response.status(409).json({ error: 'this name already exist' })
    } else {
      const newPerson = new Person({
        name: body.name,
        number: body.number,
      })

      newPerson
        .save()
        .then((person) => {
          response.json(person)
        })
        .catch((error) => {
          next(error)
        })
    }
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log('test')
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'qvery' }
  )
    .then((result) => {
      response.json(result)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, _request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const unknownEndPoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndPoint)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
