import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("meals", table => {
        table.uuid("id").primary(),
        table.uuid("user_id").references("users.id").onDelete("CASCADE"),
        table.string("name").notNullable,
        table.string("description").notNullable,
        table.date("date").notNullable(),
        table.boolean("is_on_diet").notNullable
    }) 
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("meals")
}