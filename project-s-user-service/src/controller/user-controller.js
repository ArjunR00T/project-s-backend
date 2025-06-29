// services/user.service.js
import userModel from "../models/user-model.js";

const createUser = async (req, res) => {
  const { name, email, firebaseId } = req.body;
  try {
    const user = new userModel({ name, email, firebaseId });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getUserById = async (id) => {
  return await userModel.find({ id });
};

const updateUserById = async (id, { name, email, firebaseId }) => {
  return await userModel.findByIdAndUpdate(
    id,
    { name, email, firebaseId },
    { new: true }
  );
};

const deleteUserById = async (id) => {
  return await userModel.findByIdAndDelete(id);
};

const registerFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body;
  if (!userId || !fcmToken) {
    return res.status(400).json({ message: "User ID and FCM token are required" });
  }
  try {
    const user = await userModel.findOne({ firebaseId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.fcmToken = fcmToken;
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

const getFcmTokenByUserId = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!user.fcmToken) {
    return res.status(404).json({ message: "FCM token not found for this user" });
  }
  res.status(200).json({ fcmToken: user.fcmToken });
};

export default {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  registerFcmToken,
  getFcmTokenByUserId
};