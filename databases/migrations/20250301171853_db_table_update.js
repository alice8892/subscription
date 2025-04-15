/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Rename column 'phonenumber' to 'phone_number' in 'customer_details' if it exists
           IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customer_details' AND column_name = 'phonenumber') THEN
              ALTER TABLE customer_details RENAME COLUMN phonenumber TO phone_number;
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