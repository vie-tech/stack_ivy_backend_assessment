const { pool } = require("../database/database.config");
const query = require("../database/query");

class Wallet {
  async getBalance(id) {
    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");
      const user = await client.query(query.GET_BALANCE_QUERY, [id]);
      if (user.rowCount === 0) {
        throw new Error("Could not find user balance");
      }
      return {
        success: true,
        user: user.rows[0].balance,
      };
    } catch (err) {
      if (client) {
        await client.query("ROLLBACK");
      }
      console.log(err.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async debit(id, amountToDeduct) {
    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");
      const user = await client.query(query.GET_BALANCE_QUERY, [id]);
      if (user.rowCount === 0) {
        throw new Error("Could not find user balance");
      }
      const oldBalance = user.rows[0].balance;
      if (oldBalance < amountToDeduct) {
        return {
          success: false,
          message: "Debit failed due to insufficient balance",
          amountToDeduct,
          email: user.rows[0].email,
          name: user.rows[0].username,
        };
      }

      const newBalance = oldBalance - amountToDeduct;
      console.log(newBalance);
      await client.query(query.DEBIT_ACCOUNT_QUERY, [newBalance, id]);
      await client.query("COMMIT");
      return {
        success: true,
        message: "Debit successful",
        amountToDeduct,
        newBalance,
        email: user.rows[0].email,
        username: user.rows[0].username,
      };
    } catch (err) {
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async credit(id, amountToAdd) {
    let client;
    console.log(amountToAdd)
    try {
      client = await pool.connect();
      await client.query("BEGIN");
      const user = await client.query(query.GET_BALANCE_QUERY, [id]);

      if (user.rowCount === 0) {
        throw new Error('Account could not be found')
      }

      if (amountToAdd < 0) {
       
        throw new Error("Invalid Value added");
      }
      const oldBalance = user.rows[0].balance
      const newBalance = oldBalance + amountToAdd;
      await client.query(query.CREDIT_ACCOUNT_QUERY, [newBalance, id]);
      await client.query("COMMIT");
      return {
        success: true,
        amountToAdd,
        newBalance,
        email: user.rows[0].email,
        username: user.rows[0].username,
      };
    } catch (err) {
      if (client) {
        await client.query("ROLLBACK");
        console.log(err.message);
      }
      console.log(err);
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}

const walletFunction = new Wallet();

module.exports = { walletFunction };
