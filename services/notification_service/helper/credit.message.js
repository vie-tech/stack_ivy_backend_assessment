const successfulCreditMessage = (user, amount) => {
  const message = `
    Hi ${user.username},
    You have successfully credited ${amount} to your account.
    `;
  return message;
};


module.exports = {
    successfulCreditMessage
}