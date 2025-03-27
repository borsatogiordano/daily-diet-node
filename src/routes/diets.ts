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
            const checkMealsParamsSchema = z.object({
                id: z.string().uuid()
            })

            const { id } = checkMealsParamsSchema.parse(
                request.params
            )

            const user = await db("users").where({ session_id: request.cookies.session_id }).first()

            if (!user) {
                return response.status(401).send({ error: "Unauthorized" });
            }

            const meal = await db("meals")
                .where({
                    user_id: request.user?.id, //Busca o usuário
                    id: id
                }) //Busca a refeição
                .first()

            if (!meal) {
                return response.status(404).send({
                    message: "Refeição não existe"
                })
            }
            return response.status(200).send({
                meal
            })
        }
    )

    app.put("/:id", {
        preHandler: [checkSessionIdExists]
    }, async (request, response) => {

        const checkIdParams = z.object({
            id: z.string().uuid()
        })

        const { id } = checkIdParams.parse(
            request.params
        )

        const checkMealBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            isOnDiet: z.boolean(),
            date: z.coerce.date(),
        })

        const mealRequest = checkMealBodySchema.parse(
            request.body
        )

        const [updatedMeal] = await db("meals")
            .where({
                user_id: request.user?.id,
                id
            })
            .update({
                name: mealRequest.name,
                description: mealRequest.description,
                is_on_diet: mealRequest.isOnDiet,
                date: mealRequest.date.getTime()
            }).returning([
                "id",
                "user_id",
                "name",
                "description",
                "is_on_diet",
                "date"
            ])

        return response.status(200).send(updatedMeal)
    }
    )

    app.delete("/:id", {
        preHandler: [checkSessionIdExists]
    },
        async (request, response) => {

            const checkIdParams = z.object({
                id: z.string().uuid()
            })

            const { id } = checkIdParams.parse(
                request.params
            )

            await db("meals")
                .delete()
                .where({
                    user_id: request.user?.id,
                    id
                })

            return response.status(200).send({
                message: "Refeição excluída com sucesso"
            })
        })

    app.get("/summary", {
        preHandler: [checkSessionIdExists]
    },
        async (request, response) => {

            const [{ totalMeals }] = await db("meals")
                .select().where({
                    user_id: request.user?.id,
                }).count("* as totalMeals")

            const [{ mealsOnDiet }] = await db("meals")
                .select().where({
                    user_id: request.user?.id,
                    is_on_diet: true
                }).count("* as mealsOnDiet")

            const [{ mealsNotOnDiet }] = await db("meals")
                .select().where({
                    user_id: request.user?.id,
                    is_on_diet: false
                }).count("* as mealsNotOnDiet")

            return response.status(200).send({
                totalMeals,
                mealsOnDiet,
                mealsNotOnDiet
            })
        })
}
