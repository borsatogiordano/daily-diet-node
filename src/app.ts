import fastify from "fastify";
import cookie from "@fastify/cookie"
import { userRoute } from "./routes/users"
import { dietsRoute } from "./routes/diets"

export const app = fastify()

app.register(cookie)

app.register(userRoute, {
    prefix: "user"
})

app.register(dietsRoute, {
    prefix: "diet"
})