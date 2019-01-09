import express from 'express';
import UDCSession from '../../db/schemas/UDCSchema'
import User from '../../db/schemas/userSchema'

const router = express.Router();

router.get('/', function (req, res) {
    res.send('Data Collection API works!');
});


/**
 * Creates a new UDC session
 */
router.post('/:id/createUDCSession', function (req, res, next) {
    console.log('here\n' + JSON.stringify(req.body));
    let temperature = req.body['Temperature'];
    let humidity = req.body['Humidity'];
    let wind = req.body['Wind'];
    let windDirection = req.body['Wind Direction'];
    let hidesData = req.body['hides'];

    let userId;
    if (!!req.params.id) {
        userId = req.params.id
    }
    else {
        console.log(`UserId was not sent with request: ${JSON.stringify(req)}`);
        return res.send(JSON.stringify({message: `UserId was not sent with request: ${JSON.stringify(req)}`}));
    }

    User.findById(userId)
        .exec((err, user) => {
            console.log('after');

            if (err) {
                throw err;
            }
            else if (!user) {
                console.log(`User ${userId} not found.`);
                return res.status(400).send(JSON.stringify({message: `User ${userId} not found.`}));
            }
            const creator_name = user.first_name + ' ' + user.last_name;

            let hides = [];
            if (hidesData != null) {
                Object.keys(hidesData).forEach(concentration => {
                    let concentrationSizes = hides[concentration];
                    Object.keys(concentrationSizes).forEach(size => {
                        size = Number(size.replace('#', '.'));

                        let location = concentrationSizes[size].Location;
                        let concealed = concentrationSizes[size].Concealed;
                        let placementArea = concentrationSizes[size].PlacementArea;
                        let placementHeight = concentrationSizes[size].PlacementHeight

                        hides.push({
                            concentration: Number(concentration),
                            size,
                            location,
                            concealed,
                            placementArea,
                            placementHeight
                        });
                    });
                });
            }


            let sessionData = {
                creator_name,
                user,
                temperature,
                humidity,
                wind,
                windDirection,
                complete: false,
                hides
            };
            UDCSession.create(sessionData, function (err, newSession) {
                if (err) {
                    console.log(err);
                    return res.status(400).send({message: JSON.stringify(err)});
                } else {
                    req.session.UDCSessionId = newSession._id;
                    console.log(`UDCSession ${newSession._id} created`);
                    return res.status(200).send({message: newSession._id, status: 200});
                }
            });

        });
});

/**
 * Returns all the non complete UDC sessions
 */
router.get('/get_all_udc', function (req, res) {
    UDCSession.find({'complete': false}).exec(function (err, sessions) {
        if (err) {
            console.log(err);
            return res.status(400).send(JSON.stringify({status: false, message: err}));
        } else if (sessions === null || sessions === undefined) {
            return  res.status(400).send(JSON.stringify({status: false, message: 'There are no current UDC sessions'}));
        } else {
            let result = [];
            for (let i =0; i < sessions.length; i++) {
                let obj = {
                    creator_name: sessions[i].creator_name,
                    dogs:  sessions[i].dogs,
                    _id: sessions[i]._id
                };
                if (obj.dogs  == null) {
                    obj.dogs = [];
                }
                result.push(obj)
            }
            console.log(result);
            return  res.status(200).send(JSON.stringify({status: true, list: result}));
        }
    });
});


/**
 * Get a specific UDC session by its uniquide ID
 */
router.get('/getUDCSession/:SessionID', (req, res) => {
    const id = req.params.SessionID;
    console.log(id);
    if (id === undefined || id.length === 0) {
        return  res.status(400).send(JSON.stringify({status: false, message: 'Please add an ID'}));

    }
    UDCSession.findById(id, function (err, session) {
        if (err || session === undefined || session.length === 0) {
            return  res.status(400).send(JSON.stringify({status: false, message: 'Could not find any UDC sessions' +
                ' with that ID'}));
        }
        return  res.status(200).send(JSON.stringify({status: true, data: session}));
    });
});


module.exports = router;


