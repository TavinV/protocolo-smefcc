import express from "express";
import itemModelController from "../controllers/itemModelController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, itemModelController.create);

router.get("/", authenticateToken, itemModelController.getItemModels);
router.get("/:id", authenticateToken, itemModelController.getItemModel);

router.patch("/:id", authenticateToken, itemModelController.updateItemModel);

router.delete("/:id", authenticateToken, itemModelController.deleteItemModel);

export default router;
