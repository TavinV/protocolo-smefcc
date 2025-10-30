import express from "express";
import userController from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, userController.getUsers);
router.get("/:id", authenticateToken, userController.getUserById);
router.get("/me", authenticateToken, userController.getProfile);

router.post("/", authenticateToken, userController.createUser);

router.patch("/:id", authenticateToken, userController.updateUser);
router.patch("/:id/rfid", authenticateToken, userController.attachRFID);

router.delete("/:id/rfid", authenticateToken, userController.detachRFID);
router.delete("/:id", authenticateToken, userController.deleteUser);

export default router;
