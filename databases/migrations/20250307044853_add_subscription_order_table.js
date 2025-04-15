/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE subscription_profile_orders
        (
            id            SERIAL PRIMARY KEY,
            profile_id         INT NOT NULL,
            order_id          INT NOT NULL
        );
    ALTER TABLE subscription_profiles
        ADD COLUMN order_details JSON;
  `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
