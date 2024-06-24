const amqplib = require("amqplib");

class MessageBroker {
  #queueName;

  constructor() {
    this.#queueName = "signup_notification";
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqplib.connect(
        "amqps://auloxund:5p4s0rHOLoJsBE7Te0E2ECUegAzprTE5@sparrow.rmq.cloudamqp.com/auloxund"
      );
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.#queueName, { durable: false });
      console.log("Message broker connected");
    } catch (error) {
      console.error("Error connecting to message broker:", error.message);
      throw error;
    }
  }

  async sendSignupNotif(email) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.sendToQueue(this.#queueName, Buffer.from(email));
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

const messageBroker = new MessageBroker();
module.exports = { messageBroker };
