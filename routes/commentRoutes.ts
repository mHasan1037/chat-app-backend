import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { createComment, getCommentsByPost } from '../controllers/commentController';

const router = express.Router();

router.post("/:postId", protectedRoute, createComment);
router.get("/:postId", protectedRoute, getCommentsByPost);

export default router;