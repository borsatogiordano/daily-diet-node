import { FastifyInstance } from "fastify";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { db } from "../../knexfile";
import { randomUUID } from "crypto";

export async function dietsRoute(app: FastifyInstance) {
    // Rota para criar uma refeição
    app.post(
        "/create-meal",
        {
            preHandler: [checkSessionIdExists],
            schema: {
                tags: ["Refeições"],
                summary: "Criar uma refeição",
                description: "Registra uma nova refeição para o usuário autenticado.",
                body: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Nome da refeição" },
                        description: { type: "string", description: "Descrição da refeição" },
                        isOnDiet: { type: "boolean", description: "Se a refeição está dentro da dieta" },
                        date: { type: "string", format: "date-time", description: "Data e hora da refeição" },
                    },
                    required: ["name", "description", "isOnDiet", "date"],
                },
                response: {
                    201: {
                        description: "Refeição criada com sucesso",
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            user_id: { type: "string" },
                            name: { type: "string" },
                            description: { type: "string" },
                            is_on_diet: { type: "boolean" },
                            date: { type: "number" },
                        },
                    },
                },
            },
        },
        async (request, response) => {
            const createMealBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                isOnDiet: z.boolean(),
                date: z.coerce.date(),
            });

            const { name, description, isOnDiet, date } = createMealBodySchema.parse(request.body);

            const [createdMeal] = await db("meals")
                .insert({
                    id: randomUUID(),
                    user_id: request.user?.id,
                    name,
                    description,
                    is_on_diet: isOnDiet,
                    date: date.getTime(),
                })
                .returning(["id", "user_id", "name", "description", "is_on_diet", "date"]);

            return response.status(201).send(createdMeal);
        }
    );

    // Rota para listar todas as refeições
    app.get(
        "/all",
        {
            preHandler: [checkSessionIdExists],
            schema: {
                tags: ["Refeições"],
                summary: "Listar todas as refeições",
                description: "Retorna todas as refeições do usuário autenticado.",
                response: {
                    200: {
                        description: "Lista de refeições",
                        type: "object",
                        properties: {
                            meals: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        user_id: { type: "string" },
                                        name: { type: "string" },
                                        description: { type: "string" },
                                        is_on_diet: { type: "boolean" },
                                        date: { type: "number" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        async (request, response) => {
            const user = await db("users")
                .where({ session_id: request.cookies.session_id })
                .first();

            const meals = await db("meals").select().where("user_id", user.id);

            return response.status(200).send({ meals });
        }
    );

    // Rota para visualizar uma refeição específica
    app.get(
        "/:id",
        {
            preHandler: [checkSessionIdExists],
            schema: {
                tags: ["Refeições"],
                summary: "Visualizar uma refeição",
                description: "Retorna os detalhes de uma refeição específica.",
                params: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", description: "ID da refeição" },
                    },
                },
                response: {
                    200: {
                        description: "Detalhes da refeição",
                        type: "object",
                        properties: {
                            meal: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    user_id: { type: "string" },
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    is_on_diet: { type: "boolean" },
                                    date: { type: "number" },
                                },
                            },
                        },
                    },
                },
            },
        },
        async (request, response) => {
            const checkMealsParamsSchema = z.object({
                id: z.string().uuid(),
            });

            const { id } = checkMealsParamsSchema.parse(request.params);

            const meal = await db("meals")
                .where({
                    user_id: request.user?.id,
                    id: id,
                })
                .first();

            if (!meal) {
                return response.status(404).send({
                    message: "Refeição não existe",
                });
            }

            return response.status(200).send({ meal });
        }
    );

    // Rota para editar uma refeição
    app.put(
        "/:id",
        {
            preHandler: [checkSessionIdExists],
            schema: {
                tags: ["Refeições"],
                summary: "Editar uma refeição",
                description: "Edita os dados de uma refeição específica.",
                params: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", description: "ID da refeição" },
                    },
                },
                body: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        isOnDiet: { type: "boolean" },
                        date: { type: "string", format: "date-time" },
                    },
                    required: ["name", "description", "isOnDiet", "date"],
                },
                response: {
                    200: {
                        description: "Refeição atualizada com sucesso",
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            user_id: { type: "string" },
                            name: { type: "string" },
                            description: { type: "string" },
                            is_on_diet: { type: "boolean" },
                            date: { type: "number" },
                        },
                    },
                },
            },
        },
        async (request, response) => {
            const checkIdParams = z.object({
                id: z.string().uuid(),
            });

            const { id } = checkIdParams.parse(request.params);

            const checkMealBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                isOnDiet: z.boolean(),
                date: z.coerce.date(),
            });

            const mealRequest = checkMealBodySchema.parse(request.body);

            const [updatedMeal] = await db("meals")
                .where({
                    user_id: request.user?.id,
                    id,
                })
                .update({
                    name: mealRequest.name,
                    description: mealRequest.description,
                    is_on_diet: mealRequest.isOnDiet,
                    date: mealRequest.date.getTime(),
                })
                .returning(["id", "user_id", "name", "description", "is_on_diet", "date"]);

            return response.status(200).send(updatedMeal);
        }
    );

    // Rota para excluir uma refeição
    app.delete(
        "/:id",
        {
            preHandler: [checkSessionIdExists],
            schema: {
                tags: ["Refeições"],
                summary: "Excluir uma refeição",
                description: "Exclui uma refeição específica.",
                params: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", description: "ID da refeição" },
                    },
                },
                response: {
                    200: {
                        description: "Refeição excluída com sucesso",
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        async (request, response) => {
            const checkIdParams = z.object({
                id: z.string().uuid(),
            });

            const { id } = checkIdParams.parse(request.params);

            await db("meals")
                .delete()
                .where({
                    user_id: request.user?.id,
                    id,
                });

            return response.status(200).send({
                message: "Refeição excluída com sucesso",
            });
        }
    );

    // Rota para obter o resumo das refeições
    app.get(
        "/summary",
        {
            preHandler: [checkSessionIdExists],
            schema: {
                tags: ["Refeições"],
                summary: "Resumo das refeições",
                description: "Retorna um resumo das refeições do usuário.",
                response: {
                    200: {
                        description: "Resumo das refeições",
                        type: "object",
                        properties: {
                            totalMeals: { type: "number" },
                            mealsOnDiet: { type: "number" },
                            mealsNotOnDiet: { type: "number" },
                            bestSequence: { type: "number" },
                        },
                    },
                },
            },
        },
        async (request, response) => {
            const [{ totalMeals }] = await db("meals")
                .select()
                .where({
                    user_id: request.user?.id,
                })
                .count("* as totalMeals");

            const [{ mealsOnDiet }] = await db("meals")
                .select()
                .where({
                    user_id: request.user?.id,
                    is_on_diet: true,
                })
                .count("* as mealsOnDiet");

            const [{ mealsNotOnDiet }] = await db("meals")
                .select()
                .where({
                    user_id: request.user?.id,
                    is_on_diet: false,
                })
                .count("* as mealsNotOnDiet");

            const meals = await db("meals")
                .where({ user_id: request.user?.id })
                .orderBy("date", "asc");

            let currentSequence = 0;
            let bestSequence = 0;

            for (const meal of meals) {
                if (meal.is_on_diet) {
                    currentSequence++;
                    bestSequence = Math.max(bestSequence, currentSequence);
                } else {
                    currentSequence = 0;
                }
            }

            return response.status(200).send({
                totalMeals,
                mealsOnDiet,
                mealsNotOnDiet,
                bestSequence,
            });
        }
    );
}
