const {sendInsufficientNotifToUser, successfulDeposit} = require('./controller/notif.controller')
module.exports = {

    name: 'notification',
    actions: {
        sendInsufficientNotifToUser,
        successfulDeposit
    },

    created(){
    }
}