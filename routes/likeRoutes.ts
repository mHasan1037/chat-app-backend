import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { toggleLike } from '../controllers/likeController';

const router = express.Router();

router.post("/:postId", protectedRoute, toggleLike)

export default router;