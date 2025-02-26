import { validationResult } from "express-validator";
import userModel from "../models/userModel.js";
import {
  addUsersService,
  createProjectService,
  getAllProjectsServices,
  getProjectInfo,
} from "../services/projectsService.js";

const createProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;

    const newProject = await createProjectService({ name, userId });
    return res.status(201).json({ newProject });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ msg: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const email = req.user.email;
    const loggedInUser = await userModel.findOne({ email });

    const userId = loggedInUser._id;

    const allProjects = await getAllProjectsServices({ userId });

    return res.status(200).json({ projects: allProjects });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ msg: err.message });
  }
};

const addUsersToProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body;

    const loggedInUser = await userModel.findOne({ email: req.user.email });

    const projects = await addUsersService({
      projectId,
      users,
      userId: loggedInUser._id,
    });

    return res.status(200).json({ projects });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ err: err.message });
  }
};

const getProjectbyId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const projects = await getProjectInfo({ projectId });
    return res.status(200).json({ projects });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ err: err.message });
  }
};

export { createProject, getAllProjects, addUsersToProject, getProjectbyId };
