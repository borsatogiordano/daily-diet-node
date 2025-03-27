import { FastifyInstance } from "fastify";
import { date, z } from "zod"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { db } from "../../knexfile";


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
}
