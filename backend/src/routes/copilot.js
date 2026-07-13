import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateAIResponse } from '../config/ai.js';
import logger from '../config/logger.js';

const router = express.Router();

// Linux command helper
router.post('/linux-helper', authenticate, async (req, res) => {
  try {
    const { command, description } = req.body;
    
    const prompt = `Explain this Linux command for cybersecurity: ${command}. Include syntax, use cases, and examples: ${description || ''}`;
    
    const response = await generateAIResponse(prompt);
    
    logger.info(`Linux helper query from user ${req.user.id}`);
    
    res.json({
      success: true,
      data: {
        command,
        explanation: response
      }
    });
  } catch (error) {
    logger.error('Linux helper error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate explanation'
    });
  }
});

// Python code generator
router.post('/python-generator', authenticate, async (req, res) => {
  try {
    const { task, description } = req.body;
    
    const prompt = `Generate secure Python code for cybersecurity task: ${task}. Requirements: ${description}`;
    
    const code = await generateAIResponse(prompt);
    
    logger.info(`Python code generated for user ${req.user.id}`);
    
    res.json({
      success: true,
      data: {
        code,
        language: 'python'
      }
    });
  } catch (error) {
    logger.error('Python generator error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate code'
    });
  }
});

// Code security analysis
router.post('/code-analyzer', authenticate, async (req, res) => {
  try {
    const { code, language } = req.body;
    
    const prompt = `Analyze this ${language} code for security vulnerabilities:\n${code}\n\nProvide detailed findings and recommendations.`;
    
    const analysis = await generateAIResponse(prompt);
    
    logger.info(`Code analysis for user ${req.user.id}`);
    
    res.json({
      success: true,
      data: {
        analysis,
        language
      }
    });
  } catch (error) {
    logger.error('Code analyzer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze code'
    });
  }
});

export default router;
