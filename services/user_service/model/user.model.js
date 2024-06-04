const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        lowercase: true, 
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(value) {
                const phoneNumber = parsePhoneNumberFromString(value);
                return phoneNumber && phoneNumber.isValid();
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        match: /^\+?[1-9]\d{1,14}$/ // Allows an optional '+' followed by digits (E.164 format)
    }

})

userSchema.pre("save", async function(next) {
    if (this.isModified("password") || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.validPassword = async function(password) {
    try{
        const passwordMatch = await bcrypt.compare(password, this.password);
        if(!passwordMatch) return false
        return true
    }catch(err){
        console.log(err)
    }
    
  };


const User = mongoose.model('User', userSchema)

module.exports = {User}
