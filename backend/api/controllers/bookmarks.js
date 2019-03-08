const mongoose = require('mongoose');

// Models
const Bookmarks = require('./../models/bookmarks');

// Helpers
const validateBookId = require('./../helpers/validate_book_id');

exports.getBooks = (req, res) => {
    Bookmarks.find({
        member_id: req.authData.member_id,
    }).select('book_id').populate('book_id').exec().then(result => {
        if (result.length > 0) {
            res.status(200).json({
                response: true,
                bookmarks: result
            });
        } else {
            res.status(404).json({
                response: false,
                msg: 'No Bookmarks Found'
            })
        }
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal Error Occured'
        });
    })
}

exports.addBook =  (req, res) => {
    Bookmarks.findOne({
        book_id: req.body.book_id,
        member_id: req.authData.member_id
    }).exec().then(result => {
        if (result) {
            Bookmarks.deleteOne({
                book_id: req.body.book_id,
                member_id: req.authData.member_id
            }).exec().then(result => {
                res.status(500).json({
                    response: true,
                    msg: 'Book removed from your bookmark list.'
                });
            }).catch(err => {
                res.status(500).json({
                    response: false,
                    msg: 'Internal Error Occurred'
                });
            });
        } else {
            validateBookId(req.body.book_id).then(bookExist => {
                const bookmarks = new Bookmarks({
                    _id: new mongoose.Types.ObjectId(),
                    book_id: req.body.book_id,
                    member_id: req.authData.member_id
                });
                bookmarks.save().then(result => {
                    res.status(201).json({
                        response: true,
                        msg: 'Book added to your bookmark list.'
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
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal Error Occured'
        });
    });
}
