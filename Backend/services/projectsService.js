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

const adddUsersService = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  if (
    !Array.isArray(users) ||
    users.some(
      (userId) => typeof userId === !mongoose.Types.ObjectId.isValid(userId)
    )
  ) {
    throw new Error("Invalid users");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  const projects = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!projects) {
    throw new Error("Project not found");
  }

  const addUserInproject = await projectModel.findOneAndUpdate(
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

  return addUserInproject;
};

export { createProjectService, getAllProjectsServices, adddUsersService };
