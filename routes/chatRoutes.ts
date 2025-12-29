import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { createOrGetConversation, getConverSations } from '../controllers/chatController';

const router = express.Router();

router.post('/', protectedRoute, createOrGetConversation);
router.get('/', protectedRoute, getConverSations);

export default router;