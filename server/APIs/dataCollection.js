import express from 'express';
import UDCSession from '../../db/schemas/UDCSchema'
import User from '../../db/schemas/userSchema'

const router = express.Router();

/**
 * Creates a new UDC session
 */
router.post('/:id/createUDCSession', function (req, res, next) {

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

  let userId = req.params['id']
  User.findById(userId)
  .exec(err, user => {
    if (err) {
      throw err;
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
      hides
    }
    UDCSession.create(sessionData, function (err, newSession) {
      if (err) {
        console.log(err);
        return res.status(400).send({message: JSON.stringify(err)});
      } else {
        req.session.UDCSessionId = newSession._id;
        console.log(`UDCSession ${newSession._id} created`)
        return res.status(200).send({message: newSession._id, status: 200});
      }
    });
    
  });
});

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


