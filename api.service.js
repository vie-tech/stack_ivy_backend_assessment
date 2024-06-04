"use strict";
const ApiGateway = require("moleculer-web");

module.exports = {
    name: "gateway",

    mixins: [ApiGateway],

    settings: {
        port: process.env.PORT || 3000,
        routes: [
            {
                path: "/api",

                aliases: {
                    "POST /notify": "notification.notify",
                    "/user": "user.getCurrentUser",
                    "/wallet" : "wallet.walletBalance",
                    "user/login": "user.setCurrentUser",
                    "/user/balance": "wallet.getWalletBalance",
                    '/transaction/debit': "transaction.triggerDebit",
                    'POST /user/signup':   "user.createUser",
                    "/user/debit": "wallet.triggerDebit",
                    
                },

                // Enable CORS
                cors: {
                    origin: "*", //replace with frontend url if it was a real project
                    methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
                    allowedHeaders: ["Content-Type", "Authorization"],
                },

                // Use body parsers
                bodyParsers: {
                    json: true,
                    urlencoded: { extended: true },
                },
            },
        ],
    },

    methods: {
        // Additional methods for the gateway can be added here
    },
};
