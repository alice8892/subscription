import { beforeEach, describe, expect, test } from 'vitest';
import {orderDetails, subscriptionsGateway} from '../subscriptionsGateway';
import { testDbTemplate } from '../../../testSupport/databaseTestSupport';
import {ProfileOrderGateway, profileOrderGateway} from "./profileOrdersGateway";

describe('ProfileOrderGateway', async () => {
    const template = await testDbTemplate('profileOrdersGateway');
    const gateway = profileOrderGateway.create(template);
    const subscriptionGateway = subscriptionsGateway.create(template);

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

        const profile = await subscriptionGateway.create(1, 1, "active", new Date('2023-01-01'), new Date('2023-12-31'), orderDetails(), new Date());

        const profileOrder = await gateway.create(profile.profile_id, 1);
        expect(profileOrder.profile_id).toBeDefined();
        expect(profileOrder.order_id).toBeDefined();
        expect(profileOrder.profile_id).toEqual(profile.profile_id);
        expect(profileOrder.order_id).toEqual(1);
    });

    test('list', async () => {
        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'Daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )
        const profile = await subscriptionGateway.create(1, 1, "active", new Date('2023-01-01'), new Date('2023-12-31'), orderDetails(), new Date());
        await gateway.create(profile.profile_id, 1);
        const profileOrders = await gateway.list();
        expect(profileOrders.length).toBeGreaterThan(1);
    });

    //
    test('findByProfileId', async () => {
        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'Daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )

        const profile = await subscriptionGateway.create(1, 1, "active", new Date('2023-01-01'), new Date('2023-12-31'), orderDetails(), new Date());

        await gateway.create(profile.profile_id, 1);
        const profileOrders = await gateway.findByProfileId(profile.profile_id);
        expect(profileOrders.length).toBeGreaterThanOrEqual(1);

    });

    test('findByOrderId', async () => {
        await template.execute(
            "insert into plans (plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values (1, 'test_plan', 'daily plan', 'Daily', 4, true, 'Test Plan')"
        )

        await template.execute(
            "insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values (1, 'John', 'Doe', 'john@foo.com', '123456789', true)"
        )

        const profile = await subscriptionGateway.create(1, 1, "active", new Date('2023-01-01'), new Date('2023-12-31'), orderDetails(), new Date());

        await gateway.create(profile.profile_id, 1);
        const profileOrders = await gateway.findByOrderId(1);
        expect(profileOrders.length).toBeGreaterThanOrEqual(1);
    });


});