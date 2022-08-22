import express from 'express';

import { getPost, getPosts, getPostsBySearch, createPost, updatePost, deletePost, likePost, commentPost } from '../controllers/postsActions.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/post/:id', getPost);
router.get('/', getPosts);
router.get('/search/post', getPostsBySearch);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost);

export default router;