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
        required: false
      }
    }
  ],
  dogsTrained: [
    {
      dogId: {
        type: ObjectId,
        required: true
      },
      handlerId: { 
        type: ObjectId,
        required: false,
      },
      recorder: String,
      handlerKnows: {
        type: Boolean,
        required: false,
        default: false
      },
      onLead: {
        type: Boolean,
        required: false,
        default: false

      },
      hides: [
        {
          hideId: ObjectId,
          performance: {
            radiusAlert: {
              type: String,
              required: false,
            },
            radiusReward: {
              type: String,
              required: false,
            },
            radiusSearch: {
              type: String,
              required: false,
            },
            rewarder: {
              type: String,
              required: false,
            },
            barks: {
              type: Number,
              required: false,
            },
            fringe: {
              type: Boolean,
              required: false,
              default: false
            },
            reset: {
              type: Boolean,
              required: false,
              default: false
            },
            falseAlert: {
              type: Boolean,
              required: false,
              default: false
            },
            falseIndication: {
              type: Boolean,
              required: false,
              default: false
            },
            detailSearch: {
              type: Boolean,
              required: false,
              default: false
            },
            successful: {
              type: Boolean,
              required: false,
              default: false
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
            duration: {
              type: String,
              required: false
            }
          }
        }
      ]
    }
  ]
});
