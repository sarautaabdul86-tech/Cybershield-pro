# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- Docker & Docker Compose
- AWS/GCP account (for production)

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/sarautaabdul86-tech/Cybershield-pro.git
cd Cybershield-pro
```

### 2. Setup Environment
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Update Configuration
Edit `.env` files with your credentials:
```bash
# backend/.env
DB_HOST=postgres
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
```

### 4. Start Services with Docker
```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 5000
- Frontend on port 3000

### 5. Initialize Database
```bash
cd backend
npm run migrate
npm run seed
```

### 6. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

## Production Deployment

### AWS Deployment

#### 1. Setup EC2 Instance
```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install dependencies
sudo yum update -y
sudo yum install -y nodejs docker git
sudo systemctl start docker
```

#### 2. Deploy with Docker
```bash
git clone https://github.com/sarautaabdul86-tech/Cybershield-pro.git
cd Cybershield-pro

# Setup environment
cp .env.example .env
# Edit .env with production values

# Build and start
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. Setup RDS Database
```bash
# Create RDS PostgreSQL instance
# Update DB_HOST in .env to RDS endpoint
```

#### 4. Setup ElastiCache Redis
```bash
# Create ElastiCache Redis cluster
# Update REDIS_HOST in .env to cluster endpoint
```

#### 5. Setup CloudFront CDN
```bash
# Configure CloudFront distribution
# Point to frontend S3 bucket
# Set cache policies
```

#### 6. Setup Route 53 DNS
```bash
# Create DNS records
# api.cybershield-pro.com → API Load Balancer
# cybershield-pro.com → CloudFront Distribution
```

### GCP Deployment

#### 1. Create GKE Cluster
```bash
gcloud container clusters create cybershield-cluster \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --zone=us-central1-a
```

#### 2. Deploy with Kubernetes
```bash
# Build Docker images
docker build -t gcr.io/PROJECT_ID/cybershield-backend:latest backend/
docker build -t gcr.io/PROJECT_ID/cybershield-frontend:latest frontend/

# Push to Google Container Registry
docker push gcr.io/PROJECT_ID/cybershield-backend:latest
docker push gcr.io/PROJECT_ID/cybershield-frontend:latest

# Deploy to GKE
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
```

#### 3. Setup Cloud SQL
```bash
# Create Cloud SQL instance
gcloud sql instances create cybershield-db \
  --database-version POSTGRES_13 \
  --tier db-f1-micro
```

#### 4. Setup Memorystore Redis
```bash
# Create Redis instance
gcloud redis instances create cybershield-redis \
  --size=1 \
  --region=us-central1
```

## Monitoring & Logging

### Backend Logs
```bash
# Using Docker
docker logs cybershield-backend -f

# Using GKE
kubectl logs -f deployment/cybershield-backend
```

### Application Monitoring
```bash
# Setup Sentry for error tracking
npm install --save @sentry/node

# Setup New Relic for APM
npm install --save newrelic
```

## Backup & Recovery

### Database Backup
```bash
# Using AWS RDS
aws rds create-db-snapshot \
  --db-instance-identifier cybershield-db \
  --db-snapshot-identifier cybershield-backup-$(date +%Y%m%d)
```

### Restore from Backup
```bash
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier cybershield-db-restored \
  --db-snapshot-identifier cybershield-backup-20240101
```

## SSL/TLS Certificate

### Using Let's Encrypt
```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --standalone -d cybershield-pro.com

# Auto-renew
sudo systemctl enable certbot-renew.timer
```

## Performance Optimization

### Enable Caching
```javascript
// backend/src/middleware/cache.js
const redis = require('redis');
const client = redis.createClient();

app.use((req, res, next) => {
  const key = req.originalUrl;
  client.get(key, (err, data) => {
    if (data) return res.json(JSON.parse(data));
    next();
  });
});
```

### Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql -h localhost -U postgres -d cybershield_pro

# Check logs
docker logs cybershield-postgres
```

### Redis Connection Issues
```bash
# Test connection
redis-cli ping

# Check logs
docker logs cybershield-redis
```

### API Not Responding
```bash
# Check port
lsof -i :5000

# Restart service
docker restart cybershield-backend
```
