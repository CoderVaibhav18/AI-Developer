import mongoose from "mongoose";

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err));
};
export default dbConnect;