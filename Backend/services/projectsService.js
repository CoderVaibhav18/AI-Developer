import projectModel from "../models/projectModel.js";
import userModel from "../models/userModel.js";

const createProjectService = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Project name is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  let project;
  try {
    project = await projectModel.create({ name: name, users: [userId] });
  } catch (error) {
    throw new Error("Failed to create project");
  }

  return project;
};

const allUserProjects = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const getAllprojects = await projectModel.findOne({ users: userId });
  return getAllprojects;
};

export { createProjectService, allUserProjects };
