/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        CREATE TABLE customer_table
        (
            customer_id        SERIAL PRIMARY KEY,
            first_name         VARCHAR(255) NOT NULL,
            last_name          VARCHAR(255) NOT NULL,
            email              VARCHAR(255) NOT NULL,
            phonenumber        VARCHAR(255) NOT NULL,
            is_active          BOOLEAN DEFAULT TRUE,
            created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    return knex.raw(`
        DROP TABLE customer_table
    `);
}