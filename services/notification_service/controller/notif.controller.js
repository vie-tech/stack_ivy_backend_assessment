const nodemailer = require("nodemailer");
const twilio = require("twilio");
const { parseMessage, successfulMessage } = require("../helper/email.message");
const { successfulMobileMessage, failedMobileMessage } = require("../helper/mobile.messages");
const accountSID = process.env.TWILO_SID;
const token = process.env.TWILO_AUTH_TOKEN;
require("dotenv").config();
const twilioClient = twilio(accountSID, token);

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

const sendInsufficientNotifToUser = async (ctx) => {
  const { user, amountToDeduct, notifType } = ctx.params;
  const emailContent = parseMessage(user, amountToDeduct);

  try {
    if (!user || !amountToDeduct || !notifType)
      return console.log("Invalid params passed to notification service");

    if (notifType === "email") {
      const info = await transporter.sendMail({
        from: "<maddison53@ethereal.email>", // sender address
        to: user.email, // list of receivers
        subject: "Email notification", // Subject line
        html: emailContent, // html body
      });
      console.log(info);
    } else if (notifType === "mobile") {
      const mobileContent = failedMobileMessage(user, amountToDeduct)

      const smsInfo = await twilioClient.messages.create({
        body: mobileContent,
        from: +13203226382,
        to: Number(user.phone),
      });

      console.log("SMS sent", smsInfo);
      const status = await twilioClient
        .messages("SM545418d7cbf69ee6af6b4254a8d6b011")
        .fetch();
      console.log(status);
    }
  } catch (err) {
    console.log(err, "from notif service");
  }
};

const successfulDeposit = async (ctx) => {
  const { user, newBalance, notifType, amountToDeduct } = ctx.params;
  const emailContent = successfulMessage(user, amountToDeduct, newBalance);
  try {
    if (!user || !amountToDeduct || !notifType)
      return console.log("Invalid params passed to notification service");

    if (notifType === "email") {
      const info = await transporter.sendMail({
        from: "<maddison53@ethereal.email>",
        to: user.email,
        subject: "Email notification",
        html: emailContent,
      });
      console.log(info);
    } else if (notifType === "mobile") {
      const mobileContent = successfulMobileMessage(user, amountToDeduct)
      const smsInfo = await twilioClient.messages.create({
        body: mobileContent,
        from: +13203226382,
        to: Number(user.phone),
      });

      console.log("SMS sent", smsInfo);
      const status = await twilioClient
        .messages("SM545418d7cbf69ee6af6b4254a8d6b011")
        .fetch(); //to check the status of the previous message
      console.log(status);
    }
  } catch (err) {
    console.log(err, "from notif service");
  }
};
module.exports = {
  sendInsufficientNotifToUser,
  successfulDeposit,
};
