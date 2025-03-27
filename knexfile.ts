import{ Knex, knex as setupKnex } from "knex"

const config: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: "./src/db/app.db",
    },
    migrations: {
        extension:"ts",
        directory: "./src/db/migrations"
    }
}

export default config;

export const db = setupKnex(config)