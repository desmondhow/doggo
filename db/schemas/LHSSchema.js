import {Schema, ObjectId} from 'mongoose';

export default new Schema({
    /*
        TODO: i guess we have them enter their name during creation? should we pull this from the list of trainers we already have?
        creator: String
      */
    createdAt: {type: Date, default: Date.now},
    sessionId: String,
    isNewSession: Boolean,
    isNewToServer: Boolean,
    temperature: Number,
    humidity: Number,
    wind: Number,
    windDirection: String,
    timeOfDay: String,
    complete: {
        type: Boolean,
        required: true,
        default: false
    },
    searches: [
        {
            location: {
                type: String,
                required: false
            },
            placement: {
                offRubble: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                edgeRubble: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                onRubble: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                diffused: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                inVehicle: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                inRoom: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                concealed: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                visible: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                highCeiling: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                props: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                inRubbleHole: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                below: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                distanceLow: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                distanceHigh: {
                    type: Boolean,
                    required: false,
                    default: false
                },
            },
            searchNumber: {
                type: String,
                required: true
            },
            notes: {
                type: String,
                required: false
            }
        }
    ],
    dogsTrained:
        {
            handlerId: {
                type: ObjectId,
                required: false,
            },
            recorder: String,
            onLead: {
                type: Boolean,
                required: false,
                default: false
            },
            searches: [
                {
                    searchId: ObjectId,
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
                        familiar: {
                            type: Boolean,
                            required: false,
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

});
