module.exports = {
    client: "postgresql",
    connection: () => ({
        connectionString: process.env.POSTGRES_URL
    }),
    migrations: {
        directory: "migrations",
        tableName: "knex_migrations"
    }
};
