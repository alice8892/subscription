/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Drop column 'profile_id' from 'order_details' if the table and column exist
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_details') THEN
              IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_details' AND column_name = 'profile_id') THEN
                 ALTER TABLE order_details DROP COLUMN profile_id;
              END IF;
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