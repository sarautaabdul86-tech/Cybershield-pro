import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateAIResponse } from '../config/ai.js';
import logger from '../config/logger.js';

const router = express.Router();

// AI Chat endpoint
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, context = 'general' } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    const prompt = `You are a cybersecurity expert assistant. Context: ${context}. User question: ${message}`;
    
    const response = await generateAIResponse(prompt);
    
    logger.info(`AI chat from user ${req.user.id}`);
    
    res.json({
      success: true,
      data: {
        response,
        context
      }
    });
  } catch (error) {
    logger.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'AI response generation failed'
    });
  }
});

// Generate security report
router.post('/generate-report', authenticate, async (req, res) => {
  try {
    const { topic, format = 'text' } = req.body;
    
    const prompt = `Generate a comprehensive cybersecurity report on: ${topic}. Include key findings, recommendations, and best practices.`;
    
    const report = await generateAIResponse(prompt);
    
    logger.info(`Report generated for user ${req.user.id}`);
    
    res.json({
      success: true,
      data: {
        report,
        format,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    logger.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Report generation failed'
    });
  }
});

// Code security analysis
router.post('/analyze-code', authenticate, async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Code is required'
      });
    }
    
    const prompt = `Analyze the following ${language} code for security vulnerabilities and provide recommendations:\n\n${code}`;
    
    const analysis = await generateAIResponse(prompt);
    
    logger.info(`Code analyzed for user ${req.user.id}`);
    
    res.json({
      success: true,
      data: {
        analysis,
        language
      }
    });
  } catch (error) {
    logger.error('Code analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Code analysis failed'
    });
  }
});

export default router;
