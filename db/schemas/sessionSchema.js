/**
 * Schema used for the different sessions
 */
const mongoose = require('../../server/node_modules/mongoose');

const UDCSchema = new mongoose.Schema({
    sessions: {
        udc: {
            temperature: Number,
            humidity: Number,
            wind: Number,
            windDirection: String,
            hides: [
                {
                    concentration: {
                        type: Number,
                        required: true
                    },
                    size: Number,
                    location: String,
                    concealed: Boolean,
                    placementArea: String,
                    placementHeight: String
                }
            ]
        },
        session_owner: String
    }
});

// Models that can be queried by the routes
const UDC = mongoose.model('UDC', UDCSchema);
// const Agility = mongoose.model('Agility', AgilitySchema);

//Export the models only
module.exports = {
    UDC,
    // Agility
};