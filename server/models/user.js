const _ = require('lodash');
const validator = require('validator');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: (value)=> {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },

    password: {
        type: String,
        minlength: 6,
        required: true,
        trim: true,
    },

    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id, access}, '123abc').toString();

    user.tokens.push({access, token});

    return user.save().then(()=> {
        return token;
    });
}    

var Users = mongoose.model('User', UserSchema);

module.exports = {Users};
