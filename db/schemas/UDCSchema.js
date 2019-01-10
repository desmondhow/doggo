/**
 * Schema used for the different sessions
 */
import mongoose from 'mongoose';
import { UserSchema } from './userSchema';

const UDCSchema = new mongoose.Schema({
  /* 
    TODO: i guess we have them enter their name during creation? should we pull this from the list of trainers we already have?
    creator: String
  */
  user: UserSchema,
  temperature: Number,
  humidity: Number,
  wind: Number,
  windDirection: String,
  complete: {
    type: Boolean,
    required: true
  },
  hides: [
    {
      concentration: {
        type: Number,
        required: true
      },
      size: {
        type: Number,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      concealed: {
        type: Boolean,
        required: true
      },
      placementArea: {
        type: String,
        required: true
      },
      placementHeight: {
        type: String,
        required: true
      }
    }
  ],
  dogsTrained: [
    {
      dog: String,
      handler: String,
      recorder: String,
      hides: [
        {
          hide: String, //${concentration}-size
          performance: {
            radiusAlert: {
              type: String,
              required: true
            },
            radiusReward: {
              type: String,
              required: true
            },
            radiusSearch: {
              type: String,
              required: true
            },
            rewarder: {
              type: String,
              required: true
            },
            barks: {
              type: Number,
              required: true
            },
            handlerKnows: {
              type: Boolean,
              required: true
            },
            fringe: {
              type: Boolean,
              required: true
            },
            reset: {
              type: Boolean,
              required: true
            },
            falseAlert: {
              type: Boolean,
              required: true
            },
            lead: {
              type: Boolean,
              required: true
            },
            falseIndication: {
              type: Boolean,
              required: true
            },
            detailSearch: {
              type: Boolean,
              required: true
            },
            successful: {
              type: Boolean,
              required: true
            },
            failCodes: [
              {
                type: String,
                required: false
              }
            ],
            distractions: [
              {
                type: String,
                required: false
              }
            ],
          }
        }
      ]
    }
  ]  
});

// Models that can be queried by the routes
const UDC = mongoose.model('UDC', UDCSchema);
// const Agility = mongoose.model('Agility', AgilitySchema);

//Export the models only
export default UDCSchema