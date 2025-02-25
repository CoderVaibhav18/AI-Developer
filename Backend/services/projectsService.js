import mongoose from "mongoose";
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

const getAllProjectsServices = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const allProjects = await projectModel.find({ users: userId });
  return allProjects;
};

export { createProjectService, getAllProjectsServices };
