import express from 'express';

import UDCSession from '../../db/schemas/UDCSchema'
import User from '../../db/schemas/userSchema';
import { isParamEmpty, errors } from './helpers';

const router = express.Router();
const createSessionApiRoute = route => `/:id/sessions/${route}`


/**
 * Creates a new UDC session
 */
router.post(createSessionApiRoute('udc/create'), function (req, res, next) {
    let temperature = req.body.temperature;
    let humidity = req.body.humidity;
    let wind = req.body.wind;
    let complete = req.body.complete;
    let createdAt = req.body.createdAt;
    let currSessionID = req.body.sessionId;


    let windDirection = req.body.windDirection;

    if (isParamEmpty(req, 'id')) {
        console.log(`UserId was not sent with request.`)
        return res.status(400).send(JSON.stringify({ message: errors.userId }));
    }

    let hidesData = req.body.hides;
    if (isParamEmpty(req, 'hides', true)) {
        return res.status(400).send(JSON.stringify({message: "Session doesn't contain any hides."}));
    }

  let sessionData = {
    temperature,
    humidity,
    wind,
    windDirection,
    complete: complete,
    createdAt: createdAt,
    hides: hidesData,
      sessionId: currSessionID
  };

  // if user is editing session, isNew will be false
  const isNewSession = req.body.isNew;
  if (!isNewSession) {
    // only update the fields that the user edited
    let updateObj = {$set: {}};
    for (let param in req.body) {
      updateObj.$set[`sessions.$.data.${param}`] = sessionData[param]
    }

    User.update({ 'sessions.data.sessionId': currSessionID }, updateObj,
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
    const newSession = { sessionType: 'UDC', data: sessionData }
    const userId = req.params.id;

    User.findByIdAndUpdate(userId,
      { $push: { sessions: newSession}},
    ((err, updatedUser) => {
      if (err) {
        console.log(err);
        return res.status(400).send(JSON.stringify({message: `Error creating UDC session.`}));
      }
      console.log(`updatedUser: ${JSON.stringify(updatedUser)}`)
      return res.status(200).send({message: updatedUser, status: 200});
    }));
  }
});

/**
 * Trains dogs under a UDC session
 */
router.post(createSessionApiRoute('udc/train'), function (req, res, next) {

  if (isParamEmpty(req, 'id') || isParamEmpty(req, 'sessionId', true)) {
    console.log(`UserId or sessionId was not sent with request.`)
    return res.status(400).send(JSON.stringify({ message: errors.userId }));
  }
  else if (isParamEmpty(req, 'sessionInfo', true)) {
    console.log(`SessionInfo was not sent with request.`)
    return res.status(400).send(JSON.stringify({ message: errors.sessionInfo }));
  }
  const sessionInfo = req.body.sessionInfo;

  let dogsTrained = [];
  console.log(JSON.stringify(sessionInfo));
  Object.keys(sessionInfo).forEach(dogId => {

    dogsTrained.push({
      dogId,
      trainerId: sessionInfo[dogId].trainerId,
      handler: sessionInfo[dogId].handler,
      recorder: sessionInfo[dogId].recorder,
      hides:
        Object.keys(sessionInfo[dogId].performance).map(hideId => ({
          hideId,
          performance: sessionInfo[dogId].performance[hideId]
        }))
    })
  });

  const sessionId = req.body.sessionId;
  User.update(
    { 'sessions.data._id': sessionId },
    { $set: { 'sessions.$.data.dogsTrained': dogsTrained }},
    { upsert: true },
  ((err, updatedUser) => {
    if (err) {
      console.log(err);
      return res.status(400).send(JSON.stringify({message: `Error updating UDC session.`}));
    }
    console.log(`updatedSessionResult: ${JSON.stringify(updatedUser)}`)
    return res.status(200).send(JSON.stringify({message: updatedUser, status: 200}));
  }));
})


// Deletes a udc session
router.post(createSessionApiRoute('udc/:sessionId'), function (req, res, next) {
  if (isParamEmpty(req, 'id') || isParamEmpty(req, 'sessionId')) {
    console.log(`UserId or sessionId was not sent with request.`)
    return res.status(400).send(JSON.stringify({ message: errors.userId }));
  }


  const userId = req.params.id;
  let sessionId = req.params.sessionId;
    console.log('id of session being deleted', sessionId);

    User.update(
    { _id: userId },
    { "$pull": { sessions: { 'data.sessionId': sessionId }}},
    { safe: true, multi:true },
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
    return res.status(400).send(JSON.stringify({ message: errors.userId }));
  }
  const userId = req.params.id;

  User.findById(userId)
  .where({sessions: { $elemMatch: { sessionType: 'UDC', 'data.complete': false }}})
  .then(data => {
    if (!data) {
        return res.status(400).send(JSON.stringify({message: 'There are no current UDC sessions', sessions: []}));
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
 * Get a specific UDC session by its uniquide ID
 */
router.get(createSessionApiRoute('/get-session/:sessionId'), (req, res) => {
    const id = req.params.sessionId;
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


