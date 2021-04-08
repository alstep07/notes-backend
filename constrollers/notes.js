const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  response.json(note)
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.content) {
    response.status(400).json({
      error: 'content missing'
    })
  } else {
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date()
    })

    const savedNote = await note.save()
    response.json(savedNote)
  }
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = notesRouter
