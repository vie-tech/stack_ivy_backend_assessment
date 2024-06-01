const { methods } = require("../../api.service");

module.exports = {
  name: "transaction",
  actions: {
    async triggerDebit(ctx) {
      const amountToDeduct = Number(ctx.params.amountToDeduct);

      // Input validation
      if (isNaN(amountToDeduct) || amountToDeduct <= 0) {
        return { message: "Invalid amount to deduct" }; // For UI response and client error display
      }

      try {
        const response = await ctx.call("user.getCurrentUser");
        if (!response.success)
          return this.logger.error("Cannnot get user object");
        const user = await response.user;
        // Check if user exists and has a balance property (In case user account might be blocked)
        if (typeof user.balance !== "number") {
          this.logger.info("User not signed in or balance unavailable"); // For dev
          return { message: "User not found or balance is unavailable" }; // For UI response and client error display
        }

        const transactionProcess = await this.deductBalance(
          user,
          amountToDeduct
        );

        if (!transactionProcess.success) {
          await ctx.call("notification.sendInsufficientNotifToUser", {
            user,
            amountToDeduct,
          });
          return { message: transactionProcess.message };
        }

        await ctx.call("notification.sendDebitNotifToUser", {
          userId: user.id,
          newBalance,
        });
        return { message: transactionProcess.message };
      } catch (error) {
        ctx.broker.logger.error("Failed to trigger debit:", error.message);
        return {
          message: "An error occurred while processing the debit",
          error: error.message,
        };
      }
    },
  },

  methods: {
    async deductBalance(user, amountToDeduct) {
      const newBalance = user.balance - amountToDeduct;

      if (newBalance < 0) {
        return {
          success: false,
          message: "Insufficient balance, please recharge and try again",
        };
      }

      try {
        // Mock a balance deduction action that involves mutating a database service

        // Log the balance deduction for auditing purposes
        this.logger.info(
          `Deducted ${amountToDeduct} from user ${user.id}. New balance: ${newBalance}`
        );

        return {
          success: true,
          message: `Amount debited successfully, see you soon :)`,
          newBalance,
        };
      } catch (error) {
        this.logger.error("Failed to deduct balance:", error.message);
        throw new Error("Failed to deduct balance");
      }
    },
  },
};
