const express = require('express');
const router = express.Router();

//Import Session Models to query
const Sessions = require('../../db/schemas/session');
const UDC = Sessions.UDC;
const Agility = Sessions.Agility;

router.get('/', function (req, res) {
    console.log('here');
    res.send('Data Collection API  works!');
});


/**
 * Create new UDC session.
 */
router.post('/createNewUDC', function(req, res) {
    const createdBy = req.body.createdBy;
    const dogs = req.body.dogs;
    const location = req.body.location;

    // Validate input
    req.checkBody('createdBy').notEmpty();
    req.checkBody('dogs').notEmpty();
    req.checkBody('location').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(JSON.stringify({message: 'Please fill all fields'}));
    }
    let udc = new UDC({
        createdBy: createdBy,
        dogs: dogs,
        location: location
    });
    //Store it in the db
    udc.save()
        .then(doc => {
            console.log(doc);
            return res.status(200).send(doc);

        })
        .catch(err => {
            console.log(err);
            return res.status(400).send(JSON.stringify({message: 'Could not save in db'}));
        })
});

// router.get('/getAllSessions', function (req, res){
//     Session.
// });


/**
 * Get all the current UDC Sessions
 */
router.get('/getCurrentUDCSessions', (req, res) => {
    UDC.find({}, 'createdBy dogs location', function(err, session){
        if (err || session === undefined || session.length === 0) {
            return res.status(200).send(JSON.stringify({message: 'There are no current UDC Sessions'}));
        }
        return res.status(200).send(session);
    });
});

/**
 * Get a specific UDC session by its uniquide ID
 */
router.get('/getUDCSession/:SessionID', (req, res) => {
    const id = req.params.SessionID;
    if (id === undefined || id.length === 0 ) {
        return res.status(400).send(JSON.stringify({message: 'Please add an ID'}));
    }
    UDC.findById(id, 'createdBy dogs location', function(err, session) {
        if (err || session === undefined || session.length === 0) {
            return res.status(400).send(JSON.stringify({message: 'Could not find any UDC sessions with that ID'}));
        }
        return res.status(200).send(session);
    });
});


module.exports = router;


