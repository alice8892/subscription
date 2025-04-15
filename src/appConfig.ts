import {Express} from "express";
import {databaseTemplate} from "./databaseSupport/databaseTemplate";
import {index} from "./handleIndex";
import {health} from "./handleHealth";
import {staticFileHandler} from "./webSupport/staticFileHandler";
import {Environment} from "./environment";
import {customer} from "./handleCustomer";
import {customerGateway} from "./gateways/customers/customerGateway";
import {customerAddress} from "./handleCustomerAddress";
import {customerAddressGateway} from "./gateways/customers/customerAddress/customerAddressGateway";
import {ordersGateway} from "./gateways/orders/ordersGateway";
import {subscriptionsGateway} from "./gateways/subscriptions/subscriptionsGateway";
import {checkout} from "./handleCheckout";
import {orders} from "./handleOrders";
import {plans} from "./handlePlans";
import {plansGateway} from "./admin/plansGateway";
import {orderschedule} from "./handleOrderSchedule";
import {orderSchedulesGateway} from "./gateways/orderScheduler/orderSchedulesGateway";
import {subscriptions} from "./handleSubscriptions";
import Handlebars from 'handlebars';
import {profileOrderGateway} from "./gateways/subscriptions/profileOrders/profileOrdersGateway";


export const configureApp = (environment: Environment) => (app: Express) => {
    const dbTemplate = databaseTemplate.create(environment.postgresUrl);
    const gatewayCustomer = customerGateway.create(dbTemplate);
    const gatewayCustomerAddress = customerAddressGateway.create(dbTemplate);
    const gatewayOrders = ordersGateway.create(dbTemplate);
    const gatewaySubscriptions = subscriptionsGateway.create(dbTemplate);
    const gatewayPlans = plansGateway.create(dbTemplate);
    const gatewayOrderSchedules = orderSchedulesGateway.create(dbTemplate);
    const gatewayProfileOrders = profileOrderGateway.create(dbTemplate);

    customer.registerHandler(app, gatewayCustomer);
    customerAddress.registerHandler(app, gatewayCustomerAddress);
    orders.registerHandler(app, gatewayOrders, gatewaySubscriptions, gatewayOrderSchedules, gatewayProfileOrders);
    checkout.registerHandler(app, gatewayPlans, gatewayOrders);
    subscriptions.registerHandler(app, gatewaySubscriptions);
    plans.registerHandler(app, gatewayPlans);
    index.registerHandler(app);
    health.registerHandler(app, dbTemplate);
    staticFileHandler.registerHandler(app);
    orderschedule.registerHandler(app,gatewayOrderSchedules);

    Handlebars.registerHelper('formatDate', function(date) {
        if(date) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${month}-${day}-${year}`;
        }
    });

};
