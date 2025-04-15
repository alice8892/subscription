import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { testDbTemplate } from './testSupport/databaseTestSupport';
import { scheduleOrders, fetchPendingSubscriptions, calculateNextOrderDate, insertOrderSchedule } from './cronScheduleOrderService';
import * as databaseTestSupport from './testSupport/databaseTestSupport';


describe('cronScheduleOrderService', async  () => {
    const template = await testDbTemplate("cronScheduleOrderServiceGateway");

    beforeEach(async () => {
        await template.clear();
    });

    it('fetches pending subscriptions successfully', async () => {
        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'Daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )

        await template.execute(
            "insert into subscription_profiles (profile_id, customer_id, plan_id, start_date, end_date, status) values (1, 1, 1, '2025-01-01', '2025-12-31', 'Active')"
        )

        const pendingSubs = await fetchPendingSubscriptions(template);

        //profile_id, sp.start_date, sp.end_date, sp.last_order_date, sp.plan_id, p.frequency
        expect(pendingSubs[0].profile_id).toBeDefined()
        expect(pendingSubs[0].start_date).toBeDefined()
        expect(pendingSubs[0].end_date).toBeDefined()
        expect(pendingSubs[0].plan_id).toBeDefined()
        expect(pendingSubs[0].frequency).toEqual("Daily");

    });

    it('calculates next order date correctly for daily frequency', () => {
        const subscription = {
            profile_id: 1,
            start_date: new Date(),
            end_date: new Date(),
            last_order_date: new Date('2023-10-01'),
            plan_id: 1,
            frequency: 'Daily'
        };

        const nextOrderDate = calculateNextOrderDate(subscription, 'Daily');

        expect(nextOrderDate).toEqual(new Date('2023-10-02'));
    });

    it('calculates next order date correctly for weekly frequency', () => {
        const subscription = {
            profile_id: 1,
            start_date: new Date(),
            end_date: new Date(),
            last_order_date: new Date('2023-10-01'),
            plan_id: 1,
            frequency: 'Weekly'
        };

        const nextOrderDate = calculateNextOrderDate(subscription, 'Weekly');

        expect(nextOrderDate).toEqual(new Date('2023-10-08'));
    });

    it('calculates next order date correctly for monthly frequency', () => {
        const subscription = {
            profile_id: 1,
            start_date: new Date(),
            end_date: new Date(),
            last_order_date: new Date('2023-10-01'),
            plan_id: 1,
            frequency: 'Monthly'
        };

        const nextOrderDate = calculateNextOrderDate(subscription, 'Monthly');

        expect(nextOrderDate).toEqual(new Date('2023-11-01'));
    });

    it('throws error for unknown plan frequency', () => {
        const subscription = {
            profile_id: 1,
            start_date: new Date(),
            end_date: new Date(),
            last_order_date: new Date('2023-10-01'),
            plan_id: 1,
            frequency: 'Yearly'
        };

        expect(() => calculateNextOrderDate(subscription, 'Yearly')).toThrow('Unknown plan frequency');
    });

    it('inserts order schedule successfully', async () => {

        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'Daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )

        await template.execute(
            "insert into subscription_profiles (profile_id, customer_id, plan_id, start_date, end_date, status) values (1, 1, 1, '2025-01-01', '2025-12-31', 'Active')"
        )

        const profile_id = 1;
        const nextOrderDate = new Date('2023-10-02');

        await insertOrderSchedule(template, profile_id, nextOrderDate);

        const orderSchedule = await template.queryAny("select * from order_schedules where profile_id = $1", profile_id);

        expect(orderSchedule[0].profile_id).toEqual(profile_id);
        expect(orderSchedule[0].status).toEqual("Pending");
        expect(orderSchedule[0].scheduled_date).toEqual(nextOrderDate);
        expect(orderSchedule[0].order_date).toBeNull();
    });

    it('schedules orders successfully', async () => {

        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'Daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )

        await template.execute(
            "insert into subscription_profiles (profile_id, customer_id, plan_id, start_date, end_date, status, last_order_date) values (1, 1, 1, '2025-01-01', '2025-12-31', 'Active', '2025-03-03')"
        )
        const profile_id = 1;

        await scheduleOrders(template);
        const orderSchedule = await template.queryAny("select * from order_schedules where profile_id = $1", profile_id);
        const nextOrderDate = new Date('2025-03-04');

        expect(orderSchedule[0].profile_id).toEqual(profile_id);
        expect(orderSchedule[0].status).toEqual("Pending");
        expect(orderSchedule[0].scheduled_date).toEqual(nextOrderDate);
        expect(orderSchedule[0].order_date).toBeNull();
    });
});