/**
 * Schema used for user registration/ login
 */
const mongoose = require('../../server/node_modules/mongoose');
const bcrypt = require('../../server/node_modules/bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    first_name: {
        type: String,
        unique: false,
        required: true,
    },
    last_name: {
        type: String,
        unique: false,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    password_conf: {
        type: String,
        required: true,
    }
});

/**
 * Authenticate user against input
 * @param email
 * @param password
 * @param callback
 */
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                const err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
};

/**
 * Hash password before saving to db
 */
UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});


const User = mongoose.model('User', UserSchema);
module.exports = User;