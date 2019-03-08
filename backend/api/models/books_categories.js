const mongoose = require('mongoose');

const books_categories = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category_name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('BooksCategories', books_categories);