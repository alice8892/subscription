/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.raw(`
        CREATE TABLE plan
        (
            plan_id            SERIAL PRIMARY KEY,
            plan_title         VARCHAR(255) NOT NULL,
            frequency          VARCHAR(255) NOT NULL,
            frequency_duration INT          NOT NULL,
            is_active          BOOLEAN   DEFAULT TRUE,
            plan_description   VARCHAR(255),
            created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE subscription_profile
        (
            subscription_profile_id SERIAL PRIMARY KEY,
            customer_id             INT         NOT NULL,
            plan_id                 INT         NOT NULL,
            status                  VARCHAR(50) NOT NULL,
            planned_start_date      DATE      DEFAULT NULL,
            planned_end_date        DATE      DEFAULT NULL,
            created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (plan_id) REFERENCES plan (plan_id)
        );

        CREATE TABLE order_schedules
        (
            schedule_id             SERIAL PRIMARY KEY,
            subscription_profile_id INT         NOT NULL,
            status                  VARCHAR(50) NOT NULL, -- e.g., pending, processed, cancelled
            planned_order_date      DATE        DEFAULT NULL,
            created_order_date      DATE    DEFAULT NULL,
            created_at              TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
            updated_at              TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subscription_profile_id) REFERENCES subscription_profile (subscription_profile_id)
        );

        CREATE TABLE order_table
        (
            order_id                SERIAL PRIMARY KEY,
            subscription_profile_id INT            NOT NULL,
            customer_id             INT            NOT NULL,
            sku                     VARCHAR(50)    NOT NULL,
            qty                     INT            NOT NULL,
            order_status            VARCHAR(50)    NOT NULL, -- e.g., pending, completed, cancelled
            order_date              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            total_amount            DECIMAL(10, 2) NOT NULL,
            created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subscription_profile_id) REFERENCES subscription_profile (subscription_profile_id)
        );
    `);
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    return knex.raw(`
        DROP TABLE plan,
        DROP TABLE subscription_profile,
        DROP TABLE order_schedules,
        DROP TABLE order_table
    `);
}