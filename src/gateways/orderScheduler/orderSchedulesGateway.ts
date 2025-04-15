import {DatabaseTemplate} from "../../databaseSupport/databaseTemplate";

export type OrderSchedule = {
    schedule_id: number
    profile_id: number
    status: string
    scheduled_date: Date
    order_date: Date
    created_at: Date
    updated_at: Date
}

export type OrderSchedulesGateway = {
    create: (profile_id: number, status: 'Pending' | 'Scheduled' | 'Completed', scheduled_date: Date) => Promise<OrderSchedule>
    getPendingSchedules: () => Promise<OrderSchedule[]>
    getById: (schedule_id: number) => Promise<OrderSchedule>
    list: () => Promise<OrderSchedule[]>
    deleteAll: () => Promise<void>
    update: (schedule_id: number, status: string, order_date: Date) => Promise<OrderSchedule>
    checkIfOrderScheduleExists: (profile_id: number, scheduled_date: Date) => Promise<OrderSchedule[]>
}

const mapOrderSchedule = (row: any): OrderSchedule => ({
    schedule_id: row["schedule_id"],
    profile_id: row["profile_id"],
    status: row["status"],
    scheduled_date: row["scheduled_date"],
    order_date: row["order_date"],
    created_at: row["created_at"],
    updated_at: row["updated_at"],
});

const create = (dbTemplate: DatabaseTemplate): OrderSchedulesGateway => ({
    create: async (profile_id: number, status: string, scheduled_date: Date): Promise<OrderSchedule> =>
        dbTemplate.queryOne(
            "INSERT INTO order_schedules (profile_id, status, scheduled_date) VALUES ($1, $2, $3) RETURNING schedule_id, profile_id, status, scheduled_date, order_date, created_at, updated_at",
            mapOrderSchedule,
            profile_id, status, scheduled_date
        ),
    getById: async (schedule_id): Promise<OrderSchedule> =>
        dbTemplate.queryOne(
            "select * from order_schedules where schedule_id = $1",
            mapOrderSchedule,
            schedule_id
        ),
    getPendingSchedules: async (): Promise<OrderSchedule[]> =>
        dbTemplate.query(
            "select * from order_schedules where scheduled_date = $1 and status = $2 order by scheduled_date",
            mapOrderSchedule,
            new Date(), 'Pending'
        ),
    list: async (): Promise<OrderSchedule[]> =>
        dbTemplate.query(
            "select * from order_schedules order by schedule_id desc",
            mapOrderSchedule
        ),
    update: async (schedule_id, status, order_date): Promise<OrderSchedule> =>
        dbTemplate.queryOne(
            "UPDATE order_schedules SET status = $2, order_date = $3 WHERE schedule_id = $1 RETURNING schedule_id, profile_id, status, scheduled_date, order_date, created_at, updated_at",
            mapOrderSchedule,
            schedule_id, status, order_date
        ),
    checkIfOrderScheduleExists: async (profile_id, scheduled_date): Promise<OrderSchedule[]> =>
         dbTemplate.query(
            "SELECT * from order_schedules WHERE profile_id = $1 and scheduled_date = $2",
            mapOrderSchedule,
            profile_id, scheduled_date
        ),
    deleteAll: async (): Promise<void> =>
        dbTemplate.execute(
            "truncate table order_schedules cascade"
        ),
});

export const orderSchedulesGateway = {
    create,
};
