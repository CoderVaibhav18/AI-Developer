import { Router } from "express";
import { body } from "express-validator";
import { authUser } from "../middlewares/authUser.js";
import {
  createProject,
  getAllProjects,
  addUsersToProject,
} from "../controllers/projectController.js";

const router = Router();

router.post(
  "/create",
  body("name").isString().withMessage("name is requird"),
  authUser,
  createProject
);

router.get("/allprojects", authUser, getAllProjects);

router.put(
  "/addusers",
  body("projectId").isString().withMessage("projects id must be a string"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("users must be an array of string")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("each user must be a string"),
  authUser,
  addUsersToProject
);

export default router;
