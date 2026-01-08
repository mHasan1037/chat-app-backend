import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { createOrGetConversation, getConverSationById, getConverSations } from '../controllers/chatController';

const router = express.Router();

router.post('/', protectedRoute, createOrGetConversation);
router.get('/', protectedRoute, getConverSations);
router.get('/:id', protectedRoute, getConverSationById);

export default router;