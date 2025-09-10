const { pool } = require('../config/database');

// Add comment to post
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;
        const userId = req.user.id;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        // Check if post exists
        const [posts] = await pool.execute(
            'SELECT id FROM posts WHERE id = ?',
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Add comment
        const [result] = await pool.execute(
            'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)',
            [userId, postId, content.trim()]
        );

        // Get the created comment with user info
        const [comments] = await pool.execute(`
            SELECT c.*, u.username, u.avatar, u.full_name
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `, [result.insertId]);

        res.status(201).json({
            message: 'Comment added successfully',
            comment: comments[0]
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get comments for post
const getComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const [comments] = await pool.execute(`
            SELECT c.*, u.username, u.avatar, u.full_name
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
            LIMIT ? OFFSET ?
        `, [postId, limit, offset]);

        res.json({ comments });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete comment
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;

        // Check if comment exists and belongs to user
        const [comments] = await pool.execute(
            'SELECT id, user_id FROM comments WHERE id = ?',
            [commentId]
        );

        if (comments.length === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comments[0].user_id !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Delete comment
        await pool.execute('DELETE FROM comments WHERE id = ?', [commentId]);

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addComment,
    getComments,
    deleteComment
};