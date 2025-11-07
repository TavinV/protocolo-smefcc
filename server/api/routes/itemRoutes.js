import express from "express";
import itemController from "../controllers/ItemController.js";

const router = express.Router();

router.post("/", itemController.create);
router.get("/", itemController.getItems);
router.get("/:id", itemController.getItemById);
router.delete("/:id", itemController.deleteItem);

export default router;
