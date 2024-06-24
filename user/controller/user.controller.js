const query = require("../database/query.js");
const { pool } = require("../database/database.config.js");
const hashFunction = require("../helper/hash.js").hashFunction;
const tokenGenerator = require("../helper/token.js").tokenGenerator;
class User {
  async signup(username, email, phone, password) {
    let client;
    try {
      client = await pool.connect();
      if (!client) {
        throw new Error("Unable to connect to database");
      }
      await client.query("BEGIN");
      await client.query(query.CREATE_USERS_TABLE);
      await client.query(query.CREATE_WALLET_TABLE);

      const userExists = await client.query(query.SEARCH_QUERY_SIGNUP, [username, email, phone]);
      console.log(userExists);
      if (userExists.rowCount > 0) {
        throw new Error("User already exists");
      }

      const hashedPassword = await hashFunction.hashPassword(password);
      console.log(hashedPassword);
      const result = await client.query(query.INSERT_QUERY_SIGNUP, [
        username,
        email,
        phone,
        hashedPassword,
      ]);
      if (result.rowCount === 0) {
        throw new Error("Account not created");
      }
      const user = result.rows[0];
      await client.query(query.INSERT_QUERY_CREATE_WALLET, [user.id]);
      const token = await tokenGenerator.generateToken(user.id);
      if (!token) {
        throw new Error("Failed to generate token");
      }

      await client.query("COMMIT");
      return {
        success: true,
        message: "Account and wallet created successfully",
        email,
        token,
      };
      
     
     
    } catch (err) {
      if (client) {
        await client.query("ROLLBACK")
      };
      console.error("Error during signup:", err);
      return {
        success: false,
        message: err,
      };
    } finally {
      if (client) client.release();
    }
  }


  async login(username, password){
    let client;
    try{
      
     client = await pool.connect();
     if (!client) {
      throw new Error("Cannot find client database instance");
    }
     const user = await client.query(query.SEARCH_LOGIN_QUERY, [username])
     if(user.rowCount === 0){
        throw new Error('Invalid username or password')
     }
     const isPasswordCorrect = await hashFunction.comparePassword(password, user.rows[0].password)
     if(!isPasswordCorrect){
      throw new Error('Password or username incorrect')
     }
     const token = await tokenGenerator.generateToken(user.rows[0].id)
     if(!token){
      throw new Error('Failed to generate token')
     }
     
     return {
      success: true,
      message: "User logged in successfull",
      token
     }

    }catch(err){
      if(client) await client.query('ROLLBACK')
      console.log(err.message)
    }finally{
      if(client)  client.release()
    }
  }
}

const userFunction = new User();

module.exports = { userFunction };
