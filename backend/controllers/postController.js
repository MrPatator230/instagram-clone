const { pool } = require('../config/database');
const path = require('path');

// Create new post
const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const [result] = await pool.execute(
            'INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)',
            [userId, imageUrl, caption || '']
        );

        // Get the created post with user info
        const [posts] = await pool.execute(`
            SELECT p.*, u.username, u.avatar, u.full_name
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        `, [result.insertId]);

        res.status(201).json({
            message: 'Post created successfully',
            post: posts[0]
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all posts for feed
const getFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [posts] = await pool.execute(`
            SELECT 
                p.*,
                u.username,
                u.avatar,
                u.full_name,
                COUNT(DISTINCT l.id) as likes_count,
                COUNT(DISTINCT c.id) as comments_count,
                MAX(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) as is_liked
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            GROUP BY p.id, u.id
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `, [req.user.id, limit, offset]);

        res.json({ posts });
    } catch (error) {
        console.error('Get feed error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get single post
const getPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const [posts] = await pool.execute(`
            SELECT 
                p.*,
                u.username,
                u.avatar,
                u.full_name,
                COUNT(DISTINCT l.id) as likes_count,
                COUNT(DISTINCT c.id) as comments_count,
                MAX(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) as is_liked
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE p.id = ?
            GROUP BY p.id, u.id
        `, [req.user.id, postId]);

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ post: posts[0] });
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Like/unlike post
const toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        // Check if post exists
        const [posts] = await pool.execute(
            'SELECT id FROM posts WHERE id = ?',
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if already liked
        const [existingLikes] = await pool.execute(
            'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
            [userId, postId]
        );

        let message;
        if (existingLikes.length > 0) {
            // Unlike
            await pool.execute(
                'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
                [userId, postId]
            );
            message = 'Post unliked';
        } else {
            // Like
            await pool.execute(
                'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
                [userId, postId]
            );
            message = 'Post liked';
        }

        // Get updated like count
        const [likeCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM likes WHERE post_id = ?',
            [postId]
        );

        res.json({
            message,
            likes_count: likeCount[0].count,
            is_liked: existingLikes.length === 0
        });
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user posts
const getUserPosts = async (req, res) => {
    try {
        const username = req.params.username;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const [posts] = await pool.execute(`
            SELECT 
                p.*,
                u.username,
                u.avatar,
                u.full_name,
                COUNT(DISTINCT l.id) as likes_count,
                COUNT(DISTINCT c.id) as comments_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE u.username = ?
            GROUP BY p.id, u.id
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `, [username, limit, offset]);

        res.json({ posts });
    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createPost,
    getFeed,
    getPost,
    toggleLike,
    getUserPosts
};