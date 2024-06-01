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
            
            const info = await transporter.sendMail({
                from: '"Maddison Foo Bar 👻" <maddison53@ethereal.email>', 
                to: ctx.params.users, // list of receivers
                subject: "Email notification", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
              });
        }
    }
}