import { validationResult } from "express-validator";
import userModel from "../models/userModel.js";
import { createProjectService } from "../services/projectsService.js";

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

export { createProject };
