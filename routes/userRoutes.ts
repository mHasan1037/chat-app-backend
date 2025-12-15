import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { getUserProfile, searchUsers, updateMyProfile, unfriendUser } from '../controllers/userController';

const router = express.Router();

router.get('/search', protectedRoute, searchUsers);
router.patch('/me', protectedRoute, updateMyProfile);
router.delete('/friends/:id', protectedRoute, unfriendUser);
router.get('/:id', protectedRoute, getUserProfile);

export default router;