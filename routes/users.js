const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const router = express.Router();

// Load User Model
require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req, res) => {

});


router.post('/login', (req, res, next)=> {

});

router.post('/register', (req, res) => {

});


router.get('/logout', (req, res) => {
    
});

module.exports = router;