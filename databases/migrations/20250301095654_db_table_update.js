/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Rename 'subscription_profile' to 'subscription_profiles' if it exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_profile') THEN
              ALTER TABLE subscription_profile RENAME TO subscription_profiles;
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