import { FastifyInstance } from "fastify";
import { z } from "zod"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { db } from "../../knexfile";


export async function dietsRoute(app: FastifyInstance) {

    app.post("/create-meal", {
        preHandler:[checkSessionIdExists]
    },async (request,response) => {

        // Validação
        const createMealSchema = z.object({
            name: z.string(),
            description: z.string(),
            dateTime: z.coerce.date(),
            isOnDiet: z.boolean()
        })

        const { name, description, dateTime, isOnDiet } = createMealSchema.parse(
            request.body
        )

        const sessionId = request.cookies.session_id

        const user = await db("users").where("session_id", sessionId).first();

        if (!user) {
            return response.status()
        }

        await db.insert("meals").insert({
            id:crypto.randomUUID(),
            user_id: user,
            name,
            description,
            dateTime,
            isOnDiet
        })
    })
}
