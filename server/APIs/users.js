/**
 * API that handles user registration/login
 */
const express = require('express');
const router = express.Router();

//Import user schema
const User = require('../../db/schemas/user');

router.get('/', function (req, res) {
    res.send('Users API  works!');
});

/**
 * Registers user in the db
 * Requires first name, last name, email, password, and confirmation password
 */
router.post('/register', function (req, res) {
    console.log('Registering user');
    //Validate
    req.checkBody('firstname').notEmpty();
    req.checkBody('lastname').notEmpty();
    req.checkBody('email').notEmpty();
    req.checkBody('password').notEmpty();
    req.checkBody('password').isLength({min: 6});
    req.checkBody('email').isEmail();

    const errors = req.validationErrors();
    if (errors) {
        // Send error to front end
        console.log(errors[0].param);
        res.status(400);
        res.send(JSON.stringify({message: errors[0].param}));
    }
    else {
        // Get the values
        const userData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            password_conf: req.body.password_conf,
        };

        //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
            if (err) {
                res.status(400);
                return res.send(JSON.stringify({message: err}));
            } else {
                res.status(200);
                req.session.userId = user._id;
                return res.send({message: 'success'});
            }
        });

    }
});


/**
 * Login the user.
 * Requires email and password
 */
router.post('/login', function (req, res, next) {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error || !user) {
                res.status(400);
                return res.send(JSON.stringify({message: 'Wrong email or password.'}));
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        res.status(400);
        return res.send(JSON.stringify({message: 'All fields required.'}));
    }
});


/**
 * Get the user profile
 */
router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                res.status(400);
                return res.send(JSON.stringify({message: error}));
            } else {
                if (user === null) {
                    res.status(400);
                    return res.send(JSON.stringify({message: 'Not authorized!'}));
                } else {
                    return res.send(user);
                }
            }
        });
});


/**
 * Logout the user
 */
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                res.status(400);
                return res.send(JSON.stringify({message: err}));
            } else {
                res.status(200);
                return res.send({message: 'success'});
            }
        });
    }
});


module.exports = router;
