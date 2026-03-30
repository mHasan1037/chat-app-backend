import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { createComment, getCommentsByPost, deleteComment } from '../controllers/commentController';

const router = express.Router();

router.post("/:postId", protectedRoute, createComment);
router.get("/:postId", protectedRoute, getCommentsByPost);
router.delete("/:commentId", protectedRoute, deleteComment);

export default router;