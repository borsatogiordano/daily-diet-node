import { FastifyInstance } from "fastify";
import { z } from "zod"
import path from "path";
import { db } from "../../knexfile"





export async function userRoute(app: FastifyInstance) {



    app.post("/", async (request, response) => {

        //Validation
        const createUserSchema = z.object({
            user: z.string()
        })

        const { user } = createUserSchema.parse(
            request.body
        )

        let sessionId = crypto.randomUUID()

        response.cookie("session_id", sessionId, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 7 days,    
        });

        const [createdUser] = await db("users")
            .insert({
                id: crypto.randomUUID(),
                user,
                session_id: sessionId,
            })
            .returning(["id", "user", "session_id"]);

        return response.status(201).send(createdUser);
    })
} 