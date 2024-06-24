const jwt = require('jsonwebtoken')
require('dotenv').config()


class Token {


   async generateToken(id){
     const token = await jwt.sign({id}, process.env.JWT_PASSKEY, {expiresIn: "24h"})
     return token
    }
}



const tokenGenerator = new Token()

module.exports = {tokenGenerator}