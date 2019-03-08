const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

// Models
const Members = require('./../models/members');
const LoginVerification = require('./../models/login_verification');

exports.signup = (req, res) => {
    Members.findOne({
        $or: [
            {username: req.body.username}, {phone_number: req.body.phone_number}
        ]
    }).exec().then(result => {
        if (!result) {
            const member = new Members({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password:  passwordHash.generate(req.body.password),
                phone_number: req.body.phone_number,
                status: false
            });
            const opt = otpGenerator.generate(4, {
                alphabets: false,
                specialChars: false,
                upperCase: false,
            });
            const loginVerification = new LoginVerification({
                _id: new mongoose.Types.ObjectId(),
                one_time_password: opt,
                member_id: member._id
            });
            member.save().then(result => {
                loginVerification.save().then(optResult => {
                    sendOTP(result.phone_number, optResult.one_time_password);
                    res.status(201).json({
                        response: true,
                        is_opt_generated: true,
                        msg: 'Member Created',
                    });
                }).catch(err => {
                    Members.deleteOne({_id: result._id}).exec().then(res => {
                        res.status(500).json({
                            response: false,
                            msg: 'Please try again, internal error occured!'
                        });
                    }).catch(err => {
                        res.status(500).json({
                            response: false,
                            msg: 'Internal error occured, please contact Admistrator for any help!!'
                        });
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
        } else {
            let error;
            if (result.username === req.body.username) {
                error = 'Username already exist';
            } else if (result.phone_number === req.body.phone_number) {
                error = 'Phone Number already exist'
            }
            res.status(409).json({
                response: false,
                msg: error
            });
        }
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal error occured'
        });
    });
}

exports.verification = (req, res) => {
    LoginVerification.findOne({
        one_time_password: req.body.otp,
        member_id: req.authData.member_id
    }).exec().then(result => {
        if (result) {
            Members.updateOne({
                _id: req.authData.member_id
            }, {
                $set: {status: true}
            }).exec().then(update => {
                if (update.nModified > 0) {
                    LoginVerification.deleteOne({member_id: req.authData.member_id}).exec().then(del => {
                        res.status(200).json({
                            response: true,
                            msg: 'Member Verified Successfully',
                        });
                    });
                } else {
                    res.status(200).json({
                        response: true,
                        msg: 'Member Already Verified!'
                    });
                }
            }).catch(err => {
                res.status(500).json({
                    response: false,
                    msg: 'Internal Error Occured!'
                });
            });
        } else {
            res.status(400).json({
                response: false,
                msg: 'Invalid One Time Password'
            });
        }
    }).catch();
}

exports.login = (req, res) => {
    Members.findOne({username: req.body.username}).exec().then(result => {
        if (result) {
            if (passwordHash.verify(req.body.password, result.password)) {
                const token = jwt.sign({
                    member_id: result._id,
                    username: result.username,
                    phone_number: result.phone_number,
                },'65TG7G', {expiresIn: '30d'});
                if (result.status) {
                    res.status(200).json({
                        response: true,
                        token: token,
                        is_active: result.status,
                        msg: 'Access Granted'
                    });
                } else {
                    res.status(200).json({
                        response: true,
                        token: token,
                        is_active: result.status,
                        msg: 'Access Granted'
                    });
                }
                
            } else {
                res.status(401).json({
                    response: false,
                    msg: 'Invalid Credentials'
                });
            }
        } else {
            res.status(401).json({
                response: false,
                msg: 'Invalid Credentials'
            });
        }
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal Error Occured!!',
        });
    });
}

exports.resendOTP = (req, res) => {
    Members.findOne({_id: req.authData.member_id}).exec().then(member => {
        if (member) {
            LoginVerification.findOne({member_id: member._id}).exec().then(response => {
                if (response) {
                    sendOTP(member.phone_number, response.one_time_password);
                    res.status(200).json({
                        response: true,
                        msg: 'OTP sended successfully'
                    });
                } else {
                    res.status(200).json({
                        response: true,
                        msg: 'Member already verified'
                    });
                }
            }).catch(err => {
                res.status(500).json({
                    response: false,
                    msg: 'Internal error occured!'
                });
            })
        }
    }).catch(err => {
        res.status(500).json({
            response: false,
            msg: 'Internal error occured!'
        });
    });
}

sendOTP = (phone_number, otp) => {
    let mobile_number = phone_number;
    let authkey = '256278ATVQwcrqmx5c38b4ad';
    let msg = 'Use '+otp+' as your OTP for Signup Verification';
    fetch('http://api.msg91.com/api/sendhttp.php?country=91&sender=QUARTO&route=4&mobiles='+mobile_number+'&authkey='+authkey+'&message='+msg,{mode:'no-cors',method:'GET'});
}