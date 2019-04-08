import express from 'express';

import LHSSession from '../../db/schemas/LHSSchema'
import User from '../../db/schemas/userSchema';
import {isParamEmpty, errors} from './helpers';

const router = express.Router();
const createSessionApiRoute = route => `/:id/sessions/${route}`


/**
 * Creates a new LHS session
 */
router.post(createSessionApiRoute('lhs/create'), function (req, res, next) {
    let temperature = req.body.temperature;
    let humidity = req.body.humidity;
    let wind = req.body.wind;
    let windDirection = req.body.windDirection;
    let complete = req.body.complete;
    let createdAt = req.body.createdAt;
    let currSessionID = req.body.sessionId;
    let dogsTrained = req.body.dogsTrained;
    let isNewToServer = req.body.isNewToServer;


    if (isParamEmpty(req, 'id')) {
        console.log(`UserId was not sent with request.`)
        return res.status(400).send(JSON.stringify({message: errors.userId}));
    }

    let searchesData = req.body.searches;
    if (isParamEmpty(req, 'searches', true)) {
        return res.status(400).send(JSON.stringify({message: "Session doesn't contain any searches."}));
    }
    const isNewSession = req.body.isNewSession;


    let sessionData = {
        temperature,
        humidity,
        wind,
        windDirection,
        complete: complete,
        createdAt: createdAt,
        searches: searchesData,
        sessionId: currSessionID,
        dogsTrained: dogsTrained,
        isNewSession: isNewSession,
        isNewToServer: false,
    };

    console.log(`sessionData: ${JSON.stringify(sessionData)}\n`);
    if (!isNewToServer) {
        // only update the fields that the user edited
        let updateObj = {$set: {}};
        for (let param in req.body) {
            updateObj.$set[`sessions.$.data.${param}`] = sessionData[param]
        }

        User.update({'sessions.data.sessionId': currSessionID}, updateObj,
            ((err, updatedUser) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send(JSON.stringify({message: `Error editing LHS session.`}));
                }
                console.log(`updatedSessionResult: ${JSON.stringify(updatedUser)}`)
                return res.status(200).send({message: updatedUser, status: 200});
            }));
    }
    else {

        sessionData.isNewSession = false;
        sessionData.dogsTrained = null;
        const newSession = {sessionType: 'LHS', data: sessionData};
        const userId = req.params.id;

        User.findByIdAndUpdate(userId,
            {$push: {sessions: newSession}},
            ((err, updatedUser) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send(JSON.stringify({message: `Error creating LHS session.`}));
                }
                console.log(`updatedUser: ${JSON.stringify(updatedUser)}`)
                return res.status(200).send({message: updatedUser, status: 200});
            }));
    }
});

/**
 * Trains dogs under a LHS session
 */
router.post(createSessionApiRoute('lhs/train'), function (req, res, next) {

    if (isParamEmpty(req, 'id') || isParamEmpty(req, 'sessionId', true)) {
        console.log(`UserId or sessionId was not sent with request.`)
        return res.status(400).send(JSON.stringify({message: errors.userId}));
    }
    else if (isParamEmpty(req, 'sessionInfo', true)) {
        console.log(`SessionInfo was not sent with request.`)
        return res.status(400).send(JSON.stringify({message: errors.sessionInfo}));
    }
    const sessionInfo = req.body.sessionInfo;
    const dogsTrained = sessionInfo.dogsTrained;

    console.log(`session: ${JSON.stringify(sessionInfo)}\n\n\n`);
    console.log(`dogsTrained: ${JSON.stringify(dogsTrained)}\n\n\n`);

    const sessionId = req.body.sessionId;
    User.update(
        {'sessions.data.sessionId': sessionId},
        {$set: {'sessions.$.data.dogsTrained': dogsTrained}},
        {upsert: true},
        ((err, updatedUser) => {
            if (err) {
                console.log(err);
                return res.status(400).send(JSON.stringify({message: `Error updating LHS session.`}));
            }
            console.log(`updatedSessionResult: ${JSON.stringify(updatedUser)}`)
            return res.status(200).send(JSON.stringify({message: updatedUser, status: 200}));
        }));
})


// Deletes a LHS session
router.post(createSessionApiRoute('lhs/:sessionId'), function (req, res, next) {
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
 * Returns all the non complete LHS sessions
 */
router.get(createSessionApiRoute('lhs/get-current-sessions'), function (req, res) {
    if (isParamEmpty(req, 'id')) {
        console.log(`UserId was not sent with request.`)
        return res.status(400).send(JSON.stringify({message: errors.userId}));
    }
    const userId = req.params.id;

    User.findById(userId)
        .then(data => {
            data = data.sessions.filter(s => s.sessionType === 'LHS');
            if (!data) {
                return res.status(400).send(JSON.stringify({
                    message: 'There are no current LHS sessions',
                    sessions: []
                }));
            } else {
                return res.status(200).send(JSON.stringify({sessions: data.sessions}));
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(400).send(JSON.stringify({status: false, message: err}));
        })
});


/**
 * Get a specific LHS session by its uniquide ID
 */
router.get(createSessionApiRoute('/get-session/:sessionId'), (req, res) => {
    const id = req.params.sessionId;
    console.log(id);
    if (id === undefined || id.length === 0) {
        return res.status(400).send(JSON.stringify({status: false, message: 'Please add an ID'}));

    }
    LHSSession.findById(id, function (err, session) {
        if (err || session === undefined || session.length === 0) {
            return res.status(400).send(JSON.stringify({
                status: false, message: 'Could not find any LHS sessions' +
                ' with that ID'
            }));
        }
        return res.status(200).send(JSON.stringify({status: true, data: session}));
    });
});


module.exports = router;