import {orderDetails, SubscriptionsGateway} from '../gateways/subscriptions/subscriptionsGateway';
import { faker } from '@faker-js/faker';

export const orderEventListener = async (gateway: SubscriptionsGateway) => {
    //add new subscription
    console.log("Creating subscription profiles..");
    const subscriptions = await gateway.list();
    if (subscriptions.length <= 0) {
        for (let i = 0; i < 5; i++) {
            const customer_id = faker.number.int({ min: 1, max: 9999 });
            const plan_id = faker.number.int({ min: 1, max: 3 });
            const status = faker.helpers.arrayElement(['active', 'inactive']);
            const start_date = faker.date.past().toISOString().split('T')[0];
            //const end_date = faker.date.future().toISOString().split('T')[0];
            const last_order_date = new Date();
            const res = await gateway.create(customer_id, plan_id, status, new Date(start_date), null, JSON.parse(orderDetails()), last_order_date);
            console.log(`Subscription profile created: ${res.profile_id}`);
        }
    }

    console.log("Subscription profiles created.");
    // const consumer = new KafkaConsumer('my-consumer', ['kafka:9092'], 'tenant-order-group');
    // try {
    //     await consumer.connect();
    //     await consumer.subscribe('tenant-order-created-topic');
    //     await consumer.run(async (message) => {
    //         console.log('Received message:', message);
    //         const { customer_id, plan_id, status, start_date, end_date } = JSON.parse(message.value);
    //         const res = await gateway.create(customer_id, plan_id, status, start_date, end_date);
    //     });
    // } catch (error) {
    //     console.error('Error in Kafka consumer:', error);
    // } finally {
    //     //await consumer.disconnect();
    // }
};