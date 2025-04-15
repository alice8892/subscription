import { beforeEach, describe, expect, test } from 'vitest';
import {orderDetails, subscriptionsGateway} from './subscriptionsGateway';
import { testDbTemplate } from '../../testSupport/databaseTestSupport';
import {orderSchedulesGateway} from "../orderScheduler/orderSchedulesGateway";
import {calculateNextOrderDate} from "../../../src/services/orderScheduler";
import {ordersGateway} from "../orders/ordersGateway";

describe('SubscriptionsGateway', async () => {
    const template = await testDbTemplate('subscriptionsGateway');
    const gateway = subscriptionsGateway.create(template);
    const orderScheduleGateway = orderSchedulesGateway.create(template);
    const orderGateway = ordersGateway.create(template);

    beforeEach(async () => {
        await template.clear();
    });

    test('create', async () => {
        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'Daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )

        const profile = await gateway.create(1, 1, "active", new Date('2023-01-01'), new Date('2023-12-31'), JSON.parse(orderDetails()), new Date());

        expect(profile.profile_id).toBeDefined();
        expect(profile.plan_id).toEqual(1);
        expect(profile.customer_id).toEqual(1);
        expect(profile.status).toEqual('active');
        expect(new Date(profile.start_date).toISOString().split('T')[0]).toEqual('2023-01-01');
        expect(new Date(profile.end_date).toISOString().split('T')[0]).toEqual('2023-12-31');
        expect(profile.last_order_date).toBeDefined();
    });

    test('list', async () => {
        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'Daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )
        await gateway.create(1, 1, "active", new Date(), null, JSON.parse(orderDetails()), new Date());
        const profiles = await gateway.list();
        expect(profiles).toHaveLength(1);
    });

    //
    test('findById', async () => {
        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'Daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )
        const createdProfile =  await gateway.create(1, 1, "active", new Date('2023-01-01'), new Date('2023-12-31'), JSON.parse(orderDetails()), new Date());

        const profile = await gateway.findById(createdProfile.profile_id);

        expect(profile?.profile_id).toBeDefined();
        expect(profile?.plan_id).toEqual(1);
        expect(profile?.customer_id).toEqual(1);
        expect(profile?.status).toEqual('active');
        expect(new Date(profile?.start_date ?? '').toISOString().split('T')[0]).toEqual('2023-01-01');
        expect(new Date(profile?.end_date ?? '').toISOString().split('T')[0]).toEqual('2023-12-31');

    });

    test('findByCustomerId', async () => {
        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'Daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )
        await gateway.create(1, 1, "active", new Date(), null, JSON.parse(orderDetails()), new Date());

        const profile = await gateway.findByCustomerId(1);

        expect(profile).toHaveLength(1);
        // expect(profile?.profile_id).toBeDefined();
        // expect(profile?.plan_id).toEqual(1);
        // expect(profile?.customer_id).toEqual(1);
        // expect(profile?.status).toEqual('active');
        // expect(new Date(profile?.start_date ?? '').toISOString().split('T')[0]).toEqual('2023-01-01');
        // expect(new Date(profile?.end_date ?? '').toISOString().split('T')[0]).toEqual('2023-12-31');

    });

    test('createOrder', async () => {

        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )

        const startDate = new Date('2025-01-01');
        const orderDetail = JSON.parse(orderDetails());
        const profile = await gateway.create(1, 1, "active", startDate, new Date('2025-12-31'), orderDetail, startDate);
        const orderSchedule = await orderScheduleGateway.create(profile.profile_id, "Pending", calculateNextOrderDate(profile, 'daily'));
        const order = await gateway.createOrder(orderGateway, profile);

        expect(order).toBeDefined();
        expect(order?.order_id).toBeDefined();
        expect(orderSchedule.scheduled_date.toISOString().split('T')[0]).toEqual('2025-01-02');
        expect(order?.customer_id).toEqual(1);
        expect(order?.plan_id).toEqual(1);
        expect(order?.sku).toEqual(orderDetail.sku);
        expect(order?.qty).toEqual(orderDetail.qty);
        expect(order?.order_status).toEqual("Created");

    });


});