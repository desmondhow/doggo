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

  const userId = req.params.id;
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
  
  let sessionData = {
    id: mongoose.Types.ObjectId(),
    temperature,
    humidity,
    wind,
    windDirection,
    complete: false,
    createdAt: new Date(),
    hides
  };

  let sessionId = req.body.id;
  console.log(JSON.stringify(req.body))
  console.log(`sessionData: ${JSON.stringify(sessionData)}`);

  User.findById(userId)
  .where('sessions.UDC.id').equals(sessionId)
  .then(data => {
    if (!data) {
      console.log('nope... but why?')
    } 
    console.log(data);
  })
  .catch(err => {
    console.log(err);
    return res.status(400).send(JSON.stringify({status: false, message: err}));
  })

  // if (sessionId) {
  //   User.update({'sessions.UDC.id': sessionId},
  //     { $set: { 
  //       'sessions.UDC.$.temperature': sessionData.temperature,
  //       'sessions.UDC.$.humidity': sessionData.humidity,
  //       'sessions.UDC.$.wind': sessionData.wind,
  //       'sessions.UDC.$.windDirection': sessionData.windDirection,
  //       'sessions.UDC.$.hides': sessionData.hides,
  //       }
  //     },
  //   ((err, updatedUser) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(400).send(JSON.stringify({message: `Error editing UDC session.`}));
  //     }
  //     console.log(`updatedUser: ${JSON.stringify(updatedUser)}`)
  //     return res.status(200).send({message: updatedUser, status: 200});
  //   }));
  // }
  // else {
  //   User.findByIdAndUpdate(userId, {
  //     $push: { 'sessions.UDC': sessionData }
  //   }, 
  //   ((err, updatedUser) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(400).send(JSON.stringify({message: `Error creating UDC session.`}));
  //     }
  //     console.log(`updatedUser: ${JSON.stringify(updatedUser)}`)
  //     return res.status(200).send({message: updatedUser, status: 200});
  //   }));
  // }  
});

/**
 * Returns all the non complete UDC sessions
 */
router.get(createSessionApiRoute('udc/get-current-sessions'), function (req, res) {
  console.log('hit')

  req.checkParams('id').exists();
  const isMissingIdParam = req.validationErrors();
  if (isMissingIdParam) {
    console.log(`UserId was not sent with request.`)
    return res.status(400).send(JSON.stringify({message: "UserId was not sent with request."}));
  }
  const userId = req.params.id;

  User.findById(userId)
  .where('sessions.UDC.complete').equals(false)
  .then(data => {
    if (!data) {
        return res.status(400).send(JSON.stringify({status: false, message: 'There are no current UDC sessions'}));
    } else {
      const sessions = data.sessions.UDC;
      console.log(`sessions: ${JSON.stringify(sessions)}`);
      return res.status(200).send(JSON.stringify({status: true, list: sessions}));
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


