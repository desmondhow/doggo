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
    req.checkBody('first_name').notEmpty();
    req.checkBody('last_name').notEmpty();
    req.checkBody('email').notEmpty();
    req.checkBody('password').notEmpty();
    req.checkBody('password_conf').notEmpty();
    const errorsMissingInput = req.validationErrors();
    if (errorsMissingInput) {
        return res.status(400).send(JSON.stringify({message: 'Please fill all fields'}));
    }
    req.checkBody('password').isLength({min: 6});
    const passwordLengthError = req.validationErrors();
    if (passwordLengthError) {
        return res.status(400).send(JSON.stringify({message: 'Your password needs to have at least 6 characters'}));
    }

    req.checkBody('email').isEmail();
    const invalidEmail = req.validationErrors();
    if (invalidEmail) {
        return res.status(400).send(JSON.stringify({message: 'Invalid email'}));
    }

    if (req.body.password !== req.body.password_conf) {
        return res.status(400).send(JSON.stringify({message: 'Your password does not match!'}));
    }

    else {
        // Get the values
        const userData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
        };

        // Check if user already exist
        User.findOne({'email': userData.email}, 'name occupation', function (err, user) {
            if (user !== undefined && user != null) {
                return res.status(400).send(JSON.stringify({message: 'You already have an account'}));
            } else {
                //use schema.create to insert data into the db
                User.create(userData, function (err, user) {
                    if (err) {
                        return res.status(400).send({message: JSON.stringify(err)});
                    } else {
                        req.session.userId = user._id;
                        //Send user id
                        return res.status(200).send({message: user._id, status: 200});
                    }
                });
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
                return res.send({message: user.id, status: 200});
            }
        });
    } else {
        res.status(400);
        return res.send(JSON.stringify({message: 'All fields required.'}));
    }
});


/**
 * Get the user profile in the app
 */
router.get('/profile/:id', function (req, res, next) {
    User.findById(req.params.id)
        .exec(function (error, user) {
            if (error) {
                res.status(400);
                return res.send(JSON.stringify({message: error}));
            } else {
                if (user === null) {
                    res.status(400);
                    return res.send(JSON.stringify({message: 'Not authorized!'}));
                } else {
                    return res.status(200).send({
                        first_name: user.first_name,
                        last_name: user.last_name,
                        message: 'success'
                    });
                }
            }
        });
});


//
// /**
//  * Get the user profile
//  */
// router.get('/profile', function (req, res, next) {
//     console.log(req.session.userId);
//     User.findById(req.session.userId)
//         .exec(function (error, user) {
//             if (error) {
//                 res.status(400);
//                 return res.send(JSON.stringify({message: error}));
//             } else {
//                 if (user === null) {
//                     res.status(400);
//                     return res.send(JSON.stringify({message: 'Not authorized!'}));
//                 } else {
//                     return res.send(user);
//                 }
//             }
//         });
// });


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
                req.session = null;
                // const sessionStore = req.app.get('sessionStore');
                // sessionStore.destroy(req.session.userId, true);
                return res.send({message: 'success'});
            }
        });
    }
});


module.exports = router;