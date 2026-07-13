import express from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import logger from '../config/logger.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const result = await query('SELECT id, username, email, first_name, last_name, avatar_url, bio, role, created_at FROM users WHERE id = $1', [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, bio, avatarUrl } = req.body;
    
    const result = await query(
      'UPDATE users SET first_name = $1, last_name = $2, bio = $3, avatar_url = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, username, email, first_name, last_name, avatar_url, bio',
      [firstName, lastName, bio, avatarUrl, req.user.id]
    );
    
    logger.info(`User updated: ${req.user.id}`);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Get user learning stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const enrollments = await query(
      'SELECT COUNT(*) as total_courses, SUM(CASE WHEN is_completed = true THEN 1 ELSE 0 END) as completed_courses FROM enrollments WHERE user_id = $1',
      [req.user.id]
    );
    
    const badges = await query(
      'SELECT COUNT(*) as badge_count FROM user_badges WHERE user_id = $1',
      [req.user.id]
    );
    
    const streak = await query(
      'SELECT current_streak, longest_streak FROM learning_streaks WHERE user_id = $1',
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: {
        totalCourses: parseInt(enrollments.rows[0].total_courses),
        completedCourses: parseInt(enrollments.rows[0].completed_courses) || 0,
        badges: parseInt(badges.rows[0].badge_count),
        currentStreak: streak.rows[0]?.current_streak || 0,
        longestStreak: streak.rows[0]?.longest_streak || 0
      }
    });
  } catch (error) {
    logger.error('Stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
});

export default router;
