const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(expressSession);

import { getSecret } from './secrets';

const app = express();
const API_URL = 'https://doggo.herokuapp.com';
const PORT = process.env.PORT || 3001;

const users = require('./APIs/users');
const dataCollection = require('./APIs/dataCollection');
const dataAnalysis = require('./APIs/dataAnalysis');

// Connect to DB
// Note: You have to whitelist your IP & change username in dbUri string (I use admin) to connect
mongoose.connect(getSecret('dbUri'), function(err, db) {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log("Database is working!");
});
const db = mongoose.connection;

// Support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
// Support JSON-encoded bodies
app.use(bodyParser.json());

// Rread cookies with our secret
app.use(cookieParser('JlNyXZDRfW8bKhZT9oR5XYZ'));

// Use sessions for tracking logins
app.use(expressSession({
    secret: 'work JlNyXZDRfW8bKhZT9oR5XYZ',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// Syntax checker
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

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// API routes
app.use('/api/users', users);
app.use('/api/data_collection', dataCollection);
app.use('/api/data_analysis', dataAnalysis);

app.get('/api', function (req, res) {
    res.send('Server is working!')
});

app.get('/', function (req, res) {
  res.send('Well hello.')
});

app.listen(PORT, function () {
  console.log("Server running on http://localhost:" + PORT);
});



