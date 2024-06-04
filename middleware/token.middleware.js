const jwt = require('jsonwebtoken');
const responseHandler = require('../handlers/response.handler')
module.exports = function tokenMiddleware(handler, action, next) {
    return async function (ctx) {
        try {
           
            const cookies = ctx.meta.headers?.cookie;

            if (!cookies) {
                throw new Error("No cookies provided");
            }

            
            const token = cookies.split('; ').find(row => row.startsWith('token=')).split('=')[1];

            if (!token) {
                throw new Error("Token not found in cookies");
            }

           
            const decoded = jwt.verify(token, secret);

           
            ctx.meta.user = decoded;

            next()
            return handler(ctx);
        } catch (error) {
            // Handle token verification errors
          return responseHandler.unauthorizedOperation(ctx)
          
          
        }
    };
};
