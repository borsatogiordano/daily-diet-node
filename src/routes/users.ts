import { FastifyInstance } from "fastify";
import { z } from "zod"
import path from "path";
import { db } from "../../knexfile"

export async function userRoute(app: FastifyInstance) {

    app.post("/create", {
        schema: {
            tags: ["Usuários"],
            summary: "Criar um usuário",
            description: "Cria um novo usuário e retorna os dados do usuário criado.",
            body: {
                type: "object",
                properties: {
                    user: { type: "string", description: "Nome do usuário" },
                },
                required: ["user"],
            },
            response: {
                201: {
                    description: "Usuário criado com sucesso",
                    type: "object",
                    properties: {
                        id: { type: "string", description: "ID do usuário" },
                        user: { type: "string", description: "Nome do usuário" },
                        session_id: { type: "string", description: "ID da sessão do usuário" },
                    },
                },
            },
        },
    },
        async (request, response) => {

            const createUserSchema = z.object({
                user: z.string()
            })

            const { user } = createUserSchema.parse(
                request.body
            )

            //Gerando/Validando Cookie
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