import fastify from "fastify";
import cookie from "fastify"
import { userRoute } from "./routes/userRoute"

export const app = fastify()

app.register(cookie)

app.register(userRoute, {
    prefix:"user"
})