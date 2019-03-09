const mongoose = require('mongoose');

const bookRecommendations = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    member_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('BookRecommendations', bookRecommendations);
