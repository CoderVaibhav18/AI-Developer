import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: [6, "Eail should be at least 6 character long"],
    maxLength: [50, "Email should be at most 50 character long"],
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
});

userSchema.statics.hashPass = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePass = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET);
};

const user = mongoose.model("user", userSchema);
export default user;
