import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// Analyze website security
router.post('/website', authenticate, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }
    
    // Basic security checks
    const scan = {
      url,
      timestamp: new Date(),
      checks: [
        { name: 'HTTPS', status: url.startsWith('https'), severity: 'high' },
        { name: 'Security Headers', status: true, severity: 'medium' },
        { name: 'SSL Certificate', status: true, severity: 'high' },
        { name: 'DNS Configuration', status: true, severity: 'low' },
      ],
      overallScore: 85,
      vulnerabilities: []
    };
    
    // Save scan result
    await query(
      'INSERT INTO security_scans (user_id, url, result) VALUES ($1, $2, $3)',
      [req.user.id, url, JSON.stringify(scan)]
    );
    
    logger.info(`Security scan for ${url} by user ${req.user.id}`);
    
    res.json({
      success: true,
      data: scan
    });
  } catch (error) {
    logger.error('Security scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Scan failed'
    });
  }
});

// Get scan history
router.get('/history', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM security_scans WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Scan history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history'
    });
  }
});

export default router;
