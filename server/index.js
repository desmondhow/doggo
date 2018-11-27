const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
const port = process.env.PORT || 3001;
const MongoStore = require('connect-mongo')(expressSession);

const app = express();

const API_URL = 'https://doggo.herokuapp.com';

const mongoose = require('mongoose');
// Todo: Change, not working for me (probably security settings need to be changed to whitelist IPs)
// const DB_URI = "mongodb+srv://admin:doggorocks!@doggo-z5a8n.azure.mongodb.net/doggo?retryWrites=true";
const DB_URI = "mongodb+srv://rafael:doggo@cluster0-i0uku.azure.mongodb.net/doggo?retryWrites=true";

const users = require('./APIs/users');
const data_collection = require('./APIs/data_collection');
const data_analysis = require('./APIs/data_analysis');


/**
 * Check db connection
 */
mongoose.connect(DB_URI, function(err, db) {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log("Database is working!");
});
const db = mongoose.connection;


// To support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
// To support JSON-encoded bodies
app.use(bodyParser.json());

//To read cookies with our secret
app.use(cookieParser('JlNyXZDRfW8bKhZT9oR5XYZ'));

const sessionStore =  new MongoStore({
    mongooseConnection: db,
    clear_interval: 3600
});

//Use sessions for tracking logins
app.use(expressSession({
    secret: 'JlNyXZDRfW8bKhZT9oR5XYZ',
    //Max time session can be active
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    resave: true,
    saveUninitialized: false,
    store: sessionStore
}));

//To check syntax
app.use(expressValidator());

// Connect to Flash
app.use(flash());

// Global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Set up the routes urls
app.use('/api/users', users);
app.use('/api/data_collection', data_collection);
app.use('/api/data_analysis', data_analysis);



app.listen(port, function () {
    console.log("Server running on localhost: " + port);
});

/**
 * You can check if server is running by going to localhost:3000
 */
app.get('/api', function (req, res) {
    res.send('Server is working')
});


