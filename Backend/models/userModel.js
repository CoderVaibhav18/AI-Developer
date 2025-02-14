import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: [6, "Email should be atleast 6 characters"],
    maxLength: [50, "Email shoult be atmost 50 characters"],
  },
  password: {
    type: String,
    required: true,
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

const userModel = new mongoose.model("user", userSchema);
export default userModel;