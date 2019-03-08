const mongoose = require('mongoose');

// Models
const Reviews = require('./../models/reviews');

// Helpers
const validateBookId = require('./../helpers/validate_book_id');

exports.addReview = (req, res) => {
    const reviews = new Reviews({
        _id: new mongoose.Types.ObjectId(),
        review: req.body.review,
        book_id: req.body.book_id,
        member_id: req.authData.member_id
    });
    validateBookId(req.body.book_id).then(bookExist => {
        reviews.save().then(result => {
            Reviews.findOne({
              _id: result._id  
            }).populate('member_id').exec().then(review => {
                res.status(200).json({
                    response: true,
                    msg: 'Review added successfully',
                    review,
                });
            }).catch(err => {
                res.status(500).json({
                    response: false,
                    msg: 'Internal error occurred'
                });
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
   }).sort({_id: 'desc'}).populate('member_id').exec().then(result => {
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