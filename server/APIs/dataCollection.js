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
router.post('/:id/create-UDC-session', function (req, res, next) {
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
  console.log(userId);
  User.findById(userId).exec(function (err, user) {
    if (err) {
        return res.status(400).send(JSON.stringify({message: `User ${userId} not found.`}));
    }
    else if (!user) {
      console.log(`User ${userId} not found.`)
      return res.status(400).send(JSON.stringify({message: `User ${userId} not found.`}));
    }

    let hides = []
    console.log(`hidesData: ${JSON.stringify(hidesData)}`)
    Object.keys(hidesData).forEach(concentration => {
      let concentrationSizes = hidesData[concentration]
      Object.keys(concentrationSizes).forEach(size => {
        console.log(JSON.stringify(concentrationSizes));
        console.log(`concentration: ${concentration}, size: ${size}`);

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
      user: user._id,
      temperature,
      humidity,
      wind,
      windDirection,
      complete: false,
      createdAt: new Date(),
      hides
    };
    UDCSession.create(sessionData, function (err, newSession) {
      if (err) {
        console.log(err);
        return res.status(400).send({message: JSON.stringify(err)});
      } else {
        req.session.UDCSessionId = newSession._id;
        console.log(`UDCSession ${newSession._id} created`)
        return res.status(200).send({message: newSession._id, status: 200});
      }
    },);
    
  });
});

/**
 * Returns all the non complete UDC sessions
 */
router.get('/get-current-UDC-sessions', function (req, res) {
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
                  createdAt: sessions[i].createdAt,
                  dogs:  sessions[i].dogs,
                  hides: sessions[i].hides,
                  _id: sessions[i]._id
              };
              if (obj.dogs  == null) {
                  obj.dogs = [];
              }
              result.push(obj)
          }
          return  res.status(200).send(JSON.stringify({status: true, list: result}));
      }
  });
});


/**
 * Get a specific UDC session by its uniquide ID
 */
router.get('/get-UDC-session/:SessionID', (req, res) => {
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


