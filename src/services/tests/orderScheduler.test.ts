import { orderSchedulerService, calculateNextOrderDate, createOrderSchedule } from '../orderScheduler';
import { orderSchedulesGateway } from '../../gateways/orderScheduler/orderSchedulesGateway';
import { Subscriptions, subscriptionsGateway, SubscriptionsGateway } from '../../gateways/subscriptions/subscriptionsGateway';
import { plansGateway, PlansGateway } from '../../admin/plansGateway';
import { jest } from '@jest/globals';
import { testDbTemplate } from "../../testSupport/databaseTestSupport";
import { beforeEach, it, describe, expect, test } from "vitest";

describe('orderSchedulerService', async () => {
    const template = await testDbTemplate('SubscriptionsGateway');
    const gatewaySubscriptions = subscriptionsGateway.create(template);
    const gatewayPlans = plansGateway.create(template);
    const gatewayOrderSchedules = orderSchedulesGateway.create(template);

    beforeEach(async () => {
        await template.clear();
    });

    it('schedules orders for pending subscriptions', async () => {
        const subscriptions: Subscriptions[] = [
            {
                profile_id: 1,
                customer_id: 1,
                plan_id: 1,
                status: 'active',
                start_date: '2023-01-01',
                end_date: '2023-12-31',
                created_at: new Date('2023-01-01'),
                updated_at: new Date('2023-01-01'),
                last_order_date: new Date('2023-01-01')
            }
        ];
        const plan: { id: number; frequency: string } = { id: 1, frequency: 'daily' };

        // (gatewaySubscriptions.fetchPendingSubscriptions as jest.Mock).mockResolvedValue(subscriptions);
        // (gatewayPlans.findById as jest.Mock).mockResolvedValue(plan);
        // (gatewayOrderSchedules.checkIfOrderScheduleExists as jest.Mock).mockResolvedValue([]);
        //
        // await orderSchedulerService(gatewayOrderSchedules, gatewaySubscriptions, gatewayPlans);
        //
        // expect(orderSchedulesGateway.create).toHaveBeenCalledWith(1, 'Pending', expect.any(Date));
    });

    it('does not schedule orders if no pending subscriptions', async () => {
        // Test implementation
    });

    it('handles missing plan for subscription', async () => {
        // Test implementation
    });

    it('handles existing order schedule', async () => {
        // Test implementation
    });
});

describe('calculateNextOrderDate', () => {
    it('calculates next order date for daily frequency', () => {
        // Test implementation
    });

    it('calculates next order date for weekly frequency', () => {
        // Test implementation
    });

    it('calculates next order date for monthly frequency', () => {
        // Test implementation
    });

    it('throws error for unknown frequency', () => {
        // Test implementation
    });
});