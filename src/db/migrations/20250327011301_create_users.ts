import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary(),
        table.uuid("session_id"),
        table.text("user").notNullable().unique()
        });
    
    }
    
    export async function down(knex: Knex): Promise<void> {
        await knex.schema.dropTable("users");
    }