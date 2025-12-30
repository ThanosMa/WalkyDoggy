# WalkyDoggy - Development Setup Guide

## Prerequisites

### Required Software
- **Node.js**: v20 LTS or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm**: v10 or higher (comes with Node.js)
  - Verify: `npm --version`

- **Git**: Latest version
  - Download: https://git-scm.com/
  - Verify: `git --version`

- **Docker**: Latest version
  - Download: https://www.docker.com/products/docker-desktop
  - Verify: `docker --version` and `docker-compose --version`

### Optional but Recommended
- **MongoDB Compass**: For database management (if not using Atlas)
- **Postman** or **Insomnia**: For API testing
- **VS Code**: Recommended IDE with extensions:
  - ESLint
  - Prettier
  - Vetur (for Vue.js)
  - MongoDB for VS Code
  - Docker
  - GitLens

### Cloud Accounts (optional for development)
- **Required for Production Only:**
  - AWS account (not needed for local development)
- **Optional (Free Tiers Available):**
  - MongoDB Atlas account (or use local MongoDB)
  - Stripe account (test mode for payment testing)
  - Mapbox account (for map features)
- **Not Needed for Development:**
  - SendGrid (use MailHog instead)
  - Twilio (SMS testing can be mocked)

---

## Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/walkydoggy.git
cd walkydoggy
```

### 2. Install Dependencies

#### Option A: Install all packages (monorepo)
```bash
npm install
```

This will install dependencies for all packages using workspaces.

#### Option B: Install individually
```bash
# Backend
cd packages/backend
npm install

# Frontend
cd ../frontend
npm install

# Shared
cd ../shared
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables
```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` and add your configuration:
```bash
# Server
NODE_ENV=development
PORT=3000

# Database (Local MongoDB via Docker)
MONGODB_URI=mongodb://localhost:27017/walkydoggy
# OR use MongoDB Atlas free tier (optional)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/walkydoggy?retryWrites=true&w=majority

# Redis (Local via Docker)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Storage (Local for development)
STORAGE_TYPE=local
UPLOAD_DIR=./uploads
# For production, set STORAGE_TYPE=s3 and configure AWS below

# AWS (NOT NEEDED FOR DEVELOPMENT - Only for production)
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your-aws-access-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret-key
# S3_BUCKET=walkydoggy-prod-uploads

# Stripe (Optional - use test keys if testing payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
# Leave empty if not testing payments yet

# Mapbox (Optional - use if testing map features)
MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token
# Get free tier at https://account.mapbox.com/

# Email (Local MailHog for development)
EMAIL_SERVICE=mailhog
MAILHOG_HOST=localhost
MAILHOG_PORT=1025
FROM_EMAIL=noreply@walkydoggy.local
# For production, use SendGrid:
# EMAIL_SERVICE=sendgrid
# SENDGRID_API_KEY=SG.your_sendgrid_api_key

# SMS (Optional - can mock for development)
# TWILIO_ACCOUNT_SID=your_twilio_sid
# TWILIO_AUTH_TOKEN=your_twilio_token
# TWILIO_PHONE_NUMBER=+1234567890

# Analytics (Optional - free tiers available)
# POSTHOG_API_KEY=phc_your_posthog_key
# SENTRY_DSN=https://your_sentry_dsn@sentry.io/project

# CORS
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:19006

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment Variables
```bash
cd packages/frontend
cp .env.example .env
```

Edit `.env`:
```bash
VUE_APP_API_URL=http://localhost:3000/api/v1
VUE_APP_SOCKET_URL=http://localhost:3000
VUE_APP_MAPBOX_TOKEN=pk.your_mapbox_token
VUE_APP_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key
VUE_APP_POSTHOG_KEY=phc_your_posthog_key
VUE_APP_SENTRY_DSN=https://your_sentry_dsn@sentry.io/project
```

### 4. Start Development Services

#### Option A: Using Docker Compose (Recommended)
```bash
# From project root
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Redis on port 6379
- Backend API on port 3000
- Frontend on port 8080

#### Option B: Manual Setup

**Terminal 1 - MongoDB:**
```bash
# If installed locally
mongod
```

**Terminal 2 - Redis:**
```bash
# If installed locally
redis-server
```

**Terminal 3 - Backend:**
```bash
cd packages/backend
npm run dev
```

**Terminal 4 - Frontend:**
```bash
cd packages/frontend
npm run serve
```

### 5. Database Setup

#### Create Database and Seed Data
```bash
cd packages/backend

# Run migrations
npm run migrate

# Seed database with sample data
npm run seed
```

Sample data includes:
- 2 pet owners
- 1 business with 3 workers
- 5 pets
- 3 services
- Sample bookings

#### MongoDB Indexes
```bash
# Create all required indexes
npm run create-indexes
```

### 6. Verify Setup

1. **Backend API**: 
   - Open http://localhost:3000/health
   - Should return: `{"status": "ok"}`

2. **Frontend**:
   - Open http://localhost:8080
   - Should see the landing page

3. **Database**:
   ```bash
   # Connect to MongoDB
   mongosh
   
   # Use database
   use walkydoggy
   
   # Check collections
   show collections
   
   # Count users
   db.users.countDocuments()
   ```

4. **Redis**:
   ```bash
   redis-cli
   ping
   # Should return: PONG
   ```

---

## Development Workflow

### Running the Application

```bash
# Backend with hot reload
cd packages/backend
npm run dev

# Frontend with hot reload
cd packages/frontend
npm run serve

# Run both (from root with package like concurrently)
npm run dev
```

### Testing

```bash
# Backend unit tests
cd packages/backend
npm test

# Backend tests with coverage
npm run test:coverage

# Backend integration tests
npm run test:integration

# Frontend unit tests
cd packages/frontend
npm run test:unit

# Frontend E2E tests
npm run test:e2e
```

### Linting

```bash
# Backend
cd packages/backend
npm run lint
npm run lint:fix

# Frontend
cd packages/frontend
npm run lint
npm run lint:fix
```

### Database Migrations

```bash
cd packages/backend

# Create new migration
npm run migrate:create -- migration-name

# Run migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down
```

---

## Local Services Setup

### 1. MinIO (S3-Compatible Storage)

MinIO runs automatically via Docker Compose and provides S3-compatible storage.

**Access MinIO Console:**
- URL: http://localhost:9001
- Username: `minioadmin`
- Password: `minioadmin123`

**Create Bucket (optional - can be done via code):**
1. Open http://localhost:9001
2. Login with credentials above
3. Click "Create Bucket"
4. Name: `walkydoggy-uploads`

**Or create programmatically:**
```javascript
// In your backend seed script
const Minio = require('minio');
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin123'
});

await minioClient.makeBucket('walkydoggy-uploads');
```

### 2. MailHog (Email Testing)

MailHog runs automatically via Docker Compose and catches all outgoing emails.

**Access MailHog Web UI:**
- URL: http://localhost:8025
- All emails sent by your app will appear here

**No configuration needed!** Just send emails normally and they'll be captured:
```javascript
// Emails will appear in MailHog instead of being sent
await emailService.sendBookingConfirmation(user.email, booking);
```

### 3. Database Management Tools

**MongoDB Express** (optional):
- URL: http://localhost:8081
- Username: `admin`
- Password: `admin123`
- Browse and edit MongoDB collections

**Redis Commander** (optional):
- URL: http://localhost:8082
- View and manage Redis keys

---

## Optional: AWS Setup (Production Only)

**You can skip this entirely for development!**

When you're ready to deploy to production, you'll need:

### 1. Create AWS Account
- Sign up at https://aws.amazon.com/
- Free tier available for 12 months

### 2. Create S3 Bucket
```bash
aws s3 mb s3://walkydoggy-prod-uploads --region us-east-1
```

### 3. Create IAM User with S3 Access
- Attach `AmazonS3FullAccess` policy
- Generate access keys
- Add to production environment variables

**This can wait until you're ready to deploy!**

---

## Stripe Setup

### 1. Get API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy "Publishable key" and "Secret key"
3. Add to `.env` files

### 2. Set Up Webhooks (Local Testing)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe
# or download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe

# Copy webhook signing secret to .env
```

### 3. Create Test Products

```bash
# Using Stripe CLI
stripe products create --name="Dog Walking" --description="30 minute dog walk"

stripe prices create \
  --product=prod_xxx \
  --unit-amount=2500 \
  --currency=usd
```

---

## Mapbox Setup

1. Sign up at https://www.mapbox.com/
2. Go to Account → Tokens
3. Create new token with these scopes:
   - `styles:read`
   - `styles:list`
   - `fonts:read`
   - `datasets:read`
4. Copy token to `.env` files

---

## MongoDB Atlas Setup (Alternative to Local)

### 1. Create Cluster

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create new project: "WalkyDoggy"
3. Build a cluster (free tier: M0)
4. Choose cloud provider and region
5. Create cluster

### 2. Configure Access

1. **Network Access**: Add IP address (0.0.0.0/0 for development)
2. **Database Access**: Create database user
3. **Connect**: Get connection string
4. Update `MONGODB_URI` in `.env`

### 3. Database Setup

```bash
# Connection string format
mongodb+srv://username:password@cluster.mongodb.net/walkydoggy?retryWrites=true&w=majority
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
ps aux | grep mongod  # macOS/Linux
sc query MongoDB  # Windows

# Start MongoDB
brew services start mongodb-community  # macOS
net start MongoDB  # Windows
sudo systemctl start mongod  # Linux
```

### Redis Connection Issues

```bash
# Check if Redis is running
redis-cli ping

# Start Redis
brew services start redis  # macOS
redis-server  # Manual start
```

### Docker Issues

```bash
# Reset Docker environment
docker-compose down -v
docker system prune -a
docker-compose up -d
```

### Node Module Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Environment Variable Not Loading

1. Check `.env` file exists
2. Restart development server
3. Verify no syntax errors in `.env`
4. Check if using `dotenv` correctly in code

---

## Common Commands Reference

```bash
# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Database seed
npm run seed

# Database reset
npm run db:reset

# Docker commands
docker-compose up -d          # Start services
docker-compose down           # Stop services
docker-compose logs -f api    # View API logs
docker-compose restart api    # Restart API service

# Git workflow
git checkout -b feature/feature-name
git add .
git commit -m "feat: add feature"
git push origin feature/feature-name
```

---

## Next Steps

1. Review [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
2. Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
3. Review [DATABASE_SCHEMA_DIAGRAM.md](./DATABASE_SCHEMA_DIAGRAM.md)
4. Check API documentation at http://localhost:3000/api-docs
5. Join team Slack/Discord for questions
6. Review open issues on GitHub
7. Pick a starter task and create a feature branch

---

## Resources

- **API Documentation**: http://localhost:3000/api-docs
- **Vue.js Docs**: https://vuejs.org/
- **Express.js Docs**: https://expressjs.com/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Stripe Docs**: https://stripe.com/docs
- **Mapbox Docs**: https://docs.mapbox.com/
- **Docker Docs**: https://docs.docker.com/

---

## Getting Help

- Check existing documentation
- Search GitHub issues
- Ask in team chat
- Create new GitHub issue with:
  - Clear description of problem
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable
  - Environment details

