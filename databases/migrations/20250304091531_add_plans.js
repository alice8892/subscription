/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        INSERT INTO plan_details (plan_title, frequency, frequency_duration, is_active, plan_description)
        VALUES('Daily', 'daily', 100, '1', 'Daily Subscription');
        INSERT INTO plan_details (plan_title, frequency, frequency_duration, is_active, plan_description)
        VALUES('Weekly', 'weekly', 100, '1', 'Weekly Subscription');
        INSERT INTO plan_details (plan_title, frequency, frequency_duration, is_active, plan_description)
            VALUES('Monthly', 'monthly', 100, '1', 'Monthly Subscription');
    `);
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {

}