const express = require('express')
const app = express()
const {notificationHandler }= require('./broker/broker')

const listenForMessage = async()=>{
    try{
        const response =  await notificationHandler.handleSignupNotification()
        console.log(response)
    }catch(err){
        console.log(err.mesaage)
    }
 
}

app.listen(6000, async()=>{
    console.log('Notification service is up')
   await listenForMessage()

})

