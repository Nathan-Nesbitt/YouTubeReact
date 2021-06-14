"use strict"

const express = require('express')

const app = express()
const port = process.env.PORT || 3001;

// Adds in the body parser for form data //
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var youtubeRouter = require('./routes/Youtube');

app.use('/youtube/', youtubeRouter);

app.listen(port);

module.exports = app;