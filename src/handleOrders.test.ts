import {afterEach, beforeEach, describe, test} from "vitest";
import {orders} from "./handleOrders";
import {ordersGateway} from "./gateways/orders/ordersGateway";
import {appServer, AppServer} from "./webSupport/appServer";
import {testDbTemplate} from "./testSupport/databaseTestSupport";
import {subscriptionsGateway} from "./gateways/subscriptions/subscriptionsGateway";
import {orderSchedulesGateway} from "./gateways/orderScheduler/orderSchedulesGateway";
import {profileOrderGateway} from "./gateways/subscriptions/profileOrders/profileOrdersGateway";


describe("handleOrders", async () => {
    let server: AppServer;
    const template = await testDbTemplate("handleOrders");
    const gatewayOrders = ordersGateway.create(template);
    const gatewaySubscriptions = subscriptionsGateway.create(template);
    const gatewayOrderSchedules = orderSchedulesGateway.create(template);
    const gatewayProfileOrders = profileOrderGateway.create(template);

    beforeEach(async () => {
        await template.clear();
        server = await appServer.start(0, app => {
            orders.registerHandler(app, gatewayOrders, gatewaySubscriptions, gatewayOrderSchedules, gatewayProfileOrders);
        });
    });

    afterEach(() => {
        server.stop();
    });

    afterEach(() => {
        server.stop();
    });


    test("get /customer/:customer_id/orders", async () => {
        const response = await fetch(`${server.address}/customer/1/orders`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

    });

    test("get /admin/orders", async () => {
        const response = await fetch(`${server.address}/customer/1/orders`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

    });
});