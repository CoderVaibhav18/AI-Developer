import express from "express";
import morgan from "morgan";
import dbConnection from "./db/db.js";
import userRoutes from './routes/userRoute.js';
const app = express();

dbConnection();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRoutes);

export default app;
