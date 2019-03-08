const mongoose = require('mongoose');

// Models
const Reviews = require('./../models/reviews');

// Helpers
const validateBookId = require('validateBookId');

exports.addReview = (req, res) => {
    const reviews = new Reviews({
        _id: new mongoose.Types.ObjectId(),
        review: req.body.review,
        book_id: req.body.book_id,
        member_id: req.authData.member_id
    });
    validateBookId(req.body.book_id).then(bookExist => {
        reviews.save().then(result => {
            res.status(200).json({
                response: true,
                msg: 'Review added successfully'
            });
        }).catch(err => {
            res.status(500).json({
                response: false,
                msg: (Object.keys(err.errors).map((key) => {
                    return err.errors[key]['message']
                }))[0],
            });
        });
    }).catch(err => {
        res.status(404).json({
            response: false,
            msg: 'Invalid Book ID'
        });
    });
    
}

exports.getReviews = (req, res) => {
   Reviews.find({
       book_id: req.body.book_id
   }).populate('member_id').exec().then(result => {
       if (result.length > 0) {
           res.status(200).json({
               response: true,
               reviews: result
           });
       } else {
           res.status(404).json({
               response: false,
               msg: 'Be the first one to review.'
           });
       }
   }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal error occurred'
        });
   });
}