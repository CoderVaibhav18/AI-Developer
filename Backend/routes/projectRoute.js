import { Router } from "express";
import { body } from "express-validator";
import { authUser } from "../middlewares/authUser.js";
import {
  createProject,
  getAllProjects,
  addUsersToProject,
  getProjectbyId,
  deleteProject,
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
  body("projectId").isString().withMessage("project id is must be an string"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an arrayy")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("Every user must be an string"),
  authUser,
  addUsersToProject
);

router.get("/getprojects/:projectId", authUser, getProjectbyId);

router.delete(
  "/deleteproject",
  body("projectId").isString().withMessage("Project id must be string"),
  authUser,
  deleteProject
);

export default router;
