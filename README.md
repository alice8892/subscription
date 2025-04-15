# Glossary
1. Purchaser - A person who buys places an order for a product.
2. Admin - Manage Tenants, Plans, Subscriptions
3. Tenant - A company/application that uses "Subscription as a Service" application to manage their subscriptions
5. Subscription Profile - A profile that contains the details of a subscription purchased by purchaser.
6. Subscription Plan - A plan that contains the details of a frequency and duration for a subscription.

# Capstone Starter

A starter application for data collection applications built with [Express](https://expressjs.com/), [node-postgres](https://node-postgres.com/),
and [Knex](https://knexjs.org/).

## Technology stack

This codebase is written in [TypeScript](https://www.typescriptlang.org/) and runs on
Azure's [Container Apps](https://azure.microsoft.com/en-us/products/container-apps) and
[Container App Jobs](https://learn.microsoft.com/en-us/azure/container-apps/jobs?tabs=azure-cli).
It uses the [Express](https://expressjs.com/) web framework and [Handlebars](https://handlebarsjs.com/) templates. It
stores data in [Postgres](https://www.postgresql.org/). Tests are run
with [GitHub Actions](https://github.com/features/actions).

The [devcontainer.json](./.devcontainer/devcontainer.json) file configures an environment for local development in
a [Development Container](https://containers.dev/).

## Structure

### Entry points

The Capstone Starter consists of three free-running processes communicating with one Postgres database.

1. A _data collector_ that is meant to fetch data from an external source.
   The data collector is run from [collect.ts](./src/collect.ts) using the `npm run collect` command.
   The collector simply prints a _TODO_ message when it runs.

1. A _data analyzer_ that is meant to fetch data from an external source.
   The data analyzer is run from [analyze.ts](./src/analyze.ts) using the `npm run analyze` command.
   The analyzer simply prints a _TODO_ message when it runs.

1. An Express web application end users will access to interact with data.
   The web application is run from [app.ts](./src/app.ts) using the `npm run start`
   command.
   It has an index endpoint at `/` that displays a simple message on an HTML page, and a health endpoint at `/health`
   that indicates the health of the app and its connection to the Postgres database.

### Data

The app integrates with a PostgreSQL database, using [node-postgres](https://node-postgres.com/) to manage the database
connection and [Knex](https://knexjs.org/) to manage schema migrations.
The `POSTGRES_URL` environment variable provides the connection's database URL.
Schema migrations are generated with Knex's `migrate:make` command

```shell
npx knex migrate:make $MIGRATION_DESCRIPTION --knexfile databases/knexfile.js
```

and are read from the [databases/migrations](./databases/migrations) directory.
Use Knex's `migrate:latest` command to run migrations on the local development database.

```shell
npx knex migrate:latest --knexfile databases/knexfile.js
```

To run migrations on another database (the local test database, for example), set the `POSTGRES_URL` before invoking the
`upgrade` command.

```shell
POSTGRES_URL="postgresql://localhost:5432/capstone_starter_test?user=capstone_starter&password=capstone_starter" \
  npx knex migrate:latest --knexfile databases/knexfile.js
```

### Development Container

The [.devcontainer](./.devcontainer) directory configures a [development container](https://containers.dev/) for local
development.
It creates and runs the containers described in the [Docker Compose file](./.devcontainer/docker-compose.yml), then runs
the [setup script](./.devcontainer/set-up-environment.sh) to install node dependencies and to create and migrate the
local development and test databases.

### Tests

Each file ending with _.test.ts_ is a test file, built and run with [Vitest](https://vitest.dev/).
Tests are run on [GitHub Actions](https://docs.github.com/en/actions) (configured by [test.yml](./.github/workflows/test.yml)).
Tests run in the same dev container used to develop the application using the [devcontainers/ci action](https://github.com/devcontainers/ci).

## Local development

1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop/).
1. Install and open [IntelliJ](https://www.jetbrains.com/idea/).
1.  [Clone the template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)
    and create a repository in the _BTS-ABT_ organization with the format _ts-academy-**team project name**-capstone_.
1. In the IntelliJ menu, choose _File > Remote Development > Dev Containers > New Dev Containers > From VCS Project_,
   then enter your repository's SSH URL.
1. Once your dev container is running, open a terminal in IntelliJ (Alt/Option + F12) and run tests

   ```shell
   npm run test
   ```

1. Run the collector and the analyzer to populate the database, then run the app and navigate to
   [localhost:3000](http://localhost:3000).

   ```shell
   npm run build
   npm run collect
   npm run analyze
   npm run start
   ```
