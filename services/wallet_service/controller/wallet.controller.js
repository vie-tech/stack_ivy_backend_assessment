const Wallet = require("../model/wallet.model").Wallet;
const responseHandler = require("../../../handlers/response.handler");

const createWallet = async (ctx) => {
  try {
    const { owner } = ctx.params;
    const alreadyExists = await Wallet.findOne({ owner });
    if (alreadyExists) return responseHandler.conflict(ctx);
    Wallet.create({
      owner,
    })
      .then(() => {
        console.log("wallet creted");
        return { success: true, message: "Wallet created successfully" };
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    responseHandler.error(ctx);
  }
};

const getWalletBalance = async (ctx) => {
  try {
    const { userId } = ctx.params;
    if (!userId) return responseHandler.badRequest(ctx);
    const walletOwner = await Wallet.findOne({ owner: userId });
    if (!walletOwner) return responseHandler.notfound(ctx);
    return walletOwner.balance;
  } catch (err) {
    console.log(err);
  }
};

const triggerDebit = async (ctx) => {
  try {
    const { user, amountToDeduct, notifType } = ctx.params;
    if (!user || !amountToDeduct || !notifType)
      return responseHandler.badRequest(ctx);
    // Input validation
    if (isNaN(amountToDeduct) || amountToDeduct <= 0) {
      return responseHandler.badRequest(ctx); // For UI response and client error display
    }
    const walletToDeduct = await Wallet.findOne({ owner: user }).populate(
      "owner"
    );
    if (!walletToDeduct) return responseHandler.notfound(ctx);
    if (amountToDeduct > walletToDeduct.balance) {
      await ctx.call("notification.sendInsufficientNotifToUser", {
        user: walletToDeduct.owner,
        amountToDeduct,
        notifType,
      });
      return responseHandler.failedTransaction(ctx);
    }

    walletToDeduct.balance -= amountToDeduct;
    await walletToDeduct.save();
    const newBalance = walletToDeduct.balance;
    await ctx.call("notification.successfulDeposit", {
      user: walletToDeduct.owner,
      newBalance,
      amountToDeduct,
      notifType,
    });
    return {
      success: true,
      message: `Successfully debited ${amountToDeduct} from ${walletToDeduct.owner.username}`,
    };
  } catch (err) {
    console.log(err);
  }
};

const addMoneyToWallet = (ctx) => {
  const { user, amountToAdd, notifType } = ctx.params;
  if (!user || !amountToAdd) {
    return responseHandler.badRequest(ctx);
  }
  if (isNaN(amountToAdd) || amountToAdd <= 0) {
    return responseHandler.badRequest(ctx, "Invalid amount");
  }

  Wallet.findOneAndUpdate(
    { owner: user },
    { $inc: { balance: amountToAdd } },
    { new: true }
  )
    .populate("owner")
    .then(async (wallet) => {
      if (!wallet) {
        return responseHandler.notfound(ctx);
      }
      await ctx.call("notification.creditAlert", { user: wallet.owner, amount: amountToAdd, notifType });
      return responseHandler.ok(ctx);
    })
    .catch((err) => {
      console.error(err);
      return responseHandler.error(
        ctx,
        "An error occurred while updating the wallet"
      );
    });
};

module.exports = {
  getWalletBalance,
  triggerDebit,
  createWallet,
  addMoneyToWallet,
};
