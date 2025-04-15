import {beforeEach, describe, expect, test} from "vitest";
import {plansGateway} from "./plansGateway";
import {testDbTemplate} from "../testSupport/databaseTestSupport";

describe("plansGateway", async () => {
    const template = await testDbTemplate("plansGateway");
    const gateway = plansGateway.create(template);

    beforeEach(async () => {
        await template.clear();
    });

    test("create", async () => {
        const result = await gateway.create("test_plan", "Test plan", "M", 4, true, "This is test plan.");

        expect(result.plan_code).toEqual("test_plan");
        expect(result.plan_title).toEqual("Test plan")
        expect(result.frequency).toEqual("M")
        expect(result.frequency_duration).toEqual(4)
        expect(result.is_active).toEqual(true)
        expect(result.plan_description).toEqual("This is test plan.")
    });

    test("list", async () => {
        await gateway.create("test_plan", "Test plan", "M", 4, true, "This is test plan.");

        const result = await gateway.list();

        expect(result).toHaveLength(1);
        expect(result[0].plan_code).toEqual("test_plan");
        expect(result[0].plan_title).toEqual("Test plan");
        expect(result[0].frequency).toEqual("M");
        expect(result[0].frequency_duration).toEqual(4);
        expect(result[0].is_active).toEqual(true);
        expect(result[0].plan_description).toEqual("This is test plan.");
    });

    test("listActive", async () => {
        await template.execute("insert into plans (plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values ('test_plan', 'Test plan', 'M', '4', false, 'This is test plan.')");
        await template.execute("insert into plans (plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values ('test_plann', 'Test plann', 'M', '4', true, 'This is test plann.')");

        const result = await gateway.listActive();

        expect(result).toHaveLength(1);
        expect(result[0].plan_code).toEqual("test_plann");
        expect(result[0].plan_title).toEqual("Test plann");
        expect(result[0].frequency).toEqual("M");
        expect(result[0].frequency_duration).toEqual(4);
        expect(result[0].is_active).toEqual(true);
        expect(result[0].plan_description).toEqual("This is test plann.");
    });

    test("findById", async () => {
        await template.execute("insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1111, 'test_plan', 'Test plan', 'M', '4', true, 'This is test plan.')");

        const result = await gateway.findById(1111);

        expect(result!.plan_code).toEqual("test_plan");
        expect(result!.plan_title).toEqual("Test plan");
        expect(result!.frequency).toEqual("M");
        expect(result!.frequency_duration).toEqual(4);
        expect(result!.is_active).toEqual(true);
        expect(result!.plan_description).toEqual("This is test plan.");
    });

    test("no record found", async () => {
        const result = await gateway.findById(1111);
        expect(result).toBeNull();
    });

    test("findDuplicate", async () => {
        await template.execute("insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1111, 'test_plan', 'Test plan', 'M', '4', false, 'This is test plan.')");
        const duplicatePlan = await gateway.findDuplicate("M", 4);

        expect(duplicatePlan).not.toBeNull();
    });

    test("update", async () => {
        await template.execute("insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1111, 'test_plan', 'Test plan', 'M', '4', false, 'This is test plan.')");

        await gateway.update(1111, 'test_plan', 'Test plan', 'M', 4, true, 'This is test plan.');
        const getUpdatedPlan = await gateway.findById(1111);

        expect(getUpdatedPlan!.is_active).toEqual(true);
    });
});