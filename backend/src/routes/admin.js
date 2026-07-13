import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { query } from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// Get dashboard stats (admin)
router.get('/stats', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await query('SELECT COUNT(*) as total FROM users');
    const courses = await query('SELECT COUNT(*) as total FROM courses WHERE is_published = true');
    const enrollments = await query('SELECT COUNT(*) as total FROM enrollments');
    const reports = await query('SELECT COUNT(*) as total FROM scam_reports WHERE status = \'pending\'');
    
    res.json({
      success: true,
      data: {
        totalUsers: parseInt(users.rows[0].total),
        totalCourses: parseInt(courses.rows[0].total),
        totalEnrollments: parseInt(enrollments.rows[0].total),
        pendingReports: parseInt(reports.rows[0].total)
      }
    });
  } catch (error) {
    logger.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
});

// Get all users (admin)
router.get('/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const result = await query('SELECT id, username, email, role, is_active, created_at FROM users LIMIT 100');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Users fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Ban/Unban user (admin)
router.put('/users/:id/status', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const result = await query(
      'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, username, is_active',
      [isActive, req.params.id]
    );
    
    logger.info(`User ${req.params.id} status updated by admin ${req.user.id}`);
    
    res.json({
      success: true,
      message: 'User status updated',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('User status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Get audit logs (admin)
router.get('/logs', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Logs fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs'
    });
  }
});

export default router;
