import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import http from 'http';
const PORT = process.env.PORT || 8899;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})