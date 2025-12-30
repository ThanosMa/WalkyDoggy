# 🚀 Getting Started - Next Steps

Your WalkyDoggy project structure is ready! Here's what to do next:

## Step 1: Install Dependencies (5 minutes)

Open your terminal in the project root and run:

```bash
npm install
```

This will install dependencies for all packages (root, backend, frontend).

---

## Step 2: Start Docker Services (1 minute)

Start MongoDB, Redis, MinIO, and MailHog:

```bash
docker-compose up -d
```

Verify everything is running:

```bash
docker-compose ps
```

You should see 6 services running ✅

---

## Step 3: Configure Backend Environment (1 minute)

```bash
cd packages/backend
```

Copy the environment template:

```bash
# Windows PowerShell
copy ENV_TEMPLATE.txt .env

# Or manually create .env and copy contents from ENV_TEMPLATE.txt
```

The default values are perfect for local development!

---

## Step 4: Configure Frontend Environment (1 minute)

```bash
cd packages/frontend
```

Copy the environment template:

```bash
# Windows PowerShell
copy ENV_TEMPLATE.txt .env

# Or manually create .env and copy contents from ENV_TEMPLATE.txt
```

---

## Step 5: Start Backend Server (Terminal 1)

```bash
cd packages/backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Redis connected
🚀 Server running on port 3000
```

---

## Step 6: Start Frontend App (Terminal 2)

Open a **new terminal** window:

```bash
cd packages/frontend
npm run serve
```

You should see:
```
  VITE ready in XXX ms

  ➜  Local:   http://localhost:8080/
```

---

## Step 7: Open Your Browser! 🎉

Visit: **http://localhost:8080**

You should see the WalkyDoggy homepage with an API status check!

---

## Troubleshooting

### "Cannot find module" errors
```bash
# From project root
npm install
```

### Docker services not running
```bash
# Check Docker Desktop is running
docker --version

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### MongoDB connection failed
```bash
# Check if MongoDB is running
docker-compose ps mongo

# Restart MongoDB
docker-compose restart mongo
```

### Port already in use
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process or change PORT in .env
```

---

## What You Have Now

✅ Complete project structure
✅ Backend API with Express
✅ Frontend with Vue 3
✅ MongoDB database
✅ Redis cache
✅ MinIO storage
✅ MailHog email testing
✅ Hot reload for development

---

## Useful URLs

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/health
- **MailHog**: http://localhost:8025
- **MinIO**: http://localhost:9001 (minioadmin/minioadmin123)
- **MongoDB UI**: http://localhost:8081 (admin/admin123)
- **Redis UI**: http://localhost:8082

---

## Next Steps

1. **Test the API connection** - Visit http://localhost:8080 and check the status card
2. **Explore the code** - Look at `packages/backend/src/` and `packages/frontend/src/`
3. **Start building features** - See [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) for the roadmap
4. **Read the docs** - Check out [QUICK_START.md](./QUICK_START.md) for more details

---

## Quick Commands Reference

```bash
# Start everything
docker-compose up -d
cd packages/backend && npm run dev  # Terminal 1
cd packages/frontend && npm run serve  # Terminal 2

# Stop Docker services
docker-compose down

# Reset everything
docker-compose down -v
docker-compose up -d

# View logs
docker-compose logs -f mongo
docker-compose logs -f redis

# Run from root (if you installed concurrently)
npm run dev  # Starts both backend and frontend
```

---

## Development Workflow

1. Make code changes (hot reload is enabled)
2. Changes appear automatically in browser
3. Check logs in terminal
4. Use MailHog to see emails
5. Use MongoDB UI to check database

---

## Need Help?

- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
- Check [DEVELOPMENT_VS_PRODUCTION.md](./DEVELOPMENT_VS_PRODUCTION.md) for environment info
- Look at existing code for examples
- Read inline comments in the code

---

## You're All Set! 🎊

Your development environment is ready. Time to build something awesome! 🚀

Start with these files:
- `packages/backend/src/server.js` - Backend entry point
- `packages/frontend/src/main.js` - Frontend entry point
- `packages/backend/src/app.js` - Express app configuration
- `packages/frontend/src/views/Home.vue` - Homepage

Happy coding! 🐾

