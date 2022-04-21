const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://phonebook:${password}@cluster0.9dgp0.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
} else if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result =>{
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length > 3 ) {
    const person = new Person({
    name: name,
    number: number,
    })

    person.save().then(result => {
    console.log('contact saved!')
    mongoose.connection.close()
    })
}