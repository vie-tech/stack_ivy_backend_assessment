// moleculer.config.js
module.exports = {
    namespace: "",

    // Define the transporter (communication channel)
    transporter: "NATS", // You can use NATS or any other supported transporter

    // Define the serializer (optional)
    serializer: "JSON",

    // Define the logger (optional)
    logger: true,

    // Define the log level (optional)
    logLevel: "info", // Set to "info", "debug", "warn", or "error"

    // Define the request timeout (optional)
    requestTimeout: 10 * 1000, // 10 seconds

    // Define the circuit breaker options (optional)
    circuitBreaker: {
        enabled: true,
        threshold: 0.5,
        windowTime: 60, // in seconds
        minRequestCount: 20,
        halfOpenTime: 10 * 1000, // 10 seconds
        check: err => err && err.code >= 500 // Circuit breaker will be activated for server errors
    },

    // Define the retry policy (optional)
    retryPolicy: {
        enabled: true,
        retries: 5,
        delay: 100,
        maxDelay: 2000,
        factor: 2,
        check: err => err && !!err.retryable
    },

    // Define the middlewares (optional)
    middlewares: [],

    // Define the metrices (optional)
    metrics: true,

    // Define the statistics (optional)
    statistics: true,

    // Define the tracing (optional)
    tracing: true,

    // Define the validation (optional)
    validation: true,

    // Define the heartbeat interval (optional)
    heartbeatInterval: 5,

    // Define the heartbeat timeout (optional)
    heartbeatTimeout: 15,

    // Define the hot reload (optional)
    hotReload: true,

    // Define the register metrics interval (optional)
    registerMetricsInterval: 10 * 1000 // 10 seconds
};


