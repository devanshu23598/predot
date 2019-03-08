const express = require('express');
const router = express.Router();

// Controller
const members = require('./../controllers/members');

// Middlewares
const checkAuth = require('./../middlewares/check_auth');

// Routes
router.post('/signup', members.signup);
router.post('/verification', checkAuth, members.verification);
router.post('/login', members.login);
router.post('/resend-otp', checkAuth, members.resendOTP);

module.exports = router;