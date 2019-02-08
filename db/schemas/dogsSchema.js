/**
 * Schema used for user registration/ login
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
