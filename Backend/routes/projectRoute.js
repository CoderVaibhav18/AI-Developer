import { Router } from "express";
import { body } from "express-validator";
import { authUser } from "../middlewares/authUser.js";
import { createProject, getAllProjects } from "../controllers/projectController.js";

const router = Router();

router.post(
  "/create",
  body("name").isString().withMessage("name is requird"),
  authUser,
  createProject
);

router.get('/allprojects', authUser, getAllProjects)

export default router;
