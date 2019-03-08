const mongoose = require('mongoose');

const reviews = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    review: {
        type: String,
        required: [true, 'Review is required'],
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Book ID is required']
    },
    member_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Member ID is required']
    }
});

module.exports = mongoose.model('Reviews', reviews);
