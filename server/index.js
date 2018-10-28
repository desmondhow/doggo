const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const apiUsers = require('./APIs/api_users');

const mysql = require('mysql');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
//To start a session
const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);
const options = {
    host: 'sql9.freemysqlhosting.net',
    port: '3306',
    user: 'sql9214195',
    password: '2ddXZXDT3m',
    database: 'sql9214195'
};
const bcrypt = require('bcrypt');

const connection = mysql.createConnection(options);
const sessionStore = new MySQLStore({}, connection);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const port = process.env.PORT || 3000;

//For Server to communicate between instances
const app = express();
const http = require('http').Server(app);

//To let routers use io
app.io = io;
global.app = app;


app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//To check syntax
app.use(expressValidator());
//To read cookies with our secret
app.use(cookieParser('JlNyXZDRfW8bKhZT9oR5XYZ'));
//To configure our session that can be stored in the db
app.use(expressSession({
    secret: 'JlNyXZDRfW8bKhZT9oR5XYZ',
    resave: false,
    saveUninitialized: false,
    // maxAge: ,
    store: sessionStore,
    //Todo: change this
    cookie: {secure: false}
}));

//To start passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api_users', apiUsers);
app.use('/api_maintenance', apiMaintenance);

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


//Default page is index
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
});




const API_URL = 'https://doggo.herokuapp.com'


app.get('/api/getAllSessions', (req, res) => {
    res.sendFile({'current': 'data'});
});

app.get('/api/getCurrentUDCSessions', (req, res) => {
    res.sendFile({'current': 'data'});
});


http.listen(port, function () {
    console.log("Server running on localhost: " + port);
});