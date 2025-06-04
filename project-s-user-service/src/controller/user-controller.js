// services/user.service.js
import UserModel from "../models/user-model.js";

const createUser = async (req, res) => {
  const { name, email, firebaseId } = req.body;
  const user = new UserModel({ name, email, firebaseId });
  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
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
