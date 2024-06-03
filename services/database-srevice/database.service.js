const mongoose = require("mongoose");
const User = require("./user.model").User;

module.exports = {
  name: "database",
  actions: {
    async createUser(ctx) {
      try {
        const { username, password } = ctx.params;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return { success: false, message: "User already exists" };
        }
        const newUser = new User({ username, password });
        const token = await ctx.call("authentication.generateToken", {
          id: newUser._id,
          user: newUser.username,
        });
        if (!token) return this.logger.error("Could not generate user token");
        await newUser.save();
        this.logger.info(`User ${username} created`);
        ctx.meta.$responseHeaders = {
            "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600`
        };
        return {success: true, message: 'User created successfully'}
      } catch (err) {
        this.logger.error(err.message);
      }
    },
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
