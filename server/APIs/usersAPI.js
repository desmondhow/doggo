/**
 * API that handles user registration/login
 */
const express = require('express');
const router = express.Router();
import { isParamEmpty, errors } from './helpers';

//Import user schema
const User = require('../../db/schemas/userSchema');

router.get('/', function (req, res) {
    res.send('Users API works!');
});

/**
 * Registers user in the db
 * Requires first name, last name, email, password, and confirmation password
 */
router.post('/register', function (req, res) {
    console.log('Registering user');
    //Validate
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
router.get('/:id/profile', function (req, res, next) {
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
            return res.status(200).send(JSON.stringify({ dogs: user.dogs, trainers: user.trainers }));
          }
      }
    });
});

/**
 * Get the user profile in the app
 */
router.post('/:id/profile/add-trainer', function (req, res, next) {
  if (isParamEmpty(req, 'id')) {
    console.log(`UserId was not sent with request.`)
    return res.status(400).send(JSON.stringify({ message: errors.userId }));
  }
  else if (isParamEmpty(req, 'trainerName', true)) {
    const error = 'Trainer name was not sent with request.'
    console.log(error)
    return res.status(400).send(JSON.stringify({ message: error }));
  }

  const trainerData = {
    name: req.body.trainerName
  }

  User.findByIdAndUpdate(req.params.id, 
      { $push: { trainers: trainerData }},
    ((err, updatedUser) => {
      if (err) {
        console.log(err);
        return res.status(400).send(JSON.stringify({message: `Error adding trainer to user profile.`}));
      }
      console.log(`updatedUser: ${JSON.stringify(updatedUser)}`)
      return res.status(200).send({message: updatedUser, status: 200});
    }));
});

router.post('/:id/profile/delete-trainer/:trainerId', function (req, res, next) {
  if (isParamEmpty(req, 'id')) {
    console.log(`UserId was not sent with request.`)
    return res.status(400).send(JSON.stringify({ message: errors.userId }));
  }
  else if (isParamEmpty(req, 'trainerId', true)) {
    const error = 'TrainerId was not sent with request.'
    console.log(error)
    return res.status(400).send(JSON.stringify({ message: error }));
  }
  
  User.findByIdAndUpdate(req.params.id, 
      { $pull: { trainers: { '_id': req.params.trainerId }}},
    ((err, updatedUser) => {
      if (err) {
        console.log(err);
        return res.status(400).send(JSON.stringify({message: `Error removing trainer from user profile.`}));
      }
      console.log(`updatedUser: ${JSON.stringify(updatedUser)}`)
      return res.status(200).send({message: updatedUser, status: 200});
    }));
});

/**
 * Get the user profile in the app
 */
router.post('/:id/profile/add-dog', function (req, res, next) {
  if (isParamEmpty(req, 'id')) {
    console.log(`UserId was not sent with request.`)
    return res.status(400).send(JSON.stringify({ message: errors.userId }));
  }
  else if (isParamEmpty(req, 'dog', true)) {
    const error = 'Dog info was not sent with request.'
    console.log(error)
    return res.status(400).send(JSON.stringify({ message: error }));
  }

  const dogData = {
    ...req.body.dog
  };

  User.findByIdAndUpdate(req.params.id, 
      { $push: { dogs: dogData }},
    ((err, updatedUser) => {
      if (err) {
        console.log(err);
        return res.status(400).send(JSON.stringify({message: `Error adding dog to user profile.`}));
      }
      console.log(`updatedUser: ${JSON.stringify(updatedUser)}`)
      return res.status(200).send({message: updatedUser, status: 200});
    }));
});

router.post('/:id/profile/delete-dog/:dogId', function (req, res, next) {
  if (isParamEmpty(req, 'id')) {
    console.log(`UserId was not sent with request.`)
    return res.status(400).send(JSON.stringify({ message: errors.userId }));
  }
  else if (isParamEmpty(req, 'dogId', true)) {
    const error = 'DogId was not sent with request.'
    console.log(error)
    return res.status(400).send(JSON.stringify({ message: error }));
  }
  
  User.findByIdAndUpdate(req.params.id, 
      { $pull: { dogs: { '_id': req.params.dogId }}},
    ((err, updatedUser) => {
      if (err) {
        console.log(err);
        return res.status(400).send(JSON.stringify({message: `Error removing dog from user profile.`}));
      }
      console.log(`updatedUser: ${JSON.stringify(updatedUser)}`)
      return res.status(200).send({message: updatedUser, status: 200});
    }));
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
                req.session = null;
                // const sessionStore = req.app.get('sessionStore');
                // sessionStore.destroy(req.session.userId, true);
                return res.send({message: 'success'});
            }
        });
    }
});

module.exports = router;