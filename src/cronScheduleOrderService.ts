import { DatabaseTemplate } from './databaseSupport/databaseTemplate';

export type PendingSubscriptions = {
    profile_id: number;
    start_date: Date;
    end_date: Date;
    last_order_date: Date;
    plan_id: number;
    frequency: string;
};

const mapPendingSubscriptions = (row: any): PendingSubscriptions => ({
    profile_id: row["profile_id"],
    start_date: row["start_date"],
    end_date: row["end_date"],
    last_order_date: row["last_order_date"],
    plan_id: row["plan_id"],
    frequency: row["frequency"]
});

export const fetchPendingSubscriptions = async (dbTemplate: DatabaseTemplate): Promise<PendingSubscriptions[]> => {
    const results =  await dbTemplate.query(
        `SELECT sp.profile_id, sp.start_date, sp.end_date, sp.last_order_date, sp.plan_id, p.frequency
         FROM subscription_profiles sp
                  LEFT JOIN plans p on p.plan_id = sp.plan_id AND p.is_active = true AND p.frequency = 'Daily'
         WHERE sp.status = 'Active' and sp.end_date > NOW()`,
        mapPendingSubscriptions
    );
    return results;
};

export const calculateNextOrderDate = (subscription: PendingSubscriptions, frequency: string): Date => {
    const lastOrderDate = subscription.last_order_date;
    const nextOrderDate = new Date(lastOrderDate);

    switch (frequency) {
        case 'Daily':
            nextOrderDate.setDate(lastOrderDate.getDate() + 1);
            break;
        case 'Weekly':
            nextOrderDate.setDate(lastOrderDate.getDate() + 7);
            break;
        case 'Monthly':
            nextOrderDate.setMonth(lastOrderDate.getMonth() + 1);
            break;
        default:
            throw new Error('Unknown plan frequency');
    }

    return nextOrderDate;
};

export const insertOrderSchedule = async (dbTemplate: DatabaseTemplate, profile_id: number, nextOrderDate: Date) => {
    await dbTemplate.execute(
        `INSERT INTO order_schedules (profile_id, status, scheduled_date)
         VALUES ($1, $2, $3)`,
        profile_id, "Pending", nextOrderDate
    );
};


export const scheduleOrders = async (dbTemplate: DatabaseTemplate) => {
    try {
        const subscriptions = await fetchPendingSubscriptions(dbTemplate);

        for (const subscription of subscriptions) {
            const nextOrderDate = calculateNextOrderDate(subscription, subscription.frequency);
            await insertOrderSchedule(dbTemplate, subscription.profile_id, nextOrderDate);
        }

        console.log('Order scheduling completed successfully.');
    } catch (error) {
        console.error('Error scheduling orders:', error);
    }
};
