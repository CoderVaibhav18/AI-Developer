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

const addUsersService = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  if (!users) {
    throw new Error("Users are required");
  }

  if (
    !Array.isArray(users) ||
    users.some((user) => typeof user === !mongoose.Types.ObjectId.isValid(user))
  ) {
    throw new Error("Invalid users");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("User ID is invalid");
  }

  const projects = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!projects) {
    throw new Error("Project not found");
  }

  const updateProjects = await projectModel.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        users: {
          $each: users,
        },
      },
    },
    {
      new: true,
    }
  );

  return updateProjects;
};

const getProjectInfo = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Project ID is invalid");
  }

  const project = await projectModel
    .findOne({
      _id: projectId,
    })
    .populate("users");
  return project;
};

const deleteProjectService = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Project ID is invalid");
  }

  const deleteProject = await projectModel.findOneAndDelete({
    _id: projectId,
  });

  return deleteProject;
};

export {
  createProjectService,
  getAllProjectsServices,
  addUsersService,
  getProjectInfo,
  deleteProjectService,
};
