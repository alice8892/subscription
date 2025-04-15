import { Kafka, Producer } from 'kafkajs';

export class KafkaProducer {
  private producer: Producer;

  constructor(clientId: string, brokers: string[]) {
    const kafka = new Kafka({ clientId, brokers });
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
    console.log('Producer connected');
  }

  async sendMessage(topic: string, message: object) {
    const formattedMessage = {
      value: JSON.stringify(message),
    };

    try {
      await this.producer.send({
        topic,
        messages: [formattedMessage],
      });
      console.log(`Message sent: ${JSON.stringify(formattedMessage)}`);
    } catch (error) {
      console.error('Error sending message', error);
    }
  }

  async disconnect() {
    await this.producer.disconnect();
    console.log('Producer disconnected');
  }
}

// // Example usage
// (async () => {
//   const producer = new KafkaProducer('my-producer', ['kafka:9092']);
//   await producer.connect();
//   await producer.sendMessage('tenant-order-created-topic', {
//     order_id: '12345',
//     customer_id: '67890',
//     sku: 'ABC123',
//     qty: 1,
//     order_status: 'created',
//     order_date: new Date().toISOString(),
//     total_amount: 100.0
//   });
//   await producer.disconnect();
// })();