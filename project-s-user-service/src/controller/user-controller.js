// services/user.service.js
import UserModel from "../models/user-model.js";

const createUser = async ({ name, email, firebaseId }) => {
  return await UserModel.create({ name, email, firebaseId });
};

const getUserById = async (id) => {
  return await UserModel.find({ id });
};

const updateUserById = async (id, { name, email, firebaseId }) => {
  return await UserModel.findByIdAndUpdate(
    id,
    { name, email, firebaseId },
    { new: true }
  );
};

const deleteUserById = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

export default {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
