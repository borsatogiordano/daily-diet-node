import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("meals", table => {
        table.uuid("id").primary(),
        table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE"),
        table.string("name"),
        table.string("description"),
        table.dateTime("date_time"),
        table.boolean("is_on_diet")
    }) 
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("meals")
}

