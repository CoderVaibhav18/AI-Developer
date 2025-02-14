import express from "express";
import { loginController, userRegister } from "../controllers/userController.js";
import { body } from "express-validator";
const routes = express.Router();

routes.post(
  "/register",
  body("email").isEmail().withMessage("Email must be valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 character long"),
  userRegister
);
routes.post(
  "/login",
  body("email").isEmail().withMessage("Email must be valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 character long"),
    loginController
);

export default routes;
