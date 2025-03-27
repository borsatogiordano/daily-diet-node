import fastify from "fastify";
import cookie from "@fastify/cookie"
import { userRoute } from "./routes/userRoute"

export const app = fastify()

app.register(cookie)

app.register(userRoute, {
    prefix:"user"
})