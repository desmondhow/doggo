import express from 'express';
import UDCSession from '../../db/schemas/UDCSchema'
import User from '../../db/schemas/userSchema'
import mongoose from 'mongoose';

const router = express.Router();
const createSessionApiRoute = route => `/:id/sessions/${route}`


/**
 * Creates a new UDC session
 */
router.post(createSessionApiRoute('udc/create-new-session'), function (req, res, next) {
  console.log(`body: ${JSON.stringify(req.body)}\n`)

  let temperature = req.body.temperature
  let humidity = req.body.humidity
  let wind = req.body.wind
  let windDirection = req.body.windDirection


  req.checkBody('hides').exists();
  let hidesData = req.body.hides

  let isMissingHides = req.validationErrors();
  if (isMissingHides) {
    return res.status(400).send(JSON.stringify({message: "Session doesn't contain any hides."}));
  }

  req.checkParams('id').exists();
  const isMissingIdParam = req.validationErrors();
  if (isMissingIdParam) {
    console.log(`UserId was not sent with request.`)
    return res.status(400).send(JSON.stringify({message: "UserId was not sent with request."}));
  }

  let sessionData = {
    temperature,
    humidity,
    wind,
    windDirection,
    complete: false,
    createdAt: new Date(),
    hides: hidesData
  };

  // if user is editing session then sessionId will be sent with request
  // if sessionId not sent then this is a new session
  const sessionId = req.body.id;
  if (sessionId) {
    // only update the fields that the user edited
    let updateObj = {$set: {}};
    for (let param in req.body) {
      updateObj.$set[`sessions.$.data.${param}`] = sessionData[param]
    }

    User.update({ 'sessions.data._id': sessionId }, updateObj,
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

router.post(createSessionApiRoute('udc/delete-session/:sessionId'), function (req, res, next) {
  req.checkParams('id').exists();
  req.checkParams('sessionId').exists();
  const isMissingIdParam = req.validationErrors();
  if (isMissingIdParam) {
    console.log(`UserId or sessionId was not sent with request.`)
    return res.status(400).send(JSON.stringify({message: "UserId was not sent with request."}));
  }

  const userId = req.params.id;
  let sessionId = req.params.sessionId;
  console.log(`sessionId: ${sessionId}`);
  User.update(
    { _id: userId }, 
    { "$pull": { sessions: { 'data._id': sessionId }}}, 
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
  req.checkParams('id').exists();
  const isMissingIdParam = req.validationErrors();
  if (isMissingIdParam) {
    console.log(`UserId was not sent with request.`)
    return res.status(400).send(JSON.stringify({message: "UserId was not sent with request."}));
  }
  const userId = req.params.id;
  console.log('here');
  User.findById(userId)
  .where({sessions: { $elemMatch: { sessionType: 'UDC', 'data.complete': false }}})
  .then(data => {
    if (!data) {
      console.log('There are no current UDC sessions');
        return res.status(200).send(JSON.stringify({message: 'There are no current UDC sessions'}));
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


