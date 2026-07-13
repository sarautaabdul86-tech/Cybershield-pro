import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';
import logger from '../config/logger.js';
import crypto from 'crypto';

const router = express.Router();

// Generate password
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { length = 16, includeSpecial = true, includeNumbers = true } = req.body;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let charset = chars;
    if (includeNumbers) charset += numbers;
    if (includeSpecial) charset += special;
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    res.json({
      success: true,
      data: {
        password,
        strength: calculatePasswordStrength(password)
      }
    });
  } catch (error) {
    logger.error('Password generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Password generation failed'
    });
  }
});

// Save password
router.post('/save', authenticate, async (req, res) => {
  try {
    const { title, password, username, website } = req.body;
    
    // Encrypt password (in production, use proper encryption)
    const encryptedPassword = crypto
      .createCipher('aes192', process.env.DB_PASSWORD)
      .update(password, 'utf8', 'hex')
      .final();
    
    const result = await query(
      'INSERT INTO passwords (user_id, title, password, username, website) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, username, website',
      [req.user.id, title, encryptedPassword, username, website]
    );
    
    logger.info(`Password saved by user ${req.user.id}`);
    
    res.status(201).json({
      success: true,
      message: 'Password saved securely',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Password save error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save password'
    });
  }
});

// Get passwords
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, username, website, created_at FROM passwords WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Passwords fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch passwords'
    });
  }
});

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return levels[strength] || 'Very Weak';
};

export default router;
