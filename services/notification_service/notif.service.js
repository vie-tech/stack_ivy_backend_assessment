const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });

module.exports = {

    name: 'notification',
    actions: {
        async sendInsufficientNotifToUser(ctx){
          const {user, amountToDedut} = ctx.params
          if(!user) return this.logger.error('Valid user object not passed')
            const info = await transporter.sendMail({
                from: '"Maddison" <maddison53@ethereal.email>', 
                to: user.email, // list of receivers
                subject: "Failed debit Transaction", // Subject line
                text: `Debit transaction of ${amountToDedut} failed`, // plain text body
                
              });
        },

       async sendDebitNotifToUser(ctx){
             
        }
    }
}