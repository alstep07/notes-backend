const express = require('express');
const cors = require('cors');
const notesRouter = require('./constrollers/notes')

const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use('/api/notes', notesRouter)

module.exports = app
