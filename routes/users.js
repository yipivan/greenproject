const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();


router.get('/login', (req, res) => {
});


router.post('/login', (req, res, next)=> {

});

router.post('/register', (req, res) => {

});


router.get('/logout', (req, res) => {
    req.logout();
    req.redirect('/')
});

module.exports = router;