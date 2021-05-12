const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {username: 1, name: 1})

  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  if (!body.content) {
    response.status(400).json({
      error: 'content missing'
    })
  } else {
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
      user: user._id
    })

    const savedNote = await note.save()
    user.notes = [...user.notes, savedNote._id]
    await user.save()

    response.json(savedNote)
  }
})

notesRouter.put('/:id', async (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedNote.toJSON())
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = notesRouter
