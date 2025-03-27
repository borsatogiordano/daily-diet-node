import { app } from "./app"

const port = 8080
app.listen({
    port
}).then(() => {
    console.log("Server Up on", port);
});