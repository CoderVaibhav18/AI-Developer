import "dotenv/config"
import app from "./app.js";
import http from "http"
const PORT = process.env.PORT || 7889;

const server = http.createServer(app)

server.listen(PORT, () => console.log(`Server running at port: ${PORT}`))