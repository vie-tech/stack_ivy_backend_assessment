const mongoose = require('mongoose')


const walletSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    balance: {
        type: Number,
        default: 450
    }
})


const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = {Wallet}