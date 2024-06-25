const amqplib = require("amqplib");


class WalletBroker {
    
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

      async sendFailedNotif(email,name, amountToDeduct, notifType) {
        try {
          if (!this.channel) {
            await this.connect();
          }
          const queueName = "failed_notification"
          await this.channel.assertQueue(queueName, { durable: false });
          const data ={
            email: email,
            name,
            amountToDeduct,
            notifType: notifType
          }
          const message = JSON.stringify(data);

          this.channel.sendToQueue(queueName, Buffer.from(message));
          console.log("Message sent to:", email);
          return true;
        } catch (err) {
          console.error("Error sending notification:", err.message);
          return false; // Handle failure in calling code
        }
      }
      async sendSuccessNotif(email, name, amountToDeduct, newBalance, notifType) {
        try {
          if (!this.channel) {
            await this.connect();
          }
          const queueName = "successful_notification"
          await this.channel.assertQueue(queueName, { durable: false });
          const data ={
            email: email,
            notifType: notifType,
            name,
            amountToDeduct,
            newBalance
          }
          const message = JSON.stringify(data);
          this.channel.sendToQueue(queueName, Buffer.from(message));
          console.log("Message sent to:", email);
          return true;
        } catch (err) {
          console.error("Error sending notification:", err.message);
          return false; // Handle failure in calling code
        }
      }

      async sendFailedCreditNotif(email, name, amountToAdd, notifType){
        try {
          if (!this.channel) {
            await this.connect();
          }
          const queueName = "failed_credit_notification"
          await this.channel.assertQueue(queueName, { durable: false });
          const data ={
            email,
            name,
            amountToAdd,
            notifType
          }
          const message = JSON.stringify(data);

          this.channel.sendToQueue(queueName, Buffer.from(message));
          console.log("Message sent to:", email);
          return true;
        } catch (err) {
          console.error("Error sending notification:", err.message);
          return false; 
        }
      }

      async sendSuccessCreditNotif(email, name, amountToAdd, newBalance, notifType){
        try {
          if (!this.channel) {
            await this.connect();
          }
          const queueName = "successful_credit_notification"
          await this.channel.assertQueue(queueName, { durable: false });
          const data ={
            email: email,
            notifType: notifType,
            name,
            amountToAdd,
            newBalance
          }
          const message = JSON.stringify(data);
          console.log(message)
          this.channel.sendToQueue(queueName, Buffer.from(message));
          console.log("Message sent to:", email);
          return true;
        } catch (err) {
          console.error("Error sending notification:", err.message);
          return false; // Handle failure in calling code
        }
      }

      async closeConnection() {
        try {
          if (this.channel) {
            await this.channel.close();
          }
          if (this.connection) {
            await this.connection.close();
          }
          console.log("Message broker connection closed");
        } catch (error) {
          console.error("Error closing message broker connection:", error.message);
        }
      }
}

const walletBroker = new WalletBroker()

module.exports = {walletBroker};