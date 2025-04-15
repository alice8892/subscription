/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Rename column 'subscription_profile_id' to 'profile_id' in 'subscription_profiles' if it exists
           IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscription_profiles' AND column_name = 'subscription_profile_id') THEN
              ALTER TABLE subscription_profiles RENAME COLUMN subscription_profile_id TO profile_id;
           END IF;
        
           -- Drop column 'profile_id' from 'orders' if it exists
           IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'profile_id') THEN
              ALTER TABLE orders DROP COLUMN profile_id;
           END IF;
        
           -- Drop column 'subscription_profile_id' from 'orders' if it exists
           IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subscription_profile_id') THEN
              ALTER TABLE orders DROP COLUMN subscription_profile_id;
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