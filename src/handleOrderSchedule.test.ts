import {afterEach, beforeEach, describe, expect, test} from "vitest";
import {orderschedule} from "./handleOrderSchedule";
import {orderSchedulesGateway, OrderSchedulesGateway} from "./gateways/orderScheduler/orderSchedulesGateway";
import {appServer, AppServer} from "./webSupport/appServer";
import {testDbTemplate} from "./testSupport/databaseTestSupport";


describe("handleOrderSchedule", async () => {
    let server: AppServer;
    const template = await testDbTemplate("handleOrderSchedule");
    const gatewayOrders = orderSchedulesGateway.create(template);

    beforeEach(async () => {
        await template.clear();
        server = await appServer.start(0, app => {
            orderschedule.registerHandler(app, gatewayOrders)
        });
    });

    afterEach(() => {
        server.stop();
    });

    test("'/orders/order_schedule", async () => {

        const response = await fetch(`${server.address}/orders/order_schedule`, {

            method: "GET",

            headers: {"Content-Type": "application/x-www-form-urlencoded"},

        });

        const textBody = await response.text();
        expect(textBody).toContain("Schedule ID");
        expect(textBody).toContain("Scheduled Date");
        expect(textBody).toContain("Order Date");

    });

});