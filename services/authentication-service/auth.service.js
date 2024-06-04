const jwt = require('jsonwebtoken');
require('dotenv').config()


module.exports = {
    name: 'authentication',
    actions: {
        async generateToken(ctx){
            console.log(ctx.params)
            const {id, user} = ctx.params
            const token = jwt.sign({id, user}, process.env.JWT_SECRET)
            if(!token) return this.logger.error('Error from authentication service when generating token')
             return token
        }
    }
}