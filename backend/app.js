const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const app = express();

// Routes
const members = require('./api/routes/members');
const books = require('./api/routes/books');
const training = require('./api/routes/training');
const bookmarks = require('./api/routes/bookmarks');
const reviews = require('./api/routes/reviews');

// Database Connectivity
mongoose.connect('mongodb://localhost:27017/bookrecommendation', {
    useCreateIndex: true,
    useNewUrlParser: true 
});

// Middlewares
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handling Routes
app.use('/members', members);
app.use('/books', books);
app.use('/training', training);
app.use('/bookmarks', bookmarks);
app.use('/reviews', reviews);
app.get("/uploads/:path", (req, res) => {
    res.sendFile(path.join(__dirname, './uploads/'+req.params.path));
});

// Handling Error
app.use((req, res, next) => {
    const error = new Error('Invalid Request');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        response: false,
        msg: error.message
    });
});

module.exports = app;
