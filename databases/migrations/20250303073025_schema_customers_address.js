/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        CREATE TABLE customers_address
        (
            address_id         SERIAL PRIMARY KEY,
            customer_id        INT NOT NULL,
            first_name         VARCHAR(255) NOT NULL,
            last_name          VARCHAR(255) NOT NULL,
            street_1           VARCHAR(255) NOT NULL,
            street_2           VARCHAR(255) NULL,
            post_code          VARCHAR(255) NOT NULL,
            city               VARCHAR(255) NOT NULL,
            state              VARCHAR(255) NOT NULL,
            country            VARCHAR(255) NOT NULL,
            phone_number       VARCHAR(255) NOT NULL,
            default_billing    BOOLEAN DEFAULT FALSE,
            default_shipping   BOOLEAN DEFAULT FALSE,
            created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES customer_details (customer_id)
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