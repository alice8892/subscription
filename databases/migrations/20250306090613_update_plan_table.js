/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        DO $$
        BEGIN
           -- Check if the table 'plans' exists
           IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plans') THEN
              -- Check if the column 'plan_code' does not exist and add it
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'plan_code') THEN
                 ALTER TABLE plans ADD COLUMN plan_code VARCHAR(255);
              END IF;
        
              -- Update the 'plan_code' column with the lowercase values of 'plan_title'
              UPDATE plans SET plan_code = LOWER(plan_title);
        
              -- Set the 'plan_code' column to NOT NULL if it exists
              IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'plan_code') THEN
                 ALTER TABLE plans ALTER COLUMN plan_code SET NOT NULL;
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