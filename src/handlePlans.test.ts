import {afterEach, beforeEach, describe, expect, test} from "vitest";
import {appServer, AppServer} from "./webSupport/appServer";
import {testDbTemplate} from "./testSupport/databaseTestSupport";
import {plans} from "./handlePlans";
import {plansGateway} from "./admin/plansGateway";

describe("handlePlans", async () => {
    let server: AppServer;
    const template = await testDbTemplate("handlePlans");
    const gateway = plansGateway.create(template);

    beforeEach(async () => {
        await template.clear();
        server = await appServer.start(0, app => {
            plans.registerHandler(app, gateway);
        });
    });

    afterEach(() => {
        server.stop();
    });

    test("get /admin", async () => {
        const response = await fetch(`${server.address}/admin`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("View plans");
        expect(textBody).toContain("View orders");
        expect(textBody).toContain("View subscriptions");
        expect(textBody).toContain("Dashboard");
    });

    test("get /admin/plans", async () => {
        await gateway.create("test_1", "Test 1", "D", 4, true, "This is test description");
        await gateway.create("test_2", "Test 2", "M", 4, true, "This is test description");
        await gateway.create("test_3", "Test 3", "Y", 4, true, "This is test description");

        const response = await fetch(`${server.address}/admin/plans`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("View orders");
        expect(textBody).toContain("View subscriptions");
        expect(textBody).toContain("test_1");
        expect(textBody).toContain("test_2");
        expect(textBody).toContain("test_3");
    });

    test("get /admin/plans no plans", async () => {

        const response = await fetch(`${server.address}/admin/plans`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("View orders");
        expect(textBody).toContain("View subscriptions");
        expect(textBody).toContain("No plans found.");
    });

    test("get /admin/plans/:plan_id/edit", async () => {
        const createPlan = await gateway.create("test_1", "Test 1", "D", 4, true, "This is test description");

        expect(createPlan).toBeDefined();
        expect(createPlan.plan_id).toBeGreaterThan(0);

        const response = await fetch(`${server.address}/admin/plans/${createPlan.plan_id}/edit`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("View subscriptions");
        expect(textBody).toContain("View orders");
        expect(textBody).toContain("Edit plan");
        expect(textBody).toContain("test_1");
        expect(textBody).toContain("Test 1");
    });

    // test("get /admin/plans/:plan_id/edit no record", async () => {
    //     await gateway.create("test_1", "Test 1", "D", 4, true, "This is test description");
    //     const response = await fetch(`${server.address}/admin/plans/4444/edit`, {
    //         "method": "GET",
    //         headers: {"Content-Type": "application/x-www-form-urlencoded"},
    //         redirect: "manual"
    //     });
    //
    //     expect(response.headers.get("location")).toBe("/admin/plans?noplan=true");
    //
    //     const redirectResponse = await fetch(`${server.address}/admin/plans?noplan=true`, {
    //         "method": "GET",
    //         headers: {"Content-Type": "application/x-www-form-urlencoded"},
    //     });
    //
    //     const textBody = await redirectResponse.text();
    //     expect(textBody).toContain("Plan does not exist!");
    // });

    test("post /admin/plans/:plan_id/update", async () => {
        const createPlan = await gateway.create("test_1", "Test 1", "D", 4, true, "This is test description");

        expect(createPlan).toBeDefined();
        expect(createPlan.plan_id).toBeGreaterThan(0);

        const response = await fetch(`${server.address}/admin/plans/${createPlan.plan_id}/update`, {
            "method": "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "plan_code=test_2&plan_title=Test 2&frequency=D&frequency_duration=4&is_active=true&plan_description=This is test description",
            redirect: "manual"
        });

        expect(response.headers.get("location")).toBe("/admin/plans?success=true");

        const redirectResponse = await fetch(`${server.address}/admin/plans?success=true`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await redirectResponse.text();
        expect(textBody).toContain("Plan saved successfully!");
        expect(textBody).toContain("test_2");
        expect(textBody).toContain("Test 2");
    });

    test("get /admin/plans/create", async () => {
        const response = await fetch(`${server.address}/admin/plans/create`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("Add plan");
    });

    test("post /admin/plans/save", async () => {
        const response = await fetch(`${server.address}/admin/plans/save`, {
            "method": "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "plan_code=test_1&plan_title=Test 1&frequency=D&frequency_duration=4&is_active=true&plan_description=This is test description",
            redirect: "manual"
        });

        expect(response.headers.get("location")).toBe("/admin/plans?success=true");

        const redirectResponse = await fetch(`${server.address}/admin/plans?success=true`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await redirectResponse.text();
        expect(textBody).toContain("Plan saved successfully!");
        expect(textBody).toContain("test_1");
        expect(textBody).toContain("Test 1");
    });

    test("post /admin/plans/save duplicate plan", async () => {
        await gateway.create("test_1", "Test 1", "D", 4, true, "This is test description");

        const response = await fetch(`${server.address}/admin/plans/save`, {
            "method": "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "plan_code=test_1&plan_title=Test 1&frequency=D&frequency_duration=4&is_active=true&plan_description=This is test description",
            redirect: "manual"
        });

        expect(response.headers.get("location")).toBe("/admin/plans/create?duplicateplan=true");

        const redirectResponse = await fetch(`${server.address}/admin/plans/create?duplicateplan=true`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await redirectResponse.text();
        expect(textBody).toContain("Plan with same frequency and frequency duration already exist!");
        expect(textBody).toContain("Add plan");
    });
})