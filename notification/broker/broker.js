const amqplib = require('amqplib')
const {sendEmail} = require('../handler/email.handler.js')


class HandleNotifications{
    async handleSignupNotification(){
        try{
            const queueName = "signup_notification"
            const connection = await amqplib.connect('amqps://auloxund:5p4s0rHOLoJsBE7Te0E2ECUegAzprTE5@sparrow.rmq.cloudamqp.com/auloxund')
            const channel = await connection.createChannel()
            await channel.assertQueue(queueName, {durable: false})
            channel.consume(queueName, async (msg)=>{
                const content = msg.content.toString()
                const response =  await sendEmail(content)
                console.log(response)
                
            }, {noAck: true})
        }catch(err){
            console.log(err.message)
        }
       
        
    }
}


const notificationHandler = new HandleNotifications()

module.exports = {
    notificationHandler
}