
const failedMobileMessage = (user, amountToDeduct)=>{
    const message = `Dear ${user.username}, your attempt to deduct $${amountToDeduct} has failed due to insufficient funds.`;
   return message
}

const successfulMobileMessage = (user, amountToDeduct, newBalance)=>{
    const message = `[ALERT: Mobile notification] 
    Dear ${user.username},  $${amountToDeduct} has been
     deducted from your account successfully
     you new balance is $${newBalance}
     `;

     return message

}


module.exports = {
    successfulMobileMessage,
    failedMobileMessage
}