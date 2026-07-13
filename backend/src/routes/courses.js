import express from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import logger from '../config/logger.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { level, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT * FROM courses WHERE is_published = true';
    const params = [];
    
    if (level) {
      sql += ` AND level = $${params.length + 1}`;
      params.push(level);
    }
    
    if (category) {
      sql += ` AND category = $${params.length + 1}`;
      params.push(category);
    }
    
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await query(sql, params);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: { page, limit }
    });
  } catch (error) {
    logger.error('Courses fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const courseResult = await query('SELECT * FROM courses WHERE id = $1 AND is_published = true', [req.params.id]);
    
    if (courseResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const lessonsResult = await query('SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index', [req.params.id]);
    
    const course = courseResult.rows[0];
    course.lessons = lessonsResult.rows;
    
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    logger.error('Course fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
});

// Enroll in course
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const result = await query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [req.user.id, req.params.id]
    );
    
    logger.info(`User ${req.user.id} enrolled in course ${req.params.id}`);
    
    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Enrollment failed'
    });
  }
});

// Get user enrollments
router.get('/user/enrollments', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT c.*, e.progress_percentage, e.is_completed, e.enrolled_at FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.user_id = $1',
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Enrollments fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments'
    });
  }
});

export default router;
