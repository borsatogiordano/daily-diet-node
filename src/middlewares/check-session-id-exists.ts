
import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionIdExists(
    request: FastifyRequest,
    response: FastifyReply
) {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
        return response.status(401).send({
            error: "Você só pode editar/criar sendo um um usuário cadastrado"
        })
    }
}