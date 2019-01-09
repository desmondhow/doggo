/**
 * Schema used for the different sessions
 */
const mongoose = require('../../server/node_modules/mongoose');
const UDCSchema = new mongoose.Schema({
    creator_name: String,
    dogsTrained: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dogs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dogs'
    },
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

//Export the models only
module.exports = UDC;

