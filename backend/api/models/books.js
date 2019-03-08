const mongoose = require('mongoose');

const books = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    book_name: {
        type: String,
        required: [true, 'Book Name is required'],
        unique: true
    },
    book_des: {
        type: String,
        required: [true, 'Book Description is required']
    },
    book_genres: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Book Genres are required']
    },
    book_authors: {
        type: String,
        required: [true, 'Book Authors are required']
    },
    book_rating: {
        type: Number,
        required: true
    },
    book_rating_count: {
        type: Number,
        required: true,
    },
    book_category: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Book Category is required'],
        ref: 'BooksCategories'
    },
    book_poster: String
});

/**
 *  `For search we need to define index for schema`
 * 
 *  schema.index({name: 'text', 'profile.something': 'text'}); 
 * 
 *  Or if you want to include all string fields in the index, use the '$**' wildcard:
 *  schema.index({'$**': 'text'});
 * */
books.index({book_name: 'text', book_authors: 'text', 'book_category.category_name': 'text'});
module.exports = mongoose.model('Books', books);