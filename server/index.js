const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const port = process.env.PORT || 3000;

const app = express();
const http = require('http').Server(app);

const API_URL = 'https://doggo.herokuapp.com';

const MongoClient = require('mongodb').MongoClient;
// Todo: Change, not working for me (probably security settings need to be changed to whitelist IPs)
// const DB_URI = "mongodb+srv://admin:doggorocks!@doggo-z5a8n.azure.mongodb.net/doggo?retryWrites=true";
const DB_URI = "mongodb+srv://rafael:doggo@cluster0-i0uku.azure.mongodb.net/test?retryWrites=true";


const users = require('./APIs/users');
const data_collection = require('./APIs/data_collection');
const data_analysis = require('./APIs/data_analysis');


/**
 * Check db connection
 */
MongoClient.connect(DB_URI, function(err, db) {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log("Database is working!");
    db.close();
});

// To support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
// To support JSON-encoded bodies
app.use(bodyParser.json());

//To read cookies with our secret
app.use(cookieParser('JlNyXZDRfW8bKhZT9oR5XYZ'));
//To configure our session that can be stored in the db
app.use(expressSession({
    secret: 'JlNyXZDRfW8bKhZT9oR5XYZ',
    resave: true,
    saveUninitialized: true,
}));

//To check syntax
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        let namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect to Flash
app.use(flash());

// Global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// To start passport
app.use(passport.initialize());
app.use(passport.session());

// Set up the routes urls
// app.use('api/users', users);
// app.use('api/trainers', training);
// app.use('api/data_analysis', data_analysis);

/**
 * Logs in the user using the local strategy of passport. This function is called from api_users/login
 */
passport.use(new LocalStrategy(
    function (username, password, done) {
        //We find the associated username in our db. Note that we are using the email as the username
        connection.query('SELECT id, password, first_name, last_name FROM users WHERE email = ?', [username], function (err, results, fields) {
            if (err) {
                done(err)
            }
            //If there is no user with this email
            if (results.length === 0) {
                done('There is no user with such email');
            } else {
                //Get the hashed password in the db
                const hash = results[0].password.toString();
                //Verify if password matches
                bcrypt.compare(password, hash, function (err, response) {

                    //If they match, return the user id
                    if (response === true) {
                        //Pass the id, the first and last name of the user
                        return done(null, {
                            user_id: results[0].id,
                            first_name: results[0].first_name,
                            last_name: results[0].last_name
                        });

                    } else {
                        return done(null, false);
                    }
                });

            }
        });
    }));


http.listen(port, function () {
    console.log("Server running on localhost: " + port);
});

/**
 * Check if server is running by going to localhost:3000
 */
app.get('/api', function (req, res) {
    res.send('Server is working')
});