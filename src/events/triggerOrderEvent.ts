import { KafkaProducer } from "../kafka/producer";

export async function triggerOrderEvent(customer_id: number, plan_id: number, status: string, start_date: string, end_date: string) {
    // const producer = new KafkaProducer('my-producer', ['kafka:9092']);
    // await producer.connect();
    // await producer.sendMessage('tenant-order-created-topic', {
    //     customer_id,
    //     plan_id,
    //     status,
    //     start_date,
    //     end_date
    // });
    // await producer.disconnect();
}