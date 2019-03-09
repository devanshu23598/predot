const mongoose = require('mongoose');
const brain = require('brain.js');

//Models
const Training = require('./../models/training');
const Books = require('./../models/books');
const BookRecommendations = require('./../models/book_recommendations');

exports.search = (req, res) => {
    Training.findOne({
        member_id: req.authData.member_id,
        book_id: req.body.book_id,
        training_type: 'search'
    }).exec().then(result => {
        if (result) {
            res.status(200).json({
                response: true,
                msg: 'Training data for this book is already added'
            });
        } else {
            const training = new Training({
                _id: new mongoose.Types.ObjectId(),
                input: req.body.genres,
                output: [0.5],
                member_id: req.authData.member_id,
                book_id: req.body.book_id,
                book_rating: 0,
                training_type: 'search'
            });
            training.save().then(result => {
                const io = req.app.get('socketio'); // Socket.io Object
                // Socket.io - Connection Event - Start
                io.emit('fetch_recommended_books');
                // Socket.io - Connection Event - End
                res.status(200).json({
                    response: true, result, 
                    msg: 'Data added to training model'
                });
            }).catch(err => {
                res.status(500).json({
                    response: false,
                    msg: (Object.keys(err.errors).map((key) => {
                        return err.errors[key]['message']
                    }))[0]
                });
            })
        }
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal error occured'
        });
    });
    
}

exports.BookRecommendations = (req, res) => {
    Training.countDocuments({
        member_id: req.authData.member_id
    }).exec().then(result => {
        // Check number of records in training collection
        if (result >= 8) {
            const network = new brain.NeuralNetwork();
            Training.find({
                member_id: req.authData.member_id
            },{ _id: 0}).select('input output').exec().then(trainedData => {
                // Getting Trained Data
                Training.find({
                    member_id: req.authData.member_id,
                    training_type: 'rating'
                },{ _id: 0}).select('book_id').exec().then(ninBooks => {
                    /**
                     * Run neural network only for those books which are 
                     * not present in training data.
                     * */
                    let nin = [];
                    ninBooks.forEach((book, index) => {
                        nin.push(book.book_id);
                    });

                    network.train(trainedData);

                    let trainingResult = [];
                    Books.find({
                        _id: {$nin: nin}
                    }).select('book_genres').then(books => {
                        books.forEach((book, index) => {
                            const [score] = network.run(book.book_genres);
                            trainingResult.push({
                                "book_id": book._id,
                                "score": score
                            });
                        });
                        const sortedResult = trainingResult.sort((a, b) => {
                            var a = a.score;
                            var b = b.score;
                            return b - a;
                        });
                        let top10 = []; // Getting Top 10 Recommended Book
                        for (let i = 1; i<=10; i++) {
                            top10.push(sortedResult[i]['book_id']);
                        }
                    
                        Books.find({
                            _id: {$in: top10}
                        }).exec().then(finalData => {
                            res.status(200).json({
                                response: true,
                                books: finalData
                            });
                        }).catch(err => {
                            res.status(500).json({
                                response: false,
                                msg: 'Internal error occured!!',
                            });
                        });
                        
                    }).catch(err => {
                        res.status(500).json({
                            response: false,
                            msg: 'Internal error occured!!',
                        });
                    });
                });
            }).catch(err => {
                res.status(500).json({
                    response: false,
                    msg: 'Internal error occured!!'
                });
            });
        } else {
            res.status(404).json({
                response: false,
                msg: 'No Book Recommendation Found!!'
            });
        }
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal error occured',
            err
        });
    });
}