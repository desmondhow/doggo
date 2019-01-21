import express from 'express';

import UDCSession from '../../db/schemas/UDCSchema'
import User from '../../db/schemas/userSchema';
import { isParamEmpty, errors } from './helpers';

const router = express.Router();
const createSessionApiRoute = route => `/:id/sessions/${route}`

const _parseHides = hidesData => {
  let hides = []
  Object.keys(hidesData).forEach(concentration => {
    let concentrationSizes = hidesData[concentration]
    Object.keys(concentrationSizes).forEach(size => {
      let location = concentrationSizes[size].location;
      let isConcealed = concentrationSizes[size].isConcealed;
      let placementArea = concentrationSizes[size].placementArea;
      let placementHeight = concentrationSizes[size].placementHeight

      hides.push({
        concentration: Number(concentration),
        size,
        location,
        isConcealed,
        placementArea,
        placementHeight
      });
    });
  });
  return hides;
}

/**
 * Creates a new UDC session
 */
router.post(createSessionApiRoute('udc/create-new-session'), function (req, res, next) {
  console.log(`body: ${JSON.stringify(req.body)}\n`)

  let temperature = req.body.temperature
  let humidity = req.body.humidity
  let wind = req.body.wind
  let windDirection = req.body.windDirection

  if (isParamEmpty(req, 'id')) {
    console.log(`UserId was not sent with request.`)
    return res.status(400).send(JSON.stringify({ message: errors.userId }));
  }

  let hidesData = req.body.hides
  if (isParamEmpty(req, 'hides', true)) {
    return res.status(400).send(JSON.stringify({message: "Session doesn't contain any hides."}));
  }

  const sessionData = {
    temperature,
    humidity,
    wind,
    windDirection,
    complete: false,
    createdAt: new Date(),
    hides: _parseHides(hidesData)
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
  if (isParamEmpty(req, 'id') || isParamEmpty(req, 'seddionId')) {
    console.log(`UserId or sessionId was not sent with request.`)
    return res.status(400).send(JSON.stringify({ message: errors.userId }));
  }

  const userId = req.params.id;
  let sessionId = req.params.sessionId;
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
  if (isParamEmpty(req, 'id')) {
    console.log(`UserId was not sent with request.`)
    return res.status(400).send(JSON.stringify({ message: errors.userId }));
  }
  const userId = req.params.id;

  User.findById(userId)
  .where({sessions: { $elemMatch: { sessionType: 'UDC', 'data.complete': false }}})
  .then(data => {
    if (!data) {
        return res.status(400).send(JSON.stringify({essage: 'There are no current UDC sessions'}));
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


