const mongoose = require('mongoose');

const training = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    input: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Genres are required']
    },
    output: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Book Score is required']
    },
    member_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Members'
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Books'
    },
    book_rating: {
        type: Number,
        required: [true, 'Book Rating is Required']
    },
    training_type: {
        type: String,
        required: [true, 'Training type is Required'],
    }
});

module.exports = mongoose.model('Training', training);