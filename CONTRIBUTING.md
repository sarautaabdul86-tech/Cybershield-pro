# CyberShield Pro Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- Git
- VS Code or preferred IDE

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/sarautaabdul86-tech/Cybershield-pro.git
cd Cybershield-pro

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Running Locally

### Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

Services will be available at:
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Running Manually

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - PostgreSQL
```bash
psql -U postgres
CREATE DATABASE cybershield_pro;
\c cybershield_pro
\i ../backend/src/database/init.sql
```

#### Terminal 3 - Redis
```bash
redis-server
```

#### Terminal 4 - Frontend
```bash
cd frontend
npm run dev
```

## Project Structure

### Backend
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── database/        # Database setup
│   └── server.js        # Express app
├── tests/               # Test files
└── package.json         # Dependencies
```

### Frontend
```
frontend/
├── src/
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   ├── services/        # API services
│   ├── store/           # Redux store
│   ├── App.jsx          # Main app
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies
```

## Code Style

### JavaScript/React
- Use ES6+ syntax
- Use functional components in React
- Use React Hooks for state management
- Follow ESLint rules

### Naming Conventions
- Files: kebab-case (user-profile.js)
- Components: PascalCase (UserProfile.jsx)
- Constants: UPPER_SNAKE_CASE (API_URL)
- Functions: camelCase (getUserProfile)

### Comments
```javascript
// Single line comment

/**
 * Multi-line comment
 * Describe what the function does
 * @param {type} param - Description
 * @returns {type} Description
 */
```

## API Development

### Creating a New Route

1. Create route file: `backend/src/routes/new-feature.js`
```javascript
import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
```

2. Register in `backend/src/server.js`
```javascript
import newFeatureRoutes from './routes/new-feature.js';
app.use('/api/new-feature', newFeatureRoutes);
```

## Frontend Development

### Creating a New Page

1. Create page: `frontend/src/pages/NewPage.jsx`
```jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '../components/Sidebar';

export const NewPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load data on mount
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Page content */}
      </main>
    </div>
  );
};
```

2. Add route in `frontend/src/App.jsx`
```jsx
<Route path="/new-page" element={<NewPage />} />
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Debugging

### Backend
```bash
# Enable debug logs
DEBUG=* npm run dev

# Use Node debugger
node --inspect src/server.js
```

### Frontend
- Use React Developer Tools browser extension
- Use Redux DevTools extension
- Use browser console

## Database Migrations

### Create Migration
```bash
cd backend
npm run migrate
```

### Seed Database
```bash
cd backend
npm run seed
```

## Git Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `fix/description`
- Documentation: `docs/description`

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code formatting
refactor: Code refactoring
test: Add tests
```

### Pull Request
1. Create feature branch
2. Make changes
3. Push to origin
4. Create pull request
5. Request review
6. Merge after approval

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cybershield_pro
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_key
```

### Frontend (.env)
```
VITE_APP_API_URL=http://localhost:5000/api
VITE_APP_SOCKET_URL=http://localhost:5000
```

## Common Tasks

### Add Package
```bash
cd backend # or frontend
npm install package-name
```

### Update Package
```bash
cd backend # or frontend
npm update package-name
```

### Remove Package
```bash
cd backend # or frontend
npm uninstall package-name
```

### Format Code
```bash
npm run lint -- --fix
```

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Socket.io Documentation](https://socket.io/docs/)

## Support

For questions or issues:
1. Check existing documentation
2. Search GitHub issues
3. Create new issue with details
