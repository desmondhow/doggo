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
        handlerKnows: {
            type: Boolean,
            required: true
        },
        onLead: {
            type: Boolean,
            required: true
        },
        hides: [
            {
                hideId: ObjectId,
                performance: {
                    radiusAlert: {
                        type: String,
                        required: false, default: false
                    },
                    radiusReward: {
                        type: String,
                        required: false, default: false
                    },
                    radiusSearch: {
                        type: String,
                        required: false, default: false
                    },
                    rewarder: {
                        type: String,
                        required: false, default: false
                    },
                    barks: {
                        type: Number,
                        required: false, default: false
                    },
                    duration: {
                        type: Date,
                        required: false, default: false
                    },
                    fringe: {
                        type: Boolean,
                        required: false, default: false
                    },
                    reset: {
                        type: Boolean,
                        required: false, default: false
                    },
                    falseAlert: {
                        type: Boolean,
                        required: false, default: false
                    },
                    falseIndication: {
                        type: Boolean,
                        required: false, default: false
                    },
                    detailSearch: {
                        type: Boolean,
                        required: false, default: false
                    },
                    successful: {
                        type: Boolean,
                        required: false, default: false
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
