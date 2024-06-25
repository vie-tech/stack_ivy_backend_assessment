const amqplib = require('amqplib')
const {sendEmail, sendFailedEmail, sendSuccessFulEmail, sendFailedCreditEmail, sendSuccessCreditNotification} = require('../handler/email.handler.js')


class HandleNotifications{
    constructor() {
        this.connection = null;
        this.channel = null;
      }
  
      async connect() {
          try {
            this.connection = await amqplib.connect(
              "amqps://auloxund:5p4s0rHOLoJsBE7Te0E2ECUegAzprTE5@sparrow.rmq.cloudamqp.com/auloxund"
            );
            this.channel = await this.connection.createChannel();
            console.log("Wallet broker connected");
          } catch (error) {
            console.error("Error connecting to message broker:", error.message);
            throw error;
          }
        }
    async handleSignupNotification(){
        try{
            if (!this.channel) {
                await this.connect();
              }
            const queueName = "signup_notification"
            await this.channel.assertQueue(queueName, {durable: false})
            this.channel.consume(queueName, async (msg)=>{
                const content = msg.content.toString()
                console.log(content)
                const response =  await sendEmail(content)
                console.log(response)
                
            }, {noAck: true})
        }catch(err){
            console.log(err)
        }
       
        
    }


    async handleFailedNotification(){
        try{
            if (!this.channel) {
                await this.connect();
              }
            const queueName = 'failed_notification'
            await this.channel.assertQueue(queueName, {durable: false})
           this.channel.consume(queueName, async (msg)=>{
                const content = JSON.parse(msg.content.toString())
                console.log(content)
                const response =  await sendFailedEmail(content.email, content.name, content.amountToDeduct, content.notifType) 
                console.log(response)
                
            }, {noAck: true})
        }catch(err){
            console.log(err.message)
        }
        
    }

    async handleSuccessfulNotification(){
        try{
            if (!this.channel) {
                await this.connect();
              }
            const queueName = 'successful_notification'
            await this.channel.assertQueue(queueName, {durable: false})
           this.channel.consume(queueName, async (msg)=>{
                const content = JSON.parse(msg.content.toString())
                console.log(content)
                const response =  await sendSuccessFulEmail(content.email, content.name, content.amountToDeduct, content.newBalance, content.notifType) 
                console.log(response)
                
            }, {noAck: true})
        }catch(err){
            console.log(err.message)
        }
    }

    async handleFailedCreditNotification(){
        try{
            if (!this.channel) {
                await this.connect();
              }
            const queueName = 'failed_credit_notification'
            await this.channel.assertQueue(queueName, {durable: false})
           this.channel.consume(queueName, async (msg)=>{
                const content = JSON.parse(msg.content.toString())
                console.log(content)
                const response =  await sendFailedCreditEmail(content.email, content.name, content.amountToAdd, content.notifType) 
                console.log(response)
                
            }, {noAck: true})
        }catch(err){
            console.log(err.message)
        }
    }
    async handleSuccessCreditNotification(){
        try{
            if (!this.channel) {
                await this.connect();
              }
            const queueName = 'successful_credit_notification'
            await this.channel.assertQueue(queueName, {durable: false})
           this.channel.consume(queueName, async (msg)=>{
                const content = JSON.parse(msg.content.toString())
                console.log(content)
                const response =  await sendSuccessCreditNotification(content.email, content.name, content.amountToAdd, content.newBalance, content.notifType) 
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