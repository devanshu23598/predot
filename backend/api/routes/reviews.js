const express = require('express');
const router = express.Router();

// Controller
const reviews = require('./../controllers/reviews');

// Middleware
const checkAuth = require('./../middlewares/check_auth');

router.post('/add', checkAuth, reviews.addReview);

module.exports = router;