/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Add column 'start_date' to 'subscription_profiles' if the table exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_profiles') THEN
              ALTER TABLE subscription_profiles ADD COLUMN IF NOT EXISTS start_date DATE;
           END IF;
        
           -- Add column 'end_date' to 'subscription_profiles' if the table exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_profiles') THEN
              ALTER TABLE subscription_profiles ADD COLUMN IF NOT EXISTS end_date DATE;
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