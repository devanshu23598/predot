const mongoose = require('mongoose');

const login_verification = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    one_time_password: {
        type: Number,
        required: true
    },
    member_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Members'
    }
});

module.exports = mongoose.model('LoginVerification', login_verification);