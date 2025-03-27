
import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../knexfile";
import { FastifyInstance } from "fastify";


export async function checkSessionIdExists(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const sessionId = request.cookies.session_id
  
    if (!sessionId) {
      return reply.status(401).send({ error: "Tente criar outro usuário" })
    }
  
    const user = await db('users').where({ session_id: sessionId }).first()
  
    if (!user) {
      return reply.status(401).send({ error: "Tente criar outro usuário" })
    }
  
    request.user = user
  }