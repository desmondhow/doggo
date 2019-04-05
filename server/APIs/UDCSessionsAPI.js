import express from 'express';

import UDCSession from '../../db/schemas/UDCSchema'
import User from '../../db/schemas/userSchema';
import {isParamEmpty, errors} from './helpers';

const router = express.Router();
const createSessionApiRoute = route => `/:id/sessions/${route}`

/**
 * Creates a new UDC session
 */
router.post(createSessionApiRoute('udc/create'), function (req, res, next) {
    let temperature = req.body.temperature;
    let humidity = req.body.humidity;
    let wind = req.body.wind;
    let windDirection = req.body.windDirection;
    let complete = req.body.complete;
    let createdAt = req.body.createdAt;
    let currSessionID = req.body.sessionId;
    let dogsTrained = req.body.dogsTrained;
    let isNewToServer = req.body.isNewToServer;


    console.log(`body: ${JSON.stringify(req.body)}`);



    if (isParamEmpty(req, 'id')) {
        console.log(`UserId was not sent with request.`)
        return res.status(400).send(JSON.stringify({message: errors.userId}));
    }

    let hidesData = req.body.hides;
    if (isParamEmpty(req, 'hides', true)) {
        return res.status(400).send(JSON.stringify({message: "Session doesn't contain any hides."}));
    }
    const isNewSession = req.body.isNewSession;

    let sessionData = {
        isNewSession: isNewSession,
        isNewToServer: false,
        temperature,
        humidity,
        wind,
        windDirection,
        complete: complete,
        sessionId: currSessionID,
        createdAt: createdAt,
        hides: hidesData,
        dogsTrained: dogsTrained,
    };


    // if user is editing session, isNewToServer will be false
    if (!isNewToServer) {
        console.log('updating session');
        // only update the fields that the user edited
        let updateObj = {$set: {}};
        for (let param in req.body) {
            updateObj.$set[`sessions.$.data.${param}`] = sessionData[param]
        }

        User.update({'sessions.data.sessionId': currSessionID}, updateObj,
            ((err, updatedUser) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send(JSON.stringify({message: `Error editing UDC session.`}));
                }
                console.log(`updatedSessionResult: ${JSON.stringify(updatedUser)}`)
                return res.status(200).send({message: updatedUser, status: 200});
            }));
    }
    else {
        sessionData.isNewSession = false;
        sessionData.dogsTrained = null;
        const newSession = {sessionType: 'UDC', data: sessionData};
        const userId = req.params.id;

        User.findByIdAndUpdate(userId,
            {$push: {sessions: newSession}},
            ((err, updatedUser) => {
                if (err) {
                    console.log('error creating udc session', err);
                    return res.status(400).send(JSON.stringify({message: `Error creating UDC session.`}));
                }
                console.log(`updatedUser: ${JSON.stringify(updatedUser)}`);
                return res.status(200).send({message: updatedUser, status: 200});
            }));
    }
});

/**
 * Trains dogs under a UDC session
 */
router.post(createSessionApiRoute('udc/train'), function (req, res, next) {

    if (isParamEmpty(req, 'id') || isParamEmpty(req, 'sessionId', true)) {
        console.log(`UserId or sessionId was not sent with request.`);
        return res.status(400).send(JSON.stringify({message: errors.userId}));
    }
    else if (isParamEmpty(req, 'sessionInfo', true)) {
        console.log(`SessionInfo was not sent with request.`);
        return res.status(400).send(JSON.stringify({message: errors.sessionInfo}));
    }
    const sessionInfo = req.body.sessionInfo;
    console.log(sessionInfo);

    const dogsTrained = sessionInfo.dogsTrained;
    console.log(`training session all data: ${JSON.stringify(sessionInfo)}\n\n\n`);

    console.log(`dogsTrained: ${JSON.stringify(dogsTrained)}\n\n\n`);

    const sessionId = req.body.sessionId;
    User.update(
        {'sessions.data.sessionId': sessionId},
        {$set: {'sessions.$.data.dogsTrained': dogsTrained}},
        {upsert: true},
        ((err, updatedUser) => {
            if (err) {
                console.log('error training', err);
                return res.status(400).send(JSON.stringify({message: `Error updating UDC session.`}));
            } else {
                console.log(`updatedSessionResult: ${JSON.stringify(updatedUser)}`)
                return res.status(200).send(JSON.stringify({message: updatedUser, status: 200}));
            }
        }));
})


// Deletes a udc session
router.post(createSessionApiRoute('udc/:sessionId'), function (req, res, next) {
    if (isParamEmpty(req, 'id') || isParamEmpty(req, 'sessionId')) {
        console.log(`UserId or sessionId was not sent with request.`)
        return res.status(400).send(JSON.stringify({message: errors.userId}));
    }


    const userId = req.params.id;
    let sessionId = req.params.sessionId;
    console.log('id of session being deleted', sessionId);

    User.update(
        {_id: userId},
        {"$pull": {sessions: {'data.sessionId': sessionId}}},
        {safe: true, multi: true},
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).send(JSON.stringify({message: err}));
            }
            console.log(`sessionId: ${sessionId}`);
            console.log(result);

            return res.status(200).send(JSON.stringify({message: "Session delete successful."}));
        }
    );
});

/**
 * Returns all the non complete UDC sessions
 */
router.get(createSessionApiRoute('udc/get-current-sessions'), function (req, res) {
    if (isParamEmpty(req, 'id')) {
        console.log(`UserId was not sent with request.`)
        return res.status(400).send(JSON.stringify({message: errors.userId}));
    }
    const userId = req.params.id;

    User.findById(userId)
        .then(data => {
            data = data.sessions.filter(s => s.sessionType === 'UDC');
            if (!data) {
                return res.status(400).send(JSON.stringify({
                    message: 'There are no current UDC sessions',
                    sessions: []
                }));
            } else {
                return res.status(200).send(JSON.stringify({sessions: data}));
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(400).send(JSON.stringify({status: false, message: err}));
        })
});


/**
 * Get a specific UDC session by its uniquide ID
 */
router.get(createSessionApiRoute('/get-session/:sessionId'), (req, res) => {
    const id = req.params.sessionId;
    console.log(id);
    if (id === undefined || id.length === 0) {
        return res.status(400).send(JSON.stringify({status: false, message: 'Please add an ID'}));

    }
    UDCSession.findById(id, function (err, session) {
        if (err || session === undefined || session.length === 0) {
            return res.status(400).send(JSON.stringify({
                status: false, message: 'Could not find any UDC sessions' +
                ' with that ID'
            }));
        }
        return res.status(200).send(JSON.stringify({status: true, data: session}));
    });
});


module.exports = router;


