const Books = require('./../models/books');

module.exports = validateBookId = (book_id) => {
    return new Promise((resolve, reject) => {
        Books.findOne({
            _id: book_id
        }).exec().then(result => {
            if (result) {
                resolve(true);
            } else  {
                reject(false);
            }
        }).catch(err => {
            reject(false);
        });
    });
}