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
});

// Models that can be queried by the routes
const UDC = mongoose.model('UDC', UDCSchema);
// const Agility = mongoose.model('Agility', AgilitySchema);

//Export the models only
export default UDCSchema