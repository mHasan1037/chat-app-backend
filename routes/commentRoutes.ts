import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { createComment, getCommentsByPost, deleteComment, editComment } from '../controllers/commentController';

const router = express.Router();

router.post("/:postId", protectedRoute, createComment);
router.get("/:postId", protectedRoute, getCommentsByPost);
router.delete("/:commentId", protectedRoute, deleteComment);
router.put("/:commentId", protectedRoute, editComment);

export default router;