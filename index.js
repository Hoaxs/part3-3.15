require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json());
app.use(cors());



app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined) {

        return response.status(400).json({ error: 'content missing' })

    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/api/persons', (request, response) => {

    Person.find({}).then(person => {
        response.json(person)
    })
})

console.log()
// use Mongoose findById method
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(400).end()
            }

        })
        .catch(error => {
            console.log(error)
            response.status(500).send({ error: 'malformed id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(request.params.id)
            response.status(204).end()
        })
        .catch(error => console.log(error))
})


const PORT = process.env.PORT
app.listen(PORT, () => { console.log(`Running on port ${PORT}`) })