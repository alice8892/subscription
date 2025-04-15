/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Add column 'last_order_date' to 'subscription_profiles' if the table exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_profiles') THEN
              ALTER TABLE subscription_profiles ADD COLUMN last_order_date DATE NULL;
           END IF;
        END $$;
    `);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    throw new Error("Always move forward!!");
};
