import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { query } from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// Get job listings
router.get('/', async (req, res) => {
  try {
    const { level, remote, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT * FROM jobs WHERE status = \'active\'';
    const params = [];
    
    if (level) {
      sql += ` AND level = $${params.length + 1}`;
      params.push(level);
    }
    
    if (remote) {
      sql += ` AND remote = $${params.length + 1}`;
      params.push(remote === 'true');
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
    logger.error('Jobs fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });
  }
});

// Post job (employer only)
router.post('/', authenticate, authorize(['employer']), async (req, res) => {
  try {
    const { title, description, level, salary, remote, requirements } = req.body;
    
    const result = await query(
      'INSERT INTO jobs (employer_id, title, description, level, salary, remote, requirements) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, title, description, level, salary, remote, JSON.stringify(requirements)]
    );
    
    logger.info(`Job posted by user ${req.user.id}`);
    
    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Job posting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to post job'
    });
  }
});

// Apply for job
router.post('/:id/apply', authenticate, async (req, res) => {
  try {
    const result = await query(
      'INSERT INTO job_applications (job_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [req.params.id, req.user.id]
    );
    
    logger.info(`User ${req.user.id} applied for job ${req.params.id}`);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Job application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply'
    });
  }
});

export default router;
