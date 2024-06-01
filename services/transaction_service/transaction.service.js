const { methods } = require("../../api.service");

module.exports = {
  name: "transaction",
  actions: {
    async triggerDebit(ctx) {
      const amountToDeduct = Number(ctx.params.amountToDeduct);

      // Input validation
      if (typeof amountToDeduct !== "number" || amountToDeduct <= 0) {
        return { message: "Invalid amount to deduct" } //FOR UI RESPONSE AND CLIENT ERROR DISPLAY
      }
      try {
        const user = await ctx.call("user.getCurrentUser");
        // Check if user exists and has a balance property (Incase user account might be blocked)
        if (!user.success) {
          this.logger.info("User not signed in") //FOR DEV
          return { message: "User not found or balance is unavailable" }; //FOR UI RESPONSE AND CLIENT ERROR DISPLAY
        }

        if (amountToDeduct > user.balance) {
          await ctx.call("notification.sendInsufficientNotifToUser", {
            userId: user.id,
          });

          return { message: "Could not deduct amount: insufficient funds" };
        } else {
          const transactionProcess = await this.deductBalance(
            ctx,
            user,
            amountToDeduct
          );
          if (!transactionProcess.success) {
            await ctx.call("notification.sendInsufficientNotifToUser", {
              userId: user.id,
            });
            return { message: transactionProcess.message };
          }
          await ctx.call("notification.sendDebitNotifToUser", {
            userId: user.id,
          });
          return { message: "Amount deducted successfully" };
        }
      } catch (error) {
        // Log the error and return a message
        ctx.broker.logger.error("Failed to trigger debit:", error.message);
        return {
          message: "An error occurred while processing the debit",
          error: error.message,
        };
      }
    },

    methods: {
      async deductBalance(user, amountToDeduct) {
        const newBalance = user.balance - amountToDeduct;
        if (!newBalance < 0) {
          //ADDING FURTHER BALANCE CONFIRMATION FOR EXTRA SAFETY

          return {
            success: false,
            message: "Insufficient balance, please recharge and try again",
          };
        }
      },
    },
  },
};
