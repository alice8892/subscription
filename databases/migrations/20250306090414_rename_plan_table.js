/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Rename 'plan_details' to 'plans' if it exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plan_details') THEN
              ALTER TABLE plan_details RENAME TO plans;
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