import { Schema, ObjectId } from 'mongoose';

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
  timeOfDay: String,
  complete: {
    type: Boolean,
    required: true,
    default: false
  },
  dogs: [{
    dogId: ObjectId,
    handlerId: ObjectId,
    isFamiliar: Boolean,
    notes: String
  }],
  functions: [{
    k9Position: String,
    handlerPosition: String,
    handlerRadius: String,
    duration: String,
    dogs: [{
      dogId: ObjectId,
      trials: [Boolean]
    }]
  }]
});