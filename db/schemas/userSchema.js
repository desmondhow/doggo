/**
 * Schema used for user registration/ login
 */
import mongoose from '../../server/node_modules/mongoose';
import bcrypt from '../../server/node_modules/bcrypt';
import UDCSchema from './UDCSchema';

export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    sessions: [{
      sessionType: String,
      data: UDCSchema
    }],
    handlers: [{
      name: String
    }],
    dogs: [{
      name: String
    }]
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
