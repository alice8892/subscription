import { CronJob } from 'cron';
import { DatabaseTemplate } from './databaseSupport/databaseTemplate';

export type PendingOrderSchedules = {
    schedule_id: number;
    profile_id: number;
    status: string;
    scheduled_date: Date;
};

const mapPendingOrderSchedules = (row: any): PendingOrderSchedules => ({
    schedule_id: row["schedule_id"],
    profile_id: row["profile_id"],
    status: row["status"],
    scheduled_date: row["scheduled_date"]
});

export const fetchPendingOrders = async (dbTemplate: DatabaseTemplate): Promise<PendingOrderSchedules[]> => {
    const results =  await dbTemplate.query(
        `SELECT schedule_id, profile_id, status, scheduled_date
         FROM order_schedules
         WHERE status = 'Pending' and scheduled_date <= NOW()`,
        mapPendingOrderSchedules
    );
    return results;
};

export const generateOrders = async (dbTemplate: DatabaseTemplate) => {
    try {
        const pendingOrders = await fetchPendingOrders(dbTemplate);

        for (const order of pendingOrders) {
            //TODO: Place order logic here
            await dbTemplate.execute(
                `UPDATE order_schedules SET status = 'Completed' WHERE schedule_id = $1`,
                [order.schedule_id]
            );

            await dbTemplate.execute(
                `UPDATE subscription_profiles SET last_order_date = NOW() WHERE profile_id = $1`,
                [order.profile_id]
            );
        }
        console.log('Order scheduling completed successfully.');
    } catch (error) {
        console.error('Error scheduling orders:', error);
    }
};

// Set up the cron job to run at midnight every day
const job = new CronJob('0 0 * * *', generateOrders, null, true, 'Asia/Kolkata');

job.start();