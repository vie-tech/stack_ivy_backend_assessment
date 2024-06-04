const {sendInsufficientNotifToUser, successfulDeposit, creditAlert} = require('./controller/notif.controller')
module.exports = {

    name: 'notification',
    actions: {
        sendInsufficientNotifToUser,
        successfulDeposit,
        creditAlert
    },

    created(){
    }
}