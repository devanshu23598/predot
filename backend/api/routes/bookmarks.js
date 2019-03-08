const express = require('express');
const router = express.Router();

// Controller
const bookmarks = require('./../controllers/bookmarks');

// Middleware
const checkAuth = require('./../middlewares/check_auth');

router.post('/add', checkAuth ,bookmarks.addBook);
router.post('/get', checkAuth ,bookmarks.getBooks);
router.post('/check', checkAuth ,bookmarks.checkBookmark);

module.exports = router;