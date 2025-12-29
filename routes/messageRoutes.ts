import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { getMessages, sendMessage } from '../controllers/messageController';

const router = express.Router();

router.post('/', protectedRoute, sendMessage);
router.get('/:conversationId', protectedRoute, getMessages);

export default router;