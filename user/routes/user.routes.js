const express = require("express");
const router = express.Router();
const userFunction = require("../controller/user.controller").userFunction;
const { messageBroker } = require("../broker/message.broker.js");

messageBroker.connect().catch((error) => {
    console.error("Failed to connect to message broker:", error.message);
    process.exit(1);
  });

router.post("/signup", async (req, res) => {
    console.log(req.body);
    try {
      const { username, email, phone, password } = req.body;
  
      const response = await userFunction.signup(
        username,
        email,
        phone,
        password
      );
      console.log(response);
  
      if (response.success === false) {
        res.status(400).json({ status: 400, message: "Account not created" });
      } else {
        res.cookie("jwtCookieToken", response.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24,
        });
  
        // Send notification asynchronously
        messageBroker.sendSignupNotif(email)
          .then((success) => {
            if (!success) {
              console.log("Failed to send signup notification");
            }
          })
          .catch((err) => {
            console.error("Error sending signup notification:", err.message);
          });
  
        res.status(200).json({ status: 200, message: "Account created" });
      }
    } catch (err) {
      res.status(400).json({ status: 400, message: err.message });
      console.error("Error in signup route:", err.message);
    }
  });

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error("Missing params passed to backend");
    }
    const response = await userFunction.login(username, password);
    console.log(response);
    if (response.success === false) {
      throw new Error("Signing failed");
    }
    res.cookie("jwtCookieToken", response.token, {
      httpOnly: true, // Helps to prevent cross-site scripting attacks
      secure: process.env.NODE_ENV === "production", // Set secure flag in production
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 1 day
    });

    res.status(200).json({ status: 200, message: "Log in success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = { router };
