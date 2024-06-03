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
                    "user/balance": "user.getUserBalance",
                    '/transaction/debit': "transaction.triggerDebit",
                    'POST /user/signup':   "database.createUser"
                    
                },

                // Enable CORS
                cors: {
                    origin: "*",
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
