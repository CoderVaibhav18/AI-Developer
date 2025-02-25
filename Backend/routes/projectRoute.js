import { Router } from "express";
import { body } from "express-validator";
import { authUser } from "../middlewares/authUser.js";
import {
  addUsersToProject,
  createProject,
  getAllProjects,
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
  body("projectId").isString().withMessage("Project Id is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("users most be an array")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("each user must be an string"),
  authUser,
  addUsersToProject
);

export default router;
