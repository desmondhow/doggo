
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(expressSession);
const emoji = require('node-emoji');
const PORT = process.env.PORT || 3010;

const users = require('./APIs/usersAPI');
const sessions = require('./APIs/sessionsAPI');
const dataAnalysis = require('./APIs/dataAnalysisAPI');

const app = express();

// Connect to DB
var dbUri = process.env.NODE && ~process.env.NODE.indexOf("heroku") ? process.env.DBURI : require('./secrets').getSecret('dbUri')
console.log(dbUri);
mongoose.connect(dbUri, function(err, db) {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log("Database is working!");
});
const db = mongoose.connection;



// Rread cookies with our secret
app.use(cookieParser('JlNyXZDRfW8bKhZT9oR5XYZ'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(expressSession({
    name: 'logs',
    secret: 'work JlNyXZDRfW8bKhZT9oR5XYZ',
    resave: false,
    saveUninitialized: false,
    cookies: {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: false,
        secure: false
    },
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

// API routes
app.use('/api/users', users);
app.use('/api/users', sessions);

//Default page is index
app.get('/', function (req, res) {
    res.send('Server is working!')
});

app.listen(PORT, function () {
    console.log("Server running on http://localhost:" + PORT);
});



