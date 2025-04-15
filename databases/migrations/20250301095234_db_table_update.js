/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Rename 'customer_table' to 'customer_details' if it exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customer_table') THEN
              ALTER TABLE customer_table RENAME TO customer_details;
           END IF;
        
           -- Rename 'plan' to 'plan_details' if it exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plan') THEN
              ALTER TABLE plan RENAME TO plan_details;
           END IF;
        
           -- Rename 'order_table' to 'order_details' if it exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_table') THEN
              ALTER TABLE order_table RENAME TO order_details;
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