import express from 'express';
import UDCSession from '../../db/schemas/UDCSchema'
import User from '../../db/schemas/userSchema'

const router = express.Router();

/**
 * Creates a new UDC session
 */
router.post('/:id/createUDCSession', function (req, res, next) {

  let temperature = req.body['Temperature']
  let humidity = req.body['Humidity']
  let wind = req.body['Wind']
  let windDirection = req.body['Wind Direction']
  let hidesData = req.body['Hides']

  let userId;
  if (!!req.params.id) {
    userId = req.params.id
  }
  else {
    console.log(`UserId was not sent with request: ${JSON.stringify(req)}`)
    return res.send(JSON.stringify({message: `UserId was not sent with request: ${JSON.stringify(req)}`}));
  }

  console.log('before')
  User.findById(userId)
  .exec((err, user) => {
    console.log('after')

    if (err) {
      throw err;
    }
    else if (!user) {
      console.log(`User ${userId} not found.`)
      return res.status(400).send(JSON.stringify({message: `User ${userId} not found.`}));
    } 
    
    let hides = []
    Object.keys(hidesData).forEach(concentration => {
      let concentrationSizes = hides[concentration]
      Object.keys(concentrationSizes).forEach(size => {
        size = Number(size.replace('#', '.'))
  
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

    let sessionData = {
      user,
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


