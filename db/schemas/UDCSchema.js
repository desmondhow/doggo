/**
 * Schema used for the different sessions
 */
import mongoose from '../../server/node_modules/mongoose';
import { UserSchema } from './userSchema';

const UDCSchema = new mongoose.Schema({
  /* 
    TODO: i guess we have them enter their name during creation? should we pull this from the list of trainers we already have?
    creator: String
  */
  user: String,
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
});

// Models that can be queried by the routes
const UDC = mongoose.model('UDC', UDCSchema);
export default UDC