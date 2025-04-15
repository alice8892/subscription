// consumer.ts
import { Kafka, Consumer } from 'kafkajs';

export class KafkaConsumer {
    private kafka: Kafka;
    private consumer: Consumer;

    constructor(clientId: string, brokers: string[], groupId: string) {
        this.kafka = new Kafka({ clientId, brokers });
        this.consumer = this.kafka.consumer({ groupId });
    }

    async connect() {
        await this.consumer.connect();
        console.log('Consumer connected');
    }

    async subscribe(topic: string) {
        await this.consumer.subscribe({ topic, fromBeginning: true });
    }

    async run(eachMessageCallback: (message: any) => void) {
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                eachMessageCallback({
                    topic,
                    partition,
                    offset: message.offset,
                    value: message.value?.toString(),
                });
            },
        });
    }

    async disconnect() {
        await this.consumer.disconnect();
        console.log('Consumer disconnected');
    }
}