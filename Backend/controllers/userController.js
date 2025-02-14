import userModel from "../models/userModel.js";
import { userCreate } from "../services/userService.js";
import {  validationResult } from "express-validator";

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

export { userRegister };
