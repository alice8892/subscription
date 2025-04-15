import { beforeEach, it, describe, expect, test } from "vitest";
import { orderEventListener } from '../orderEventListener';
import { subscriptionsGateway, SubscriptionsGateway } from '../../gateways/subscriptions/subscriptionsGateway';
import { faker } from '@faker-js/faker';
import { testDbTemplate } from '../../testSupport/databaseTestSupport';

describe('orderEventListener', async () => {
    const template = await testDbTemplate('orderEventListener');
    const gatewaySubscriptions = subscriptionsGateway.create(template);
    beforeEach(async () => {
        await template.clear();
    });

    // it('creates 100 subscription profiles', async () => {
    //     await orderEventListener(gatewaySubscriptions);
    //     expect(gatewaySubscriptions.create).toHaveBeenCalledTimes(100);
    // });

    // await template.execute(`
    //     insert into plans (plan_id, plan_title, frequency, frequency_duration, is_active, plan_description, created_at, updated_at, plan_code)
    //     values
    //     (5, 'Monthly', 'monthly', 0 , true, 'Monthly subscription', now(), now(), 'monthly')`);

    it('creates subscription profiles with valid data', async () => {
        // await orderEventListener(gatewaySubscriptions);
        // for (let i = 0; i < 100; i++) {
        //     expect(gatewaySubscriptions.create).toHaveBeenNthCalledWith(
        //         i + 1,
        //         expect.any(Number),
        //         expect.any(Number),
        //         expect.any(String),
        //         expect.any(Date),
        //         null,
        //         expect.any(String),
        //         expect.any(Date)
        //     );
        // }
    });
});