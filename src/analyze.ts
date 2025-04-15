import {subscriptionsGateway} from "./gateways/subscriptions/subscriptionsGateway";
import {orderSchedulesGateway} from "./gateways/orderScheduler/orderSchedulesGateway";
import {ordersGateway}  from "./gateways/orders/ordersGateway";
import {plansGateway} from "./admin/plansGateway";
import {environment} from "./environment";
import {databaseTemplate} from "./databaseSupport/databaseTemplate";
import {orderSchedulerService} from "./services/orderScheduler";
import {tenantOrderService} from "./services/tenantOrderService";
import {profileOrderGateway} from "./gateways/subscriptions/profileOrders/profileOrdersGateway";

const {postgresUrl} = environment.fromEnv();
const dbTemplate = databaseTemplate.create(postgresUrl);
const orderSchedules = orderSchedulesGateway.create(dbTemplate)
const subscriptions = subscriptionsGateway.create(dbTemplate);
const orders = ordersGateway.create(dbTemplate);
const plans = plansGateway.create(dbTemplate);
const profileOrders = profileOrderGateway.create(dbTemplate);
const analyze = async () => {
    await orderSchedulerService(orderSchedules, subscriptions, plans);
    await tenantOrderService(orderSchedules, subscriptions, orders, plans, profileOrders);
}

analyze().
    then(() => {
        console.log("Analysis completed");
    })
    .catch(e => {
        console.error(e);
    });
