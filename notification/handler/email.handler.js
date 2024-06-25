const nodemailer = require("nodemailer");
require("dotenv").config();
const gmailUser = process.env.NODEMAILER_USER;
const gmailPass = process.env.NODEMAILER_PASS;

console.log(gmailPass, gmailUser);
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ativiefavour03@gmail.com",
    pass: "khlh unqs fcok gxiw",
  },
});
const sendEmail = async (email) => {
  let mailOptions = {
    from: "stack_ivy_backend",
    to: email,
    subject: "Signup Successful",
    text:"Newest stark ivy participant",
    html: `<b> Welcome ${email} and Thank you for signing up!</b>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    if (info.accepted.length === 0) {
      return {
        mssg: info.response,
        success: false,
      };
    }

    return {
      success: true,
      message: info.response,
    };
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
};

const sendFailedEmail = async (email, name, amountToDeduct, notifType) => {
  if (notifType === "mobile") {
    const accountSid = "ACc029fbb485442edd91344c2bfc61c540";
    const authToken = "ea70731240045985382d566e21f134b4";
    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        body:`Hello ${name} the amount ${amountToDeduct} could not be debited from your accounr due to insufficient funds`,
        from: "+13203226382",
        to: "+2349058995592",
      })
      .then((message) => console.log(message));
  }else{
    let mailOptions = {
      from: "stack_ivy_backend",
      to: "haymanmaurice1995@gmail.com",
      subject: "Failed debit transaction",
      text: `Hello ${name} the amount ${amountToDeduct} could not be debited from your accounr due to insufficient funds`,
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      if (info.accepted.length === 0) {
        return {
          mssg: info.response,
          success: false,
        };
      }
  
      return {
        success: true,
        message: info.response,
      };
    } catch (error) {
      console.error(`Error sending email: ${error}`);
    }
  }
 
};

const sendSuccessFulEmail = async(email, name, amountToDeduct, newBalance,  notifType)=>{
     
  if (notifType === "mobile") {
    const accountSid = "ACc029fbb485442edd91344c2bfc61c540";
    const authToken = "ea70731240045985382d566e21f134b4";
    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        body:`Congratulations ${name} the amount ${amountToDeduct} has been debited from your account, your new balance is ${newBalance}`,
        from: "+13203226382",
        to: "+2349058995592",
      })
      .then((message) => console.log(message));
  }else{
    let mailOptions = {
      from: "stack_ivy_backend",
      to: email, //toggle to send to yourself or others
      subject: "Successful debit transaction",
      text: `Congratulations ${name} the amount ${amountToDeduct} has been debited from your account, your new balance is ${newBalance}`,
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      if (info.accepted.length === 0) {
        return {
          mssg: info.response,
          success: false,
        };
      }
  
      return {
        success: true,
        message: info.response,
      };
    } catch (error) {
      console.error(`Error sending email: ${error}`);
    }
  }

 
}


const sendFailedCreditEmail = async (email, name, amountToAdd, notifType)=>{
  if (notifType === "mobile") {
    const accountSid = "ACc029fbb485442edd91344c2bfc61c540";
    const authToken = "ea70731240045985382d566e21f134b4";
    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        body:`Hello ${name} the amount ${amountToAdd} could not be credited to your account`,
        from: "+13203226382",
        to: "+2349058995592",
      })
      .then((message) => console.log(message));
  }else{
    let mailOptions = {
      from: "stack_ivy_backend",
      to: "haymanmaurice1995@gmail.com",
      subject: "Failed credit transaction",
      text: `Hello ${name} the amount ${amountToAdd} could not be credited to your account`,
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      if (info.accepted.length === 0) {
        return {
          mssg: info.response,
          success: false,
        };
      }
  
      return {
        success: true,
        message: info.response,
      };
    } catch (error) {
      console.error(`Error sending email: ${error}`);
    }
  }
}

const sendSuccessCreditNotification =async (email, name, amountToAdd, newBalance, notifType)=>{
  if (notifType === "mobile") {
    const accountSid = "ACc029fbb485442edd91344c2bfc61c540";
    const authToken = "ea70731240045985382d566e21f134b4";
    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        body:`Congratulations ${name} the amount ${amountToAdd} has been credited to your account, your new balance is ${newBalance}`,
        from: "+13203226382",
        to: "+2349058995592",
      })
      .then((message) => console.log(message));
  }else{
    let mailOptions = {
      from: "stack_ivy_backend",
      to: email, //toggle to send to yourself or others
      subject: "Successsful credit transaction",
      text: `Congratulations ${name} the amount ${amountToAdd} has been credited to your account, your new balance is ${newBalance}`,
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      if (info.accepted.length === 0) {
        return {
          mssg: info.response,
          success: false,
        };
      }
  
      return {
        success: true,
        message: info.response,
      };
    } catch (error) {
      console.error(`Error sending email: ${error}`);
    }
  }
}


module.exports = {
  sendEmail,
  sendFailedEmail,
  sendSuccessFulEmail,
  sendFailedCreditEmail,
  sendSuccessCreditNotification
};
