const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const options = {
    host: 'sql9.freemysqlhosting.net',
    port: '3306',
    user: 'sql9214195',
    password: '2ddXZXDT3m',
    database: 'sql9214195'
};
const connection = mysql.createConnection(options);


router.get('/', function (req, res) {
    res.send('Maintenance API  works!');
});


//Check connection to scrawler db
connection.connect(function (error) {
    if (!error) {
        console.log('Connected to DB Trainer!')
    } else {
        console.log('There was an error connecting to the database');
    }
});


/**
 * Gets the last time the db was maintained
 */
router.get('/all_trainers', function (req, res) {

    console.log('SELECT last_maintenance FROM versions ');
    connection.query('SELECT last_maintenance FROM versions', function (err, rows) {
        if (err) console.log('There was an error ' + err);
        else {
            //If result is empty
            if (rows.length === 0) {
                res.json();
            }
            else {
                //Return the number of times it failed to load
                res.json({'last_maintenance': rows[0].last_maintenance});
            }
        }
    });
});