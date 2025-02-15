import express from "express";
import {
  getUser,
  loginController,
  userLogout,
  userRegister,
} from "../controllers/userController.js";
import { body } from "express-validator";
import { authUser } from "../middlewares/authUser.js";
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

routes.get("/profile", authUser, getUser);

routes.post('/logout', authUser, userLogout)

export default routes;
