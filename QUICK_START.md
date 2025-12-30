# 🚀 Quick Start Guide - WalkyDoggy

Get started with WalkyDoggy development in **under 5 minutes**!

## Prerequisites

- ✅ Node.js 20+ installed
- ✅ Docker Desktop installed and running
- ✅ Git installed

**That's it! No cloud accounts needed.**

---

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/your-org/walkydoggy.git
cd walkydoggy

# Install dependencies (from root)
npm install
```

---

## Step 2: Start Local Services (1 minute)

```bash
# Start MongoDB, Redis, MinIO, MailHog, etc.
docker-compose up -d

# Verify everything is running
docker-compose ps
```

You should see 6 services running:
- ✅ walkydoggy-mongo
- ✅ walkydoggy-redis
- ✅ walkydoggy-minio
- ✅ walkydoggy-mailhog
- ✅ walkydoggy-mongo-express
- ✅ walkydoggy-redis-commander

---

## Step 3: Configure Environment (1 minute)

### Backend Configuration

```bash
cd packages/backend
```

Create `.env` file:
```bash
NODE_ENV=development
PORT=3000

# Database (via Docker)
MONGODB_URI=mongodb://localhost:27017/walkydoggy
REDIS_URL=redis://localhost:6379

# JWT (use any random strings for development)
JWT_SECRET=dev-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Storage (local filesystem)
STORAGE_TYPE=local
UPLOAD_DIR=./uploads

# Email (MailHog for testing)
EMAIL_SERVICE=mailhog
MAILHOG_HOST=localhost
MAILHOG_PORT=1025
FROM_EMAIL=noreply@walkydoggy.local

# CORS
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:19006

# Optional (leave empty for now)
STRIPE_SECRET_KEY=
MAPBOX_ACCESS_TOKEN=
```

### Frontend Configuration

```bash
cd packages/frontend
```

Create `.env` file:
```bash
VUE_APP_API_URL=http://localhost:3000/api/v1
VUE_APP_SOCKET_URL=http://localhost:3000
```

---

## Step 4: Start Development Servers (1 minute)

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd packages/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd packages/frontend
npm run serve
```

---

## Step 5: Access Your App! 🎉

Open your browser to:

### Main Application
- **🌐 Web App**: http://localhost:8080
- **🚀 API**: http://localhost:3000
- **📚 API Docs**: http://localhost:3000/api-docs

### Development Tools
- **📧 MailHog (Email Testing)**: http://localhost:8025
- **💾 MinIO Console (File Storage)**: http://localhost:9001
  - Username: `minioadmin`
  - Password: `minioadmin123`
- **🗄️ MongoDB Express (Database)**: http://localhost:8081
  - Username: `admin`
  - Password: `admin123`
- **🔴 Redis Commander (Cache)**: http://localhost:8082

---

## Optional: Seed Database with Sample Data

```bash
cd packages/backend
npm run seed
```

This creates:
- 2 pet owners
- 1 business with 3 workers
- 5 sample pets
- 3 services
- Sample bookings

---

## Common Commands

```bash
# View Docker logs
docker-compose logs -f

# Stop all Docker services
docker-compose down

# Stop and remove all data
docker-compose down -v

# Restart a specific service
docker-compose restart mongo

# View backend logs
cd packages/backend
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

---

## Testing Features

### Test Email Sending
1. Trigger any email in your app (e.g., user registration)
2. Open http://localhost:8025
3. See the email in MailHog inbox!

### Test File Uploads
1. Upload a pet photo
2. Files are saved to `packages/backend/uploads/`
3. Access via http://localhost:3000/uploads/filename.jpg

### Test Database
1. Open http://localhost:8081
2. Browse collections
3. View/edit documents

### Test Redis Cache
1. Open http://localhost:8082
2. View cached data
3. Check worker locations (geo-indexed)

---

## Troubleshooting

### "Port already in use"
```bash
# Find and kill process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### "Cannot connect to MongoDB"
```bash
# Check if Docker is running
docker ps

# Restart MongoDB
docker-compose restart mongo

# Check logs
docker-compose logs mongo
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Start Fresh
```bash
# Stop everything
docker-compose down -v

# Remove node_modules
rm -rf node_modules packages/*/node_modules

# Start over
npm install
docker-compose up -d
```

---

## Next Steps

Once your development environment is running:

1. **Explore the Codebase**
   - Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
   - Check out the modular backend architecture

2. **Read the Documentation**
   - [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) - Full architecture
   - [DATABASE_SCHEMA_DIAGRAM.md](./DATABASE_SCHEMA_DIAGRAM.md) - Database design
   - [DEVELOPMENT_VS_PRODUCTION.md](./DEVELOPMENT_VS_PRODUCTION.md) - Env differences

3. **Start Building**
   - Pick a feature from the roadmap
   - Create a feature branch
   - Write tests
   - Submit a PR

4. **Add Third-Party Integrations** (when needed)
   - [Stripe Setup](./SETUP_GUIDE.md#stripe-setup) - For payment testing
   - [Mapbox Setup](./SETUP_GUIDE.md#mapbox-setup) - For map features

---

## Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes (hot reload is enabled)
# Edit files in packages/backend or packages/frontend

# 3. Test your changes
npm test

# 4. Lint your code
npm run lint

# 5. Commit and push
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature

# 6. Create Pull Request on GitHub
```

---

## What's Running?

| Service | Purpose | Port | URL |
|---------|---------|------|-----|
| MongoDB | Database | 27017 | `mongodb://localhost:27017` |
| Redis | Cache & Queues | 6379 | `redis://localhost:6379` |
| MinIO | File Storage (S3-compatible) | 9000, 9001 | http://localhost:9001 |
| MailHog | Email Testing | 1025, 8025 | http://localhost:8025 |
| Backend API | Node.js/Express | 3000 | http://localhost:3000 |
| Frontend | Vue.js App | 8080 | http://localhost:8080 |

---

## Cost to Run Development Environment

**Total: $0/month** 💰

Everything runs locally on your machine!

---

## Need Help?

- 📖 Read the [full setup guide](./SETUP_GUIDE.md)
- 🐛 Check [troubleshooting](./SETUP_GUIDE.md#troubleshooting)
- 💬 Ask in team chat
- 🎫 Create a GitHub issue

---

## Ready to Deploy?

When you're ready to deploy to production:
1. Set up AWS account
2. Configure production environment variables
3. Follow [deployment guide](./TECHNICAL_ARCHITECTURE.md#deployment-architecture)

But that can wait! Focus on building features first. 🚀

