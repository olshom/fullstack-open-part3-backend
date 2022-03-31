const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':body'))
app.use(express.static('build'))
let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

const generateId = () => {
  const maxId = persons.length > 0 
  ? Math.max(...persons.map(person => person.id))
  : 0
  return maxId + 1
}

app.get('/info', (request, response) => {
    const date = new Date
    response.send(`Phonebook has info for ${persons.length} ${persons.length === 1 
        ? 'person' : 'people'} <br/> ${date}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(400).end()
    }
})

app.delete('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons/',(request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({error: 'name missing'})
  } if (!body.number) {
    return response.status(400).json({error: 'number missing'})
  } if (persons.find(person => person.name === body.name)) {
    return response.status(409).json({error: 'name must be unique'})
  }

  const person = {
    id: generateId(),
    name: body.name, 
    number: body.number,
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})
