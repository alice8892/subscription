import {OrderSchedulesGateway} from '../gateways/orderScheduler/orderSchedulesGateway';
import {Subscriptions, SubscriptionsGateway} from "../gateways/subscriptions/subscriptionsGateway";
import {PlansGateway} from "../admin/plansGateway";

export const orderSchedulerService = async (orderScheduleGateway: OrderSchedulesGateway, subscriptionsGateway: SubscriptionsGateway, plansGateway: PlansGateway) => {
    const subscriptions = await subscriptionsGateway.fetchPendingSubscriptions();
    console.log("Starting order scheduling for subscriptions..");
    if (subscriptions.length <= 0) {
        console.log("No subscriptions found for scheduling orders.");
    }

    for (const subscription of subscriptions) {
        const plan = await plansGateway.findById(subscription.plan_id);
        if (plan) {
            const nextOrderDate = calculateNextOrderDate(subscription, plan?.frequency);
            console.log("Next Order Date:" + nextOrderDate);
            const scheduleExists = await orderScheduleGateway.checkIfOrderScheduleExists(subscription.profile_id, nextOrderDate);
            if (scheduleExists.length <= 0) {
                try {
                    await createOrderSchedule(subscription.profile_id, nextOrderDate, orderScheduleGateway);
                    console.log("Created schedule for subscription with id: " + subscription.profile_id);
                } catch (error) {
                    console.log("Error while scheduling order for subscription with id: " + subscription.profile_id);
                    console.log(error);
                }
            } else {
                console.log("Schedule exists for subscription with id: " + subscription.profile_id);
            }
        } else {
            console.log("No plan found for subscription with id: " + subscription.profile_id);
        }
    }

    console.log('Order scheduling completed successfully.');
}

export const calculateNextOrderDate = (subscription: Subscriptions, frequency: string): Date => {
    const lastOrderDate = subscription.last_order_date;
    const nextOrderDate = new Date(lastOrderDate);

    switch (frequency) {
        case 'daily':
            nextOrderDate.setDate(lastOrderDate.getDate() + 1);
            break;
        case 'weekly':
            nextOrderDate.setDate(lastOrderDate.getDate() + 7);
            break;
        case 'monthly':
            nextOrderDate.setMonth(lastOrderDate.getMonth() + 1);
            break;
        default:
            throw new Error(`Unknown plan frequency ${frequency}`);
    }

    return nextOrderDate;
}

export const createOrderSchedule = async (profile_id: number, nextOrderDate: Date, orderScheduleGateway: OrderSchedulesGateway) =>
    await orderScheduleGateway.create(profile_id, "Pending", nextOrderDate)

//export { OrderSchedulerService };