import projectModel from "../models/projectModel.js";

const createProjectService = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Project name is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const project = await projectModel.create({ name: name, users: [userId] });

  return project;
};

export { createProjectService };
