const mongoose = require('../../server/node_modules/mongoose');
const Trainer = require('./trainer');

const session = {
  createdBy: {
      type: Trainer,
      required: true,
  },
  dogs: {
      type: Array,
      required: true,
  }
};

/**
 * UDC Schema
 */
const UDCSchema = new mongoose.Schema({
    ...session,
    location: {
      type: String,
      required: true
    },
});

/**
 * Agility Schema
 */
const AgilitySchema = new mongoose.Schema({
    ...session,
});

// Models that can be queried by the routes
const UDC = mongoose.model('UDC', UDCSchema);
const Agility = mongoose.model('Agility', AgilitySchema);

//Export the models only
module.exports = {
    UDC,
    Agility
};


