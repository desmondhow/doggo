const mongoose = require('../../server/node_modules/mongoose');

/**
 * Trainer Schema
 */
const TrainerSchema = new mongoose.Schema({
    name: {
        type: String,
    }
});

// Define trainer model
const Trainer = mongoose.model('Trainer', TrainerSchema);

module.export = Trainer;