import express from "express";
import { protectedRoute } from "../middleware/authMiddleware";
import createConversationWithAi from "../controllers/aiController";

const router = express.Router();

router.post('/chat', protectedRoute, createConversationWithAi);

export default router;