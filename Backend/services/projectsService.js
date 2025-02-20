import projectModel from "../models/projectModel.js";

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

export { createProjectService };
