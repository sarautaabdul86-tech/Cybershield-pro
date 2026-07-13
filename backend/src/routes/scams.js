import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// Report scam
router.post('/', authenticate, async (req, res) => {
  try {
    const { scamType, title, description, amount, contact, evidence } = req.body;
    
    const result = await query(
      'INSERT INTO scam_reports (user_id, scam_type, title, description, amount, contact, evidence) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, scamType, title, description, amount, contact, evidence]
    );
    
    logger.info(`Scam reported by user ${req.user.id}`);
    
    res.status(201).json({
      success: true,
      message: 'Scam reported successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Scam report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report scam'
    });
  }
});

// Get user's reports
router.get('/my-reports', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM scam_reports WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Reports fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
});

// Generate complaint report
router.post('/:id/generate-report', authenticate, async (req, res) => {
  try {
    const reportResult = await query(
      'SELECT * FROM scam_reports WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (reportResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    const report = reportResult.rows[0];
    const complaintReport = `
SCAM COMPLAINT REPORT
=====================

Report ID: ${report.id}
Date: ${new Date(report.created_at).toLocaleDateString()}

Scam Type: ${report.scam_type}
Title: ${report.title}
Description: ${report.description}
Amount Lost: $${report.amount}
Contact Information: ${report.contact}

Evidence: ${report.evidence}

This report has been filed for official records and investigation purposes.
    `;
    
    res.json({
      success: true,
      data: {
        report: complaintReport,
        filename: `scam-report-${report.id}.txt`
      }
    });
  } catch (error) {
    logger.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
});

export default router;
