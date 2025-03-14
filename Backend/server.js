import "dotenv/config";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/projectModel.js";
import { generateResult } from "./services/geminiService.js";
const PORT = process.env.PORT || 7889;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid Project Id"));
    }

    socket.project = await projectModel.findById(projectId);

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Unauthorized"));
    }

    socket.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("a new client connected");

  console.log(socket.roomId);
  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    const message = data.message;

    const aiIsPresentInMessage = message.includes("@ai");
    socket.broadcast.to(socket.roomId).emit("project-message", data);
    if (aiIsPresentInMessage) {
      const prompt = message.replace("@ai", "");
      const result = await generateResult(prompt);

      io.to(socket.roomId).emit("project-message", {
        message: result,
        sender: {
          _id: "ai",
          email: "AI",
        },
      });

      return;
    }
  });

  socket.on("event", (data) => {
    /* … */
  });
  socket.on("disconnect", () => {
    console.log("a client disconnected");
    socket.leave(socket.roomId);
  });
});

server.listen(PORT, () =>
  console.log(`Server running at port: http://localhost:${PORT}`)
);
