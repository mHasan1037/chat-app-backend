import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware';
import { createPost, getUserPosts, getFeedPosts, updatePost, deletePost } from '../controllers/postController';

const router = express.Router();

router.post('/', protectedRoute, createPost);
router.get('/user/:userId', protectedRoute, getUserPosts);
router.get('/feed', protectedRoute, getFeedPosts);
router.patch('/:postId', protectedRoute, updatePost);
router.delete('/:postId', protectedRoute, deletePost);

export default router;

