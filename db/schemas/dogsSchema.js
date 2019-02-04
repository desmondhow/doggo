/**
 * Schema used for user registration/ login
 */
const mongoose = require('../../server/node_modules/mongoose');
const bcrypt = require('../../server/node_modules/bcrypt');

export const DogsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        unique: false,
        required: true,
    },
    main_trainer: {
        type: String,
        unique: false,
        required: true,
    },

});
const Dog = mongoose.model('Dogs', DogsSchema);
module.exports = Dog;
