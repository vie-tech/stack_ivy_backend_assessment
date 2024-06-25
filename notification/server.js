const express = require('express')
const app = express()
const {notificationHandler }= require('./broker/broker')



const startService = ()=>{
  notificationHandler.handleSignupNotification().catch((err) => {
    console.error("Error sending signup notification:", err);
  });

  notificationHandler.handleFailedNotification().catch((err) => {
    console.error("Error sending failed notification:", err.message);
  });
  notificationHandler.handleSuccessfulNotification().catch((err) => {
    console.error("Error sending success notification:", err.message);
  });
  notificationHandler.handleSuccessCreditNotification().catch((err) => {
    console.error("Error sending success notification:", err.message);
  });
  notificationHandler.handleFailedCreditNotification().catch((err) => {
    console.error("Error sending success notification:", err.message);
  });
}

startService()



 

