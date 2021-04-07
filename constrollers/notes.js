const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

notesRouter.get('/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

notesRouter.post('/', (request, response) => {
  const body = request.body

  if (!body.content) {
    response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })

  response.json(note)
})

notesRouter.put('/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => console.log(error))
})

notesRouter.delete('/:id', (request, response) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => console.log(error))
})

module.exports = notesRouter
