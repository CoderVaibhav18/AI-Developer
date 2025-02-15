import userModel from "../models/userModel.js";
import { userCreate, userLoginServices } from "../services/userService.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redisService.js";

const userRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userCreate(req.body);
    const token = await user.generateJWT();

    return res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await userLoginServices(req.body);

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePass(password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = await user.generateJWT();

    res.cookie("token", token);
    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getUser = (req, res) => {
  console.log(req.user);
  res.status(200).json({ user: req.user });
};

const userLogout = (req, res) => {
  try {
    
    const token = req.cookies?.token || req.headers.Authorization.split(" ")[1];

    redisClient.set(token, "logout", "EX", 60 * 60 * 24);

    res.status(200).json({ msg: "logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      message: "Error logging out user",
    });
  }
};

export { userRegister, loginController, getUser, userLogout };
