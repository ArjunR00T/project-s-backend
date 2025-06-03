import express from "express";
import requestController from "../controllers/requestController.js";

const router = express.Router();

router.route("/ping").get((req, res) => {
  res.status(200).json({ message: "Request service says: PONG!" });
});

router.route("/incoming").post(requestController.requestController);
router.route("/softCancel").post(requestController.softCancelRequest);
router.route("/completed").post(requestController.completedRequest);
router.route("/getQueue").post(requestController.getQueue);

export default router;
