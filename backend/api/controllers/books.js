const mongoose = require('mongoose');

// Models
const Books = require('./../models/books');
const BooksCategories = require('./../models/books_categories');
const Training = require('./../models/training');

exports.addBook = (req, res) => {
    const books =  new Books({
        _id: new mongoose.Types.ObjectId(),
        book_name: req.body.book_name,
        book_des: req.body.book_des,
        book_genres: JSON.parse(req.body.book_genres),
        book_authors: req.body.book_authors,
        book_rating: req.body.book_rating,
        book_rating_count: req.body.book_rating_count,
        book_category: req.body.book_category,
        book_poster: req.file.path
    });
    books.save().then(result => {
        res.status(201).json({
            response: true,
            data: result,
            msg: 'Book Added!!'
        });
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: (Object.keys(err.errors).map((key) => {
                return err.errors[key]['message']
            }))[0]
        });
    });
}

exports.addCategory = (req, res) => {
    const books_categories = new BooksCategories({
        _id: new mongoose.Types.ObjectId(),
        category_name: req.body.category_name
    });

    books_categories.save().then(result => {
        res.status(200).json({
            response: true,
            data: result,
            msg: 'Category Added!!'
        });
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg:  err
        });
    });
}

exports.getLimited = (req, res) => {
    Books.find({book_category: req.body.book_category}).sort({book_rating: 'desc'}).limit(parseInt(req.params.limit)).exec().then(result => {
        if (result.length > 0) {
            res.status(200).json({
                response: true,
                books: result
            });
        } else {
            res.status(404).json({
                response: false,
                msg: 'Books not found!!'
            });
        }
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal error occured'
        });
    });
}

exports.getAll = (req, res) => {
    Books.find({book_category: req.body.book_category}).exec().then(result => {
        if (result.length > 0) {
            res.status(200).json({
                response: true,
                books: result
            });
        } else {
            res.status(404).json({
                response: false,
                msg: 'Books not found!!'
            });
        }
        
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal error occured'
        });
    });
}

exports.getOne = (req, res) => {
    Books.findOne({_id: req.body.book_id}).exec().then(result => {
        if (result) {
            res.status(200).json({
                response: true,
                book: result
            });
        } else {
            res.status(404).json({
                response: false,
                msg: 'Book not found!!'
            });
        }
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal Error Occured'
        });
    });
}

exports.getCategories = (req, res) => {
    BooksCategories.find().exec().then(result => {
        res.status(200).json({
            response: true,
            categories: result
        });
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal Error Occured'
        });
    });
}

exports.bookRating = (req, res) => {
    Books.findOne({
        _id: req.body.book_id
    }).exec().then(book => {
        if (book) {
            Training.findOne({
                book_id: req.body.book_id,
                member_id: req.authData.member_id,
                training_type: 'rating'
            }).exec().then(result => {
                if (result) {
                    updateBookRating(req, res);
                } else {
                    addBookRating(req, res);
                }
            }).catch(err => {
                res.status(500).json({
                    response: false,
                    msg: 'Internal error occured!'
                });
            });
        } else {
            res.status(404).json({
                response: false,
                msg: 'Book not found!!'
            });
        }
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal error occured!'
        });
    });
    
}

updateBookRating = (req, res) => {
    Training.updateOne({
        book_id: req.body.book_id,
        member_id: req.authData.member_id,
        training_type: 'rating'
    }, {
        $set: {
            book_rating: req.body.book_rating,
            output: [req.body.book_rating/5]
        }
    }).exec().then(update => {
        Books.updateOne({_id: req.body.book_id}, {
            $inc: {book_rating: req.body.book_rating},
         }).exec().then(update => {
            Books.findOne({_id: req.body.book_id}).select('book_rating_count').exec().then(result => {
                Books.updateOne({_id: req.body.book_id}, {
                    $mul: {book_rating: 0.5 },
                 }).exec().then(update => {
                    Training.countDocuments({
                        member_id: req.authData.member_id
                    }).exec().then(result => {
                        if (result >= 8) {
                            const io = req.app.get('io'); // Socket.io Object
                            // Socket.io - Connection Event - Start
                            io.emit('fetch_recommended_books');
                            // Socket.io - Connection Event - End
                        }
                    });
                    res.status(200).json({
                        response: true,
                        msg: 'Book Rating Updated!!'
                    });
                }).catch(err => {
                    res.status(500).json({
                        response: false,
                        msg: 'Internal error occured'
                    });
                });
            }).catch(err => {
                res.status(500).json({
                    response: false,
                    msg: 'Internal error occured'
                });
            });
         }).catch(err => {
            res.status(500).json({
                response: false,
                msg: 'Internal error occured'
            });
         });
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal error occured'
        });
    });
}

addBookRating = (req, res) => {
    const training = new Training({
        _id: new mongoose.Types.ObjectId(),
        input: req.body.genres,
        output: [req.body.book_rating/5],
        member_id: req.authData.member_id,
        book_id: req.body.book_id,
        book_rating: req.body.book_rating,
        training_type: 'rating'
    });
    training.save().then(training => {
        Books.updateOne({_id: training.book_id}, {
            $inc: {book_rating_count: 1, book_rating: training.book_rating },
         }).exec().then(update => {
            Books.findOne({_id: training.book_id}).select('book_rating_count').exec().then(result => {
                if (result.book_rating_count > 1) {
                    Books.updateOne({_id: training.book_id}, {
                        $mul: {book_rating: 0.5 },
                     }).exec().then(update => {
                        Training.countDocuments({
                            member_id: req.authData.member_id
                        }).exec().then(result => {
                            if (result >= 8) {
                                const io = req.app.get('io'); // Socket.io Object
                                // Socket.io - Connection Event - Start
                                io.emit('fetch_recommended_books');
                                // Socket.io - Connection Event - End
                            }
                        });
                        res.status(200).json({
                            response: true,
                            msg: 'Book Rated!!'
                        });
                     }).catch(err => {
                        res.status(500).json({
                            response: false,
                            msg: 'Internal error occured'
                        });
                     });
                } else {
                    Training.countDocuments({
                        member_id: req.authData.member_id
                    }).exec().then(result => {
                        if (result >= 8) {
                            const io = req.app.get('io'); // Socket.io Object
                            // Socket.io - Connection Event - Start
                            io.emit('fetch_recommended_books');
                            // Socket.io - Connection Event - End
                        }
                    });
                    res.status(200).json({
                        response: true,
                        msg: 'Book Rated!!'
                    });
                }
            }).catch(err => {
                res.status(500).json({
                    response: false,
                    msg: 'Internal error occured'
                });
            });
         }).catch(err => {
            res.status(500).json({
                response: false,
                msg: 'Internal error occured'
            });
         });
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: (Object.keys(err.errors).map((key) => {
                return err.errors[key]['message']
            }))[0]
        });
    });    
}

exports.search = (req, res) => {
    Books.find({$text: {$search: req.body.text}}).populate('book_category').exec().then(result => {
        if (result.length > 0) {
            res.status(200).json({
                response: true,
                books: result
            });
        } else {
            res.status(404).json({
                response: false,
                msg: 'No results found!!'
            });
        }
        
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal error occured',err
        });
    });
}