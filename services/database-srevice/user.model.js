const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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

    balance: {
        type: Number,
    }
})

userSchema.pre("save", async function(next) {
    if (this.isModified("password") || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema)

module.exports = {User}
