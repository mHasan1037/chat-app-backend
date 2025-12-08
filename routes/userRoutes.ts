import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { searchUsers } from '../controllers/userController';

const router = express.Router();

router.get('/search', protectedRoute, searchUsers);

export default router;