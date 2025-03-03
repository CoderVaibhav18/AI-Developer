import "dotenv/config"
import app from "./app.js";
import http from "http"
import { Server } from "socket.io";
const PORT = process.env.PORT || 7889;

const server = http.createServer(app)

const io = new Server(server);

io.on('connection', socket => {
  console.log('a new client connected')
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});

server.listen(PORT, () => console.log(`Server running at port: http://localhost:${PORT}`))