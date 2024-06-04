const parseMessage = (name, amount) => {
    if(!name || !amount){
        return 'Invalid argument passed in message helper function'
    }
  const mailBody = `<html>
  <body>
    <p>Dear, ${name.username}</p> //fix
    <p>Your debit transaction of <strong>${amount}</strong> has failed due to insufficient funds.</p>
    <p>Please ensure you have enough balance and try again.</p>
    <br>
    <p>Best regards,</p>
    <p>Your Service Team</p>
  </body>
</html>`;

  return mailBody;
};

const successfulMessage = (name, amountToDeduct, newBalance)=>{
 const mailBody = `
    <body>
      <p>Dear, ${name.username}</p> //fix
      <p>Your debit transaction of <strong>${amountToDeduct}</strong> was successful.</p>
      <p>Your new balance is $${newBalance}</p>
      <br>
    </body>
`
return mailBody
}


module.exports = {
    parseMessage,
    successfulMessage
}
