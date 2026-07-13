import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { query } from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// Create CTF challenge
router.post('/', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
  try {
    const { title, description, difficulty, flag, hints } = req.body;
    
    const result = await query(
      'INSERT INTO ctf_challenges (title, description, difficulty, flag, hints) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, difficulty, flag, JSON.stringify(hints)]
    );
    
    logger.info(`CTF challenge created by user ${req.user.id}`);
    
    res.status(201).json({
      success: true,
      message: 'Challenge created',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('CTF creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create challenge'
    });
  }
});

// Get challenges
router.get('/', authenticate, async (req, res) => {
  try {
    const { difficulty } = req.query;
    
    let sql = 'SELECT id, title, description, difficulty, points FROM ctf_challenges';
    const params = [];
    
    if (difficulty) {
      sql += ' WHERE difficulty = $1';
      params.push(difficulty);
    }
    
    sql += ' ORDER BY points';
    
    const result = await query(sql, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Challenges fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges'
    });
  }
});

// Submit flag
router.post('/:id/submit', authenticate, async (req, res) => {
  try {
    const { flag } = req.body;
    
    const challengeResult = await query('SELECT flag FROM ctf_challenges WHERE id = $1', [req.params.id]);
    
    if (challengeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    const correct = challengeResult.rows[0].flag === flag;
    
    if (correct) {
      await query(
        'INSERT INTO ctf_submissions (challenge_id, user_id, correct) VALUES ($1, $2, $3)',
        [req.params.id, req.user.id, true]
      );
      
      logger.info(`User ${req.user.id} solved challenge ${req.params.id}`);
    }
    
    res.json({
      success: true,
      data: {
        correct,
        message: correct ? 'Flag is correct!' : 'Flag is incorrect. Try again!'
      }
    });
  } catch (error) {
    logger.error('Flag submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit flag'
    });
  }
});

// Get leaderboard
router.get('/leaderboard', authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT u.username, COUNT(DISTINCT s.challenge_id) as challenges_solved
      FROM users u
      LEFT JOIN ctf_submissions s ON u.id = s.user_id AND s.correct = true
      GROUP BY u.id, u.username
      ORDER BY challenges_solved DESC
      LIMIT 50
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

export default router;
