"use strict"

const express = require('express')
const path = require('path');
const app = express()
const port = process.env.PORT || 3001;

// Adds in the body parser for form data //
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var youtubeRouter = require('./routes/Youtube').router;

app.use('/youtube/', youtubeRouter);

if (process.env.PRODUCTION) {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '/../../build')));
    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '/../../build', 'index.html'));
    });
}

app.listen(port);

module.exports = app;