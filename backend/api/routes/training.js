const express = require('express');
const router = express.Router();

// Controllers
const training = require('./../controllers/training');

// Middlewares
const checkAuth = require('./../middlewares/check_auth');

router.post('/search', checkAuth, training.search); //Adding training data acc. to search

router.post('/book-recommendation', checkAuth, training.BookRecommendations); //Getting recommended books

module.exports = router;