/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Add column 'billing_address_id' to 'order_details' if the table exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_details') THEN
              ALTER TABLE order_details ADD COLUMN billing_address_id INT NOT NULL;
           END IF;
        
           -- Add column 'shipping_address_id' to 'order_details' if the table exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_details') THEN
              ALTER TABLE order_details ADD COLUMN shipping_address_id INT NOT NULL;
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