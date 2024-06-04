const User = require("../model/user.model").User;
const responseHandler = require("../../../handlers/response.handler");
const mongoose = require('mongoose')



const createUser = async (ctx) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { username, password, phone, email } = ctx.params;
  
      if (!username || !password || !phone || !email) {
        await session.abortTransaction();
        session.endSession();
        console.log('Important field is missing')
        return responseHandler.badRequest(ctx);
      }
  
      const existingUser = await User.findOne({ username }).session(session);
      if (existingUser) {
        await session.abortTransaction();
        session.endSession();
        return responseHandler.conflict(ctx);
      }
  
      const newUser = await new User({ username, password, phone, email });
     
  
      const token = await ctx.call("authentication.generateToken", {
        id: newUser._id,
        user: newUser.username,
      });
  
      if (!token) {
        await session.abortTransaction();
        session.endSession();
        this.logger.error("Could not generate user token");
        return responseHandler.error(ctx);
      }
  
      await ctx.call("wallet.createWallet", {
        owner: newUser._id,
      });
      
       await newUser.save({ session });
      await session.commitTransaction();
      session.endSession();
  
      
      ctx.meta.$responseHeaders = {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600`,
      };

      
       
      return {newUser}
      
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      return responseHandler.error(ctx);
    }
  };

const getUserBalance = async (ctx) => {
  try {
    console.log(ctx.meta.user.id)
    const { username } = ctx.params;
    console.log(username);
    if (!username) return console.log("Username not passed");
    const user = await User.findOne({ username });
    if (!user) return console.log("User not found");
    return user.balance;
  } catch (err) {
    console.log(err.message);
  }
};

const userLogin = async (ctx) => {
  try {
    const { username, password } = ctx.params;
    if (!username || !password)
      return console.log(
        "Invalid values credentials passed (from user service)"
      );
    const user = await User.findOne({ username: username });
    if (!user) return console.log("User does not exist");
    const validPassword = await user.validatePassword(password);
    if (!validPassword) return console.log("Username or password is not valid");
    const token = await ctx.call("authentication.generateToken", {
      id: user._id,
      user: user.username,
    });
    if (!token)
      return console.log(`Could not generate token (from user service)`);

    ctx.meta.$responseHeaders = {
      "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600`,
    };
    return { success: true, message: `Welcome back ${user.username}` };
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  createUser,
  getUserBalance,
  userLogin,
};
