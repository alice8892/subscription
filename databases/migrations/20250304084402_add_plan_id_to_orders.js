/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Add column 'plan_id' to 'order_details' if the table exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_details') THEN
              ALTER TABLE order_details ADD COLUMN plan_id INT;
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