import {afterEach, beforeEach, describe, expect, test} from "vitest";
import {subscriptions} from "./handleSubscriptions";
import { subscriptionsGateway } from "./gateways/subscriptions/subscriptionsGateway";
import {appServer, AppServer} from "./webSupport/appServer";
import {testDbTemplate} from "./testSupport/databaseTestSupport";

describe("handleSubscriptions", async () => {
    let server: AppServer;
    const template = await testDbTemplate("handleSubscriptions");
    const gatewaySubscriptions = subscriptionsGateway.create(template);

    beforeEach(async () => {
        await template.clear();
        server = await appServer.start(0, app => {
            subscriptions.registerHandler(app, gatewaySubscriptions)
        });
    });

    afterEach(() => {
        server.stop();
    });

    test("get /customer/:customer_id/subscriptions", async () => {
        const response = await fetch(`${server.address}/customer/1/subscriptions`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

    });


    test("get /admin/subscriptions", async () => {
        const response = await fetch(`${server.address}/admin/subscriptions`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("Subscriptions");
    });
});