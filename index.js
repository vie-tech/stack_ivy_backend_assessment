const { ServiceBroker } = require("moleculer");
const config = require('./moleculer.config')
const broker = new ServiceBroker({
    nodeID: "gateway-node",
    transporter: null,
    config
});

broker.loadServices();

// Load services
broker.loadService("./api.service.js");


// Start the broker
broker.start().then(()=>{
    console.log('broker is runninng')
})
