import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// Create classroom
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, subject } = req.body;
    
    const result = await query(
      'INSERT INTO classrooms (name, description, subject, teacher_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, subject, req.user.id]
    );
    
    logger.info(`Classroom created: ${result.rows[0].id}`);
    
    res.status(201).json({
      success: true,
      message: 'Classroom created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Classroom creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create classroom'
    });
  }
});

// Get classrooms
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM classrooms WHERE teacher_id = $1 OR $2 = ANY(student_ids)',
      [req.user.id, req.user.id]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Classroom fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classrooms'
    });
  }
});

// Join classroom
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const result = await query(
      'UPDATE classrooms SET student_ids = array_append(student_ids, $1) WHERE id = $2 AND NOT $1 = ANY(student_ids) RETURNING *',
      [req.user.id, req.params.id]
    );
    
    logger.info(`User ${req.user.id} joined classroom ${req.params.id}`);
    
    res.json({
      success: true,
      message: 'Joined classroom successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Join classroom error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join classroom'
    });
  }
});

export default router;
