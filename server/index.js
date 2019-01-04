const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(expressSession);
const emoji = require('node-emoji')

const app = express();

const users = require('./APIs/users');
const dataCollection = require('./APIs/dataCollection');
const dataAnalysis = require('./APIs/dataAnalysis');

// Connect to DB
const dbUri = process.env.NODE && ~process.env.NODE.indexOf("heroku") ? process.env.DBURI : require('./secrets')['dbUri']
mongoose.connect(dbUri, function(err, db) {
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
app.use('/api/dataCollection', dataCollection);
app.use('/api/dataAnalysis', dataAnalysis);

app.get('/api', function (req, res) {
    res.send('Server is working!')
});

app.get('/', function (req, res) {
  res.send(`Well, hello. Made with ${emoji.get('heart')} and lots of ${emoji.get('coffee')}.`)
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server running on http://localhost:" + PORT);
});



