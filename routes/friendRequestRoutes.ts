import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { sendFriendRequest } from '../controllers/friendRequestController';

const router = express.Router();

router.post('/request', protectedRoute, sendFriendRequest);

export default router;