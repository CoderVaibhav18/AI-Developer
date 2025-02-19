import express from "express";
import morgan from "morgan";
import dbConnection from "./db/db.js";
import userRoutes from "./routes/userRoute.js";
// import projectRoute from "./routes/projectRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

dbConnection();

app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRoutes);

// app.use("/project", projectRoute);

export default app;
