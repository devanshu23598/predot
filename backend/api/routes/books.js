const express = require('express');
const multer = require('multer');
const uniqid = require('uniqid');
const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, uniqid()+file.originalname);
    }
});
const upload = multer({storage});

// Controller
const books = require('./../controllers/books');

// Middleware
const checkAuth = require('./../middlewares/check_auth');

router.post('/add-book', upload.single('book_poster'), books.addBook);
router.post('/add-category', books.addCategory);
router.post('/book-rating', checkAuth, books.bookRating);
router.post('/get-all', books.getAll);
router.post('/get-limited/:limit', books.getLimited);
router.post('/get-by-id', checkAuth, books.getOne);
router.post('/get-by-search', books.search);
router.post('/get-categories', books.getCategories);

module.exports = router;