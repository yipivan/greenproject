require("dotenv").config();
const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');

const path = require('path');
const bodyParser = require('body-parser');

const Sequelize = require('sequelize');

const app = express();
const passport = require('passport')
require('./config/passport')(passport)

const users = require('./routes/users');
const recyclePoints = require('./routes/recycle-points');

// const connection = new Sequelize('ellqmtpo', 'ellqmtpo', 'v7RYEcj5f1GIvXKMpxDUxoVzPldXYmB4', {
//     host: 'baasu.db.elephantsql.com',
//     dialect: 'postgres'
// })

// connection
//     .authenticate()
//     .then(() => console.log('SQL Connected...'))
//     .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
// Create user object for global access
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    res.locals.login_error = req.flash("login_error")
    res.locals.register_error = req.flash("register_error")
    next();
});

// index route
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/login',(req, res) => {
    //res.sendFile(__dirname + '/login.html');
    res.render('users/login');
});

// test route only added for test, to be deleted once test done
app.get('/profiletest', (req, res) => {
    res.render('users/profile');
});

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
    });

// use routes
app.use('/users', users);
app.use('/recycle-points', recyclePoints);


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
