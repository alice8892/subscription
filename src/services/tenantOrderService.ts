import {OrderGateway} from '../gateways/orders/ordersGateway';
import {OrderSchedulesGateway} from "../gateways/orderScheduler/orderSchedulesGateway";
import {SubscriptionsGateway} from "../gateways/subscriptions/subscriptionsGateway";
import {PlansGateway} from "../admin/plansGateway";
import {ProfileOrderGateway} from "../gateways/subscriptions/profileOrders/profileOrdersGateway";

export const tenantOrderService = async (orderScheduleGateway: OrderSchedulesGateway, subscriptionGatway: SubscriptionsGateway, ordersGateway: OrderGateway, plansGateway: PlansGateway, profileOrderGateway: ProfileOrderGateway) => {
    const pendingOrderSchedules = await orderScheduleGateway.getPendingSchedules();
    console.log("Starting to create orders for pending schedules: " + pendingOrderSchedules.length);

    for (const orderSchedule of pendingOrderSchedules) {
        const profile = await subscriptionGatway.findById(orderSchedule.profile_id);
        if (profile) {
            const firstOrderInfo = profile.order_details;
            const plan = await plansGateway.findById(profile.plan_id);
            if (plan) {
                try {
                    const order = await ordersGateway.create(
                        profile.customer_id,
                        profile.plan_id,
                        firstOrderInfo.sku,
                        firstOrderInfo.qty,
                        "Pending",
                        firstOrderInfo.total_amount,
                        firstOrderInfo.billing_address_id,
                        firstOrderInfo.shipping_address_id
                    );
                    console.log("Order created for Profile ID: " + orderSchedule.profile_id);
                    await profileOrderGateway.create(orderSchedule.profile_id, order.order_id);
                    await subscriptionGatway.updateLastOrderDate(orderSchedule.profile_id, new Date(order.created_at));
                    await orderScheduleGateway.update(orderSchedule.schedule_id, "Completed", new Date(order.created_at));
                } catch (error) {
                    console.log('Error creating order for schedule: ' + orderSchedule.schedule_id);
                    console.log(error);
                }
            } else {
                console.log('Profile not found' + profile.plan_id);
            }
        } else {
            console.log('Profile not found' + orderSchedule.profile_id);
        }
    }
}