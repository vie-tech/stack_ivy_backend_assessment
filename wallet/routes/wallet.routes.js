const express = require('express')
const router = express.Router()
const {walletFunction} = require('../controller/wallet.controller')
const tokenMiddleware = require('../middleware/token.middleware.js')
const {walletBroker} = require('../broker/wallet.broker')

/* walletBroker.connect().catch((error) => {
    console.error("Failed to connect to message broker:", error.message);
    process.exit(1);
  }); */

router.get('/balance', tokenMiddleware.auth, async(req, res)=>{
    try{
        const user = req.user;
        const response = await walletFunction.getBalance(user.id)
        if(response.success === false){
            throw new Error('Failed to get balance')
        }
        res.status(200).json({message: "Balance successfully returned", balance: response.user})
    }catch(err){ 
   res.status(400).json({message: err.message, status: 'failed'})
    }
})

router.put('/debit', tokenMiddleware.auth, async(req, res)=>{
      console.log('Debit function triggered')
    try{
        const user = req.user;
        const {amount, notifType} = req.body;
        if(!user || !amount){
            return 'Invalid params passed'
        }
        const response = await walletFunction.debit(user.id, amount)
        if(response.success === false){
            walletBroker.sendFailedNotif(response.email, response.name, response.amountToDeduct, notifType,)
            .then((success) => {
              if (!success) {
                console.log("Failed to send signup notification");
              }
            })
            .catch((err) => {
              console.error("Error sending signup notification:", err.message);
            });
            throw new Error('Failed to debit')
        }
        walletBroker.sendSuccessNotif(response.email, response.username, response.amountToDeduct, response.newBalance, notifType)
        .then((success) => {
          if (!success) {
            console.log("Failed to send signup notification");
          }
        })
        .catch((err) => {
          console.error("Error sending signup notification:", err.message);
        });
        res.status(200).json({message: "Balance successfully debited", balance: response.user})
    }catch(err){
   res.status(400).json({message: err.message, status: 'failed'})
    }
})





router.put('/credit', tokenMiddleware.auth, async (req, res)=>{
  try{
    const user = req.user;
    const {amount, notifType} = req.body;
    if(!user ||!amount){
        return 'Invalid params passed'
    }
    const response = await walletFunction.credit(user.id, amount)
    console.log(response)
    if(response.success === false){
        walletBroker.sendFailedCreditNotif(response.email, response.username, response.amountToAdd, notifType)
       .then((success) => {
          if (!success) {
            console.log("Failed to send signup notification");
          }
        })
       .catch((err) => {
          console.error("Error sending signup notification:", err.message);
        });
        throw new Error('Failed to credit')
    }

    walletBroker.sendSuccessCreditNotif(response.email, response.username, response.amountToAdd, response.newBalance, notifType)
    .then((success) => {
      console.log('sucesssssss', success)
      if (!success) {
        console.log("Failed to send signup notification");
        
      }
    }).catch((err) => {
      console.error("Error sending signup notification:", err.message);
    });
    res.status(200).json({status: 'success', message: 'User credited'})
  }catch(err){
    res.status(500).json({status: 'Failed', message: err.message});
  }
})


module.exports ={
    router
}

