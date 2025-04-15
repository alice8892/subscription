import {afterEach, beforeEach, describe, expect, test} from "vitest";
import {appServer, AppServer} from "./webSupport/appServer";
import {testDbTemplate} from "./testSupport/databaseTestSupport";
import {checkout} from "./handleCheckout";
import {plansGateway} from "./admin/plansGateway";
import {ordersGateway} from "./gateways/orders/ordersGateway";

describe("handleCheckout", async () => {
    let server: AppServer;
    const template = await testDbTemplate("handleCheckout");
    const gatewayPlans = plansGateway.create(template);
    const gatewayOrders = ordersGateway.create(template);

    beforeEach(async () => {
        await template.clear();
        server = await appServer.start(0, app => {
            checkout.registerHandler(app, gatewayPlans, gatewayOrders);
        });
    });

    afterEach(() => {
        server.stop();
    });

    test("get /customer/:customer_id/checkout", async () => {
        const response = await fetch(`${server.address}/customer/1111/checkout`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("Checkout Page");
    });

    test("post /customer/:customer_id/order/create", async () => {

    });
})