# API Documentation

## Overview
CyberShield Pro API provides comprehensive endpoints for authentication, learning, security tools, and community features.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Core Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Users
- `GET /users/profile` - Get user profile (protected)
- `PUT /users/profile` - Update profile (protected)
- `GET /users/stats` - Get learning stats (protected)

### Courses
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get course details
- `POST /courses/:id/enroll` - Enroll in course (protected)
- `GET /courses/user/enrollments` - Get user enrollments (protected)

### AI Assistant
- `POST /ai/chat` - Chat with AI (protected)
- `POST /ai/generate-report` - Generate security report (protected)
- `POST /ai/analyze-code` - Analyze code for vulnerabilities (protected)

### Security Scanner
- `POST /scanner/website` - Scan website security (protected)
- `GET /scanner/history` - Get scan history (protected)

### Password Manager
- `POST /passwords/generate` - Generate secure password (protected)
- `POST /passwords/save` - Save password (protected)
- `GET /passwords` - Get saved passwords (protected)

### Scam Reporting
- `POST /scams` - Report scam (protected)
- `GET /scams/my-reports` - Get user's reports (protected)
- `POST /scams/:id/generate-report` - Generate complaint report (protected)

### Virtual Classrooms
- `POST /classrooms` - Create classroom (protected)
- `GET /classrooms` - Get user's classrooms (protected)
- `POST /classrooms/:id/join` - Join classroom (protected)

### CTF Platform
- `GET /ctf` - Get CTF challenges (protected)
- `GET /ctf/:id` - Get challenge details (protected)
- `POST /ctf/:id/submit` - Submit flag (protected)
- `GET /ctf/leaderboard` - Get CTF leaderboard (protected)

### Job Marketplace
- `GET /jobs` - Get job listings
- `POST /jobs` - Post job (employer only)
- `POST /jobs/:id/apply` - Apply for job (protected)

### Admin
- `GET /admin/stats` - Get admin stats (admin only)
- `GET /admin/users` - Get all users (admin only)
- `PUT /admin/users/:id/status` - Update user status (admin only)
- `GET /admin/logs` - Get audit logs (admin only)

### CyberShield AI Copilot
- `POST /copilot/linux-helper` - Linux command help (protected)
- `POST /copilot/python-generator` - Generate Python code (protected)
- `POST /copilot/code-analyzer` - Analyze code security (protected)

## Response Format

All responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## Pagination

Endpoints that return lists support pagination:
```
GET /courses?page=1&limit=10
```

## WebSocket Events (Real-time)

- `message` - Real-time chat messages
- `user-online` - User comes online
- `user-offline` - User goes offline
- `classroom-update` - Classroom content updated
- `notification` - Real-time notifications
