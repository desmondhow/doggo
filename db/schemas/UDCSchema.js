import { Schema, ObjectId } from 'mongoose';

export default new Schema({
  /* 
    TODO: i guess we have them enter their name during creation? should we pull this from the list of trainers we already have?
    creator: String
  */
  createdAt: { type: Date, default: Date.now },
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
      isConcealed: {
        type: Boolean,
        required: false
      },
      placementArea: {
        type: String,
        required: false
      },
      placementHeight: {
        type: String,
        required: false
      }
    }
  ],
  dogsTrained: [
    {
      dogId: ObjectId,
      trainerId: ObjectId,
      handler: String,
      recorder: String,
      hides: [
        {
          hideId: ObjectId, //${concentration}-size
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
