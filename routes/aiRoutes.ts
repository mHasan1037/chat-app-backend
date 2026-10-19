import express from "express";
import { protectedRoute } from "../middleware/authMiddleware";
import createConversationWithAi from "../controllers/aiController";
import { aiBurstLimiter, aiDailyQuota } from "../middleware/aiRateLimit";

const router = express.Router();

router.post('/chat', protectedRoute, aiBurstLimiter, aiDailyQuota, createConversationWithAi);

export default router;