import { Router } from "express";
import shopcontroller from "../controllers/shop-controller.js";
// import backfillGeoBuckets from "../utils/backFillBucketId.js";

const { addShop, getUserShops, delUserShop, getShopsInRange } = shopcontroller;

const route = Router();

// route.route("/backfill").get((req, res) => {
//   backfillGeoBuckets()
//     .then(() =>
//       res.status(200).json({ message: "Backfill completed successfully." })
//     )
//     .catch((err) => {
//       console.error("Error during backfill:", err);
//       res.status(500).json({ message: "Backfill failed.", error: err.message });
//     });
// });

route.route("/ping").get((req, res) => {
  res.status(200).json({ message: "Shop service says: PONG!" });
});
route.route("/addShop").post(addShop);
route.route("/getUserShops").post(getUserShops); // NOt sure its of any use, but keeping it for nowz
route.route("/delUserShop").post(delUserShop);
route.route("/getShopsInRange").post(getShopsInRange);

// Should add end-points for shop profile managment as well,

export default route;
