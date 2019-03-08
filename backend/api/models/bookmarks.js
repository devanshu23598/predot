const mongoose = require('mongoose');

const bookmarks = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    book_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: [true, 'Book ID is required!'],
        ref: 'Books'
    },
    member_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, 'Member ID is required!'],
    }
});

module.exports = mongoose.model('Bookmarks', bookmarks);