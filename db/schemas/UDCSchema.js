/**
 * Schema used for the different sessions
 */
export default {
  /* 
    TODO: i guess we have them enter their name during creation? should we pull this from the list of trainers we already have?
    creator: String
  */
  temperature: Number,
  humidity: Number,
  wind: Number,
  windDirection: String,
  complete: {
    type: Boolean,
    required: true
  },
  createdAt: Date,
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
};
