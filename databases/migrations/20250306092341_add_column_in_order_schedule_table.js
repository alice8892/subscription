/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Add column 'order_date' to 'order_schedules' if the table exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_schedules') THEN
              ALTER TABLE order_schedules ADD COLUMN IF NOT EXISTS order_date DATE;
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