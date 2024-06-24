const nodemailer = require("nodemailer");

const sendEmail = async (email) => {
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

  let mailOptions = {
    from: "stack_ivy_backend",
    to: email,
    subject: "Signup Successful",
    text: "Thank you for signing up!",
    html: "<b>Thank you for signing up!</b>",
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

module.exports = {
  sendEmail,
};
