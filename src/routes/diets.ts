import { FastifyInstance } from "fastify";
import { date, z } from "zod"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { db } from "../../knexfile";
import { randomUUID } from "crypto";


export async function dietsRoute(app: FastifyInstance) {

    app.post(
        '/create-meal',
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const createMealBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                isOnDiet: z.boolean(),
                date: z.coerce.date(),
            })

            const { name, description, isOnDiet, date } = createMealBodySchema.parse(
                request.body,
            )

            const [createdMeal] = await db('meals').insert({
                id: crypto.randomUUID(),
                user_id: request.user?.id,
                name,
                description,
                is_on_diet: isOnDiet,
                date: date.getTime(),
            }).returning([
                "id",
                "user_id",
                "name",
                "description",
                "is_on_diet",
                "date"
            ])
            return reply.status(201).send(createdMeal)
        })

    app.get(
        "/all", {
        preHandler: [checkSessionIdExists]
    }, async (request, response) => {

        const user = await db("users")
            .where({ session_id: request.cookies.session_id })
            .first()

        const meals = await db("meals").select().where("user_id", user.id)

        return response.status(200).send({ meals })
    }
    )

    app.get("/:id",
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, response) => {

            //Validação
            const createMealsParamsSchema = z.object({
                id: z.string().uuid()
            })
            
            const { id } = createMealsParamsSchema.parse(
                request.params
            )

            const user = await db("users").where({ session_id: request.cookies.session_id }).first()

            if (!user) {
                return response.status(401).send({ error: "Unauthorized" });
            }

            const meal = await db("meals")
            .where({ user_id: request.user?.id, //Busca o usuário
                id: id}) //Busca a refeição
            .first()

            return response.status(200).send({
                meal
            })
        }
    )
}
