const express = require('express');
const { createPost, getFeed, getPost, toggleLike, getUserPosts } = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Post routes
router.post('/', upload.single('image'), createPost);
router.get('/feed', getFeed);
router.get('/user/:username', getUserPosts);
router.get('/:id', getPost);
router.post('/:id/like', toggleLike);

module.exports = router;