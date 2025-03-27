import fastify from "fastify";
import cookie from "@fastify/cookie"
import { userRoute } from "./routes/users"
import { dietsRoute } from "./routes/diets"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"

export const app = fastify()

app.register(cookie)

app.register(swagger, {
    swagger: {
        info: {
            title: "Daily Diet API",
            description: "API para gerenciar refeições e métricas de dieta",
            version: "1.0.0",
        },
    },
    mode: "dynamic"
});

app.register(swaggerUi, {
    routePrefix: "/docs",
});

app.register(userRoute, {
    prefix: "user"
})

app.register(dietsRoute, {
    prefix: "diet"
})