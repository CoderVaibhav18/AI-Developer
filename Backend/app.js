import express from "express";
import morgan from "morgan";
import dbConnect from "./db/db.js";
const app = express()

dbConnect();

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app;