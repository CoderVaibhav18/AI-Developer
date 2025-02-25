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

const addUsersToProjectService = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("project id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project id");
  }

  if (!users) {
    throw new Error("project id is required");
  }

  if (
    !Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId(s) in users array");
  }

  if (!userId) {
    throw new Error("project id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id");
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
        $users: {
          $each: users,
        },
      },
    },
    { new: true }
  );

  return updateProjects;
};

export {
  createProjectService,
  getAllProjectsServices,
  addUsersToProjectService,
};
