import {beforeEach, describe, expect, test} from "vitest";
import {testDbTemplate} from "../../testSupport/databaseTestSupport";
import {orderSchedulesGateway} from "./orderSchedulesGateway";

describe("orderSchedulesGateway", async () => {
    const template = await testDbTemplate("orderSchedulesGateway");
    const scheduleGateway = orderSchedulesGateway.create(template);

    beforeEach(async () => {
        await template.clear();
    });

    test("create", async () => {
        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )

        await template.execute(
            "insert into subscription_profiles (profile_id, customer_id, plan_id, start_date, end_date, status) values (1, 1, 1, '2025-01-01', '2025-01-31', 'Active')"
        )

        await scheduleGateway.create(1, "Pending", new Date("2025-01-01"));

        const result = await template.queryAny("select * from order_schedules where schedule_id = 1");

        expect(result[0].schedule_id).toBeDefined()
        expect(result[0].profile_id).toBeDefined()
        expect(result[0].status).toEqual("Pending");
        expect(result[0].scheduled_date.toISOString().split('T')[0]).toEqual("2025-01-01");
        expect(result[0].order_date).toBeNull;

    });

    test("find not found", async () => {

    });
});
