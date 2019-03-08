const mongoose = require('mongoose');

const members = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    phone_number: {
        type: String,
        validate: {
            validator: value => {
                if (value.length === 10) {
                    return /^[0-9]+$/.test(value);
                } else {
                    return false;
                }
                
            },
            message: props => {
                return 'Phone Number is not valid'
            }
        },
        unique: true,
        required: [true, 'Phone Number is required'],
        
    },
    status: Boolean
});

module.exports = mongoose.model('Members', members);