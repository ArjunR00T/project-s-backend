// services/user.service.js
import UserModel from "../models/user-model.js";
import logger from "../utils/logger.js";

export const createUser = async ({ name, email, firebaseId }) => {
  try {
    logger.info("Creating new user in DB");
    const user = await UserModel.create({ name, email, firebaseId });
    logger.info(`User created successfully: ${user._id}`);
    return user;
  } catch (error) {
    logger.error("Failed to create user", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    logger.info("Fetching all users from DB");
    const users = await UserModel.find();
    logger.info(`Total users fetched: ${users.length}`);
    return users;
  } catch (error) {
    logger.error("Failed to fetch users", error);
    throw error;
  }
};

export const updateUserById = async (id, { name, email, firebaseId }) => {
  try {
    logger.info(`Updating user with ID: ${id}`);
    const user = await UserModel.findByIdAndUpdate(
      id,
      { name, email, firebaseId },
      { new: true }
    );
    if (user) {
      logger.info(`User updated successfully: ${user._id}`);
    } else {
      logger.warn(`User not found for update: ${id}`);
    }
    return user;
  } catch (error) {
    logger.error(`Failed to update user: ${id}`, error);
    throw error;
  }
};

export const deleteUserById = async (id) => {
  try {
    logger.info(`Deleting user with ID: ${id}`);
    const user = await UserModel.findByIdAndDelete(id);
    if (user) {
      logger.info(`User deleted: ${user._id}`);
    } else {
      logger.warn(`User not found for deletion: ${id}`);
    }
    return user;
  } catch (error) {
    logger.error(`Failed to delete user: ${id}`, error);
    throw error;
  }
};
