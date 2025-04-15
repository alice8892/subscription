import {DatabaseTemplate, databaseTemplate} from "../databaseSupport/databaseTemplate";
import {Client} from "pg";

export type TestDatabaseTemplate = DatabaseTemplate & {
    clear: () => Promise<void>
    queryAny: (sql: string, ...args: any[]) => Promise<any[]>
}

export const databaseUrl = (databaseName: string) => `postgresql://localhost:5432/${databaseName}?user=capstone_starter&password=capstone_starter`;

export const testPostgresUrl = databaseUrl("capstone_starter_test");
export const testDbTemplate = async (name: string): Promise<TestDatabaseTemplate> => {
    const testDatabaseName = `capstone_starter_test_${name.toLowerCase()}`;

    const superClient = new Client({connectionString: databaseUrl("postgres")});
    await superClient.connect();
    await superClient.query(`drop database if exists ${testDatabaseName}`);
    await superClient.query(`create database ${testDatabaseName} template capstone_starter_test`);
    await superClient.end();

    const template = databaseTemplate.create(databaseUrl(testDatabaseName));

    return {
        ...template,
        clear: async () => {

            await template.execute(`
                truncate customers cascade;
                truncate customers_address;
                truncate plans cascade;
                truncate subscription_profiles cascade;
                truncate orders cascade;
                truncate order_schedules;
            `);
        },
        queryAny: async (sql: string, ...args: any[]): Promise<any[]> => template.query(
            sql,
            result => result,
            ...args,
        ),
    };
};
