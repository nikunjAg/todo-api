const _ = require('lodash');
const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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


// These are instance methods

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

// These are models methods
UserSchema.statics.findByToken = function(token) {
    
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, '123abc');
    } catch(e) {
        // return new Promise((resolve, reject)=> {
        //     // means the promise then will never pass in server.js
        //     // it will call the catch
        //     reject();
        // })
        // OR
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

}

UserSchema.pre('save', function (next) {
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, user.password, (err, salt)=> {
            bcrypt.hash(user.password, salt, (err, hash)=> {
                user.password = hash;
                next();
            });     
        });
    }
    else        
        next();

});

var Users = mongoose.model('User', UserSchema);

module.exports = {Users};
