import {DatabaseTemplate} from "../databaseSupport/databaseTemplate";

export type Plans = {
    plan_id: number,
    plan_code: string,
    plan_title: string,
    frequency: string,
    frequency_duration: number,
    is_active: boolean,
    plan_description: string,
    created_at: Date,
    updated_at: Date,
};

export type PlansGateway = {
    create: (plan_code: string, plan_title: string, frequency: string, frequency_duration: number, is_active: boolean, plan_description: string) => Promise<Plans>;
    list: () => Promise<Plans[]>;
    listActive: () => Promise<Plans[]>;
    findById: (plan_id: number) => Promise<Plans | null>;
    findDuplicate: (frequency: string, frequency_duration: number) => Promise<Plans | null>;
    update: (plan_id: number, plan_code: string, plan_title: string, frequency: string, frequency_duration: number, is_active: boolean, plan_description: string) => Promise<Plans | null>;
}

const mapPlans = (row: any): Plans => ({
    plan_id: row['plan_id'],
    plan_code: row['plan_code'],
    plan_title: row['plan_title'],
    frequency: row['frequency'],
    frequency_duration: row['frequency_duration'],
    is_active: row['is_active'],
    plan_description: row['plan_description'],
    created_at: new Date(row['created_at']),
    updated_at: new Date(row['updated_at']),
});

const create = (dbTemplate: DatabaseTemplate): PlansGateway => ({
   create: async (plan_code: string, plan_title: string, frequency: string, frequency_duration: number, is_active: boolean, plan_description: string): Promise<Plans> =>
       dbTemplate.queryOne(
           "insert into plans (plan_code, plan_title, frequency, frequency_duration, is_active, plan_description) values ($1, $2, $3, $4, $5, $6) returning plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description, created_at, updated_at",
           mapPlans,
           plan_code, plan_title, frequency, frequency_duration, is_active, plan_description
       ),
    list: async (): Promise<Plans[]> =>
        dbTemplate.query(
            "select plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description, created_at, updated_at from plans order by created_at desc;",
            mapPlans
        ),
    listActive: async (): Promise<Plans[]> =>
        dbTemplate.query(
            "select plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description, created_at, updated_at from plans where is_active = true order by plan_id asc;",
            mapPlans
        ),
    findById: async (plan_id: number): Promise<Plans | null> =>
        dbTemplate.queryOne(
            "select plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description, created_at, updated_at from plans where plan_id = $1",
            row => row == undefined ? null : mapPlans(row),
            plan_id
        ),
    findDuplicate: async (frequency: string, frequency_duration: number): Promise<Plans | null> =>
        dbTemplate.queryOne(
            "select plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description, created_at, updated_at from plans where frequency = $1 and frequency_duration = $2",
            row => row == undefined ? null : mapPlans(row),
            frequency, frequency_duration
        ),
    update: async (plan_id: number, plan_code: string, plan_title: string, frequency: string, frequency_duration: number, is_active: boolean, plan_description: string): Promise<Plans | null> =>
        dbTemplate.queryOne(
            "update plans set plan_code = $2, plan_title = $3, frequency = $4, frequency_duration = $5, is_active = $6, plan_description = $7, updated_at = now() where plan_id = $1 returning plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description, created_at, updated_at",
            row => row == undefined ? null : mapPlans(row),
            plan_id, plan_code, plan_title, frequency, frequency_duration, is_active, plan_description,
        )
});

export const plansGateway = {
    create,
}
