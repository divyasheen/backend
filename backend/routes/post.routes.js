
import express from 'express';
import { createPost, getAllPosts } from '../controllers/post.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new post (requires login)
router.post('/', authenticate, createPost);

// Get all posts (public or authenticated)
router.get('/', getAllPosts);
router.get('/me', authenticate, (req, res) => {
    res.json({ user: req.user });
  });
  
export default router;
