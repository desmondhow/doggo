import { Schema, ObjectId } from "../../server/node_modules/mongoose";

export default new Schema({
  /*
      TODO: i guess we have them enter their name during creation? should we pull this from the list of trainers we already have?
      creator: String
    */
  createdAt: { type: Date, default: Date.now },
  sessionId: String,
  isNewSession: Boolean,
  temperature: Number,
  humidity: Number,
  wind: Number,
  windDirection: String,
  complete: {
    type: Boolean,
    required: true,
    default: false
  },
  hides: [
    {
      concentration: {
        type: Number,
        required: false
      },
      size: {
        type: Number,
        required: false
      },
      location: {
        type: String,
        required: false
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
      },
      roomNumber: {
        type: String,
        required: true
      },
      hideType: {
        type: String,
        required: true
      },
      notes: {
        type: String,
        required: true
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
            ]
          }
        }
      ]
    }
  ]
});
