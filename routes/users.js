const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');


router.route('/signup')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/home' }), catchAsync(users.login))

router.get('/logout', users.logout)

module.exports = router;