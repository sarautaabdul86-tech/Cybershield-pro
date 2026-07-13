# Architecture Overview

## System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │         │   Mobile    │         │   Admin     │
│  Frontend   │◄────────┤     Apps    │◄────────┤   Panel     │
└──────┬──────┘         └─────────��───┘         └─────────────┘
       │                        │                       │
       └────────────┬───────────┴───────────┬───────────┘
                    │                       │
           ┌────────▼────────┐     ┌────────▼────────┐
           │   Express.js    │     │   Socket.io     │
           │   REST API      │     │   Real-time     │
           └────────┬────────┘     └────────┬────────┘
                    │                       │
           ┌────────▼──────────────────────▼────────┐
           │         Core Services                  │
           │  ├─ Authentication                     │
           │  ├─ Course Management                  │
           │  ├─ AI Integration                     │
           │  ├─ Security Tools                     │
           │  └─ Admin Management                   │
           └────────┬──────────────────────┬────────┘
                    │                      │
        ┌───────────▼──────┐    ┌──────────▼─────────┐
        │   PostgreSQL     │    │   Redis Cache      │
        │   Database       │    │   Session Store    │
        └──────────────────┘    └────────────────────┘
```

## Module Architecture

### Backend Structure
```
src/
├── config/
│   ├── database.js       - Database connection
│   ├── logger.js         - Logging configuration
│   └── ai.js             - AI provider configuration
├── middleware/
│   ├── auth.js           - Authentication & authorization
│   ├── errorHandler.js   - Global error handling
│   └── requestLogger.js  - Request logging
├── routes/
│   ├── auth.js           - Authentication routes
│   ├── users.js          - User management
│   ├── courses.js        - Course management
│   ├── ai.js             - AI assistant
│   ├── scanner.js        - Security scanner
│   ├── passwords.js      - Password manager
│   ├── classrooms.js     - Virtual classrooms
│   ├── ctf.js            - CTF platform
│   ├── jobs.js           - Job marketplace
│   ├── scams.js          - Scam reporting
│   ├── copilot.js        - AI Copilot
│   └── admin.js          - Admin functions
├── database/
│   ├── init.sql          - Database schema
│   ├── migrations.js     - Migration runner
│   └── seeds.js          - Database seeding
└── server.js             - Express app setup
```

### Frontend Structure
```
src/
├── pages/
│   ├── LoginPage.jsx     - Authentication
│   ├── RegisterPage.jsx  - Registration
│   ├── DashboardPage.jsx - Main dashboard
│   ├── CoursesPage.jsx   - Course listing
│   └── AIAssistantPage.jsx - AI chat
├── components/
│   ├── Header.jsx        - Top navigation
│   ├── Sidebar.jsx       - Side menu
│   ├── Button.jsx        - Reusable button
│   ├── Card.jsx          - Card components
│   ├── Alerts.jsx        - Alert components
│   └── LoadingSpinner.jsx - Loading indicator
├── services/
│   ├── api.js            - API client
│   └── socket.js         - WebSocket client
├── store/
│   ├── slices/
│   │   ├── authSlice.js  - Auth state
│   │   ├── userSlice.js  - User state
│   │   └── courseSlice.js - Course state
│   └── index.js          - Redux store config
├── App.jsx               - Main app component
└── main.jsx              - Entry point
```

## Data Flow

### Authentication Flow
1. User registers/logs in
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token included in all API requests

### Real-time Communication
1. Client connects to Socket.io server
2. Server broadcasts events to relevant clients
3. Messages delivered in real-time
4. Fallback to polling if WebSocket unavailable

## Security Architecture

### Authentication
- JWT tokens with 7-day expiration
- Refresh tokens for token renewal
- Secure password hashing with bcryptjs

### Authorization
- Role-based access control (RBAC)
- Roles: user, instructor, employer, admin
- Middleware checks permissions on protected routes

### Data Protection
- Passwords encrypted in transit (HTTPS)
- Sensitive data encrypted at rest
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization

## Scalability Considerations

### Horizontal Scaling
- Stateless API design allows multiple server instances
- Redis for distributed session management
- Database connection pooling

### Performance
- Database indexes on frequently queried fields
- Response caching with Redis
- Pagination for large datasets
- CDN for static assets

## Deployment Architecture

### Development
- Docker Compose for local services
- PostgreSQL + Redis containers
- Nodemon for hot reload

### Production
- Kubernetes for orchestration
- Multiple backend replicas behind load balancer
- Managed PostgreSQL (RDS/Cloud SQL)
- Redis cluster for session management
- CloudFront/CDN for frontend
