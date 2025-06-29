import { Router } from "express";
import UserController from "../controller/user-controller.js";

const route = Router();
route.route("/ping").get((req, res) => {
  res.status(200).json({ message: "User service says: PONG!" });
});
route.route("/adduser/").post(UserController.createUser);
route.route("/getuser/:userid").get(UserController.getUserById);
route.route("/deleteuser/:userid").delete(UserController.deleteUserById);
route.route("/update/").post(UserController.updateUserById);
route.route("/registerfcm/").post(UserController.registerFcmToken);
route.route("/getfcm/:userid").get(UserController.getFcmTokenByUserId);

export default route;
