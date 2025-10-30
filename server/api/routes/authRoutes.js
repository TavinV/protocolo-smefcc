import authController from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/login", authController.login);

export default router;
