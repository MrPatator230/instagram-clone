const express = require('express');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Comment routes
router.post('/post/:postId', addComment);
router.get('/post/:postId', getComments);
router.delete('/:id', deleteComment);

module.exports = router;