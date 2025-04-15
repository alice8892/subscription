/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Rename column 'subscription_profile_id' to 'profile_id' in 'order_schedules' if it exists
           IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_schedules' AND column_name = 'subscription_profile_id') THEN
              ALTER TABLE order_schedules RENAME COLUMN subscription_profile_id TO profile_id;
           END IF;
        END $$;
    `);
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {

}