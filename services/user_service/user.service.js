const { createUser, getUserBalance, userLogin } = require("./controller/user.controller");
const mongoose = require("mongoose");

module.exports = {
  name: "user",
  actions: {
    createUser,
    getUserBalance,
    userLogin
  },


 
  started() {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        this.logger.info("Database connection established");
      })
      .catch((err) => {
        this.logger.error(err.message);
      });
  },

  stopped() {
    mongoose
      .disconnect()
      .then(() => {
        this.logger.info("Disconnected from MongoDB");
      })
      .catch((err) => {
        this.logger.error("Failed to disconnect from MongoDB", err);
      });
  },
};
