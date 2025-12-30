# 🐾 WalkyDoggy

> A comprehensive pet care service platform connecting pet owners with professional pet care businesses and workers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB?logo=react)](https://reactnative.dev/)

## 🌟 Features

### For Pet Owners
- 🔍 Search and discover pet care services near you
- 📍 View available pet workers on an interactive map
- 📅 Book and manage pet care services
- 💳 Secure in-app payments
- ⭐ Rate and review services
- 🐶 Manage multiple pets with co-ownership support
- 📱 Mobile app for on-the-go access
- 🔔 Real-time notifications

### For Pet Care Businesses
- 🏢 Create and manage business profiles
- 👥 Manage multiple pet workers
- 📋 Offer various pet care services
- 💰 Process payments with automatic payouts
- 📊 Track bookings and revenue
- ⭐ Build reputation with reviews
- 📍 Define service areas
- 🎯 Receive booking requests

### For Pet Workers
- 👤 Individual worker profiles
- 📍 Real-time location sharing when online
- 📅 Manage availability and schedule
- 🔔 Receive booking notifications
- ✅ Update booking status
- 📸 Upload service completion photos
- ⭐ Build personal reputation

## 🏗️ Architecture

### Technology Stack

**Frontend**
- Vue.js 3 (Composition API)
- Pinia (State Management)
- TailwindCSS + Vuetify
- Mapbox GL JS
- Socket.io Client

**Mobile**
- React Native with Expo
- React Navigation
- Zustand/Redux Toolkit
- Mapbox Native SDK

**Backend**
- Node.js with Express.js
- MongoDB (with Mongoose)
- Redis (Caching & Queues)
- Socket.io
- JWT Authentication
- Bull (Job Queue)

**Infrastructure**
- Docker & Docker Compose
- AWS (ECS, S3, CloudFront)
- GitHub Actions (CI/CD)
- MongoDB Atlas

**Third-Party Services**
- Stripe (Payments)
- Mapbox (Maps)
- SendGrid (Email)
- Twilio (SMS)
- PostHog (Analytics)
- Sentry (Error Tracking)

## 📁 Project Structure

```
walkydoggy/
├── packages/
│   ├── backend/          # Node.js/Express API
│   ├── frontend/         # Vue.js Web App
│   ├── mobile/           # React Native App
│   └── shared/           # Shared code (types, utils, validators)
├── infrastructure/       # Docker, Terraform, deployment configs
├── docs/                 # Documentation
└── scripts/              # Utility scripts
```

## 🚀 Quick Start

> **💡 Development is 100% free!** Everything runs locally via Docker - no AWS or cloud accounts needed.

### ⭐ NEW TO THIS PROJECT? START HERE! ⭐

👉 **[NEXT_STEPS_FOR_YOU.md](./NEXT_STEPS_FOR_YOU.md)** - Follow this guide to get started!

Also see:
- **[PROJECT_SETUP_COMPLETE.md](./PROJECT_SETUP_COMPLETE.md)** - Overview of what's been created
- **[START_HERE.md](./START_HERE.md)** - Quick reference checklist

### Prerequisites

- Node.js >= 20.0.0 ✅ (You have this!)
- Docker Desktop ✅ (You have this!)
- Git ✅ (You have this!)

### Quick Setup Steps

**TL;DR:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/walkydoggy.git
   cd walkydoggy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd packages/backend
   cp .env.example .env
   # Edit .env with your configuration

   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development services**
   ```bash
   # From project root - starts everything!
   docker-compose up -d
   ```
   
   This starts:
   - MongoDB (database)
   - Redis (cache)
   - MinIO (S3-compatible storage)
   - MailHog (email testing)
   - MongoDB Express (database UI)
   - Redis Commander (Redis UI)

5. **Seed database** (optional)
   ```bash
   cd packages/backend
   npm run seed
   ```

6. **Start development servers**
   ```bash
   # Backend (port 3000)
   cd packages/backend
   npm run dev

   # Frontend (port 8080)
   cd packages/frontend
   npm run serve
   ```

7. **Access the application**
   - 🌐 Web App: http://localhost:8080
   - 🚀 API: http://localhost:3000
   - 📚 API Docs: http://localhost:3000/api-docs
   - 📧 MailHog (emails): http://localhost:8025
   - 💾 MinIO (storage): http://localhost:9001
   - 🗄️ MongoDB UI: http://localhost:8081
   - 🔴 Redis UI: http://localhost:8082

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 💰 Development Costs

**Local Development: $0/month** 🎉

All services run locally via Docker:
- ✅ MongoDB (local container)
- ✅ Redis (local container)
- ✅ MinIO (S3-compatible local storage)
- ✅ MailHog (email testing)
- ✅ No AWS account needed
- ✅ No cloud costs
- ✅ Work offline

**Production: ~$900-1200/month** (only when you deploy)

See [cost breakdown](./TECHNICAL_ARCHITECTURE.md#estimated-costs-monthly) for details.

---

## 📖 Documentation

### Getting Started
- [**🚀 Quick Start**](./QUICK_START.md) - Get running in 5 minutes (start here!)
- [**Setup Guide**](./SETUP_GUIDE.md) - Detailed development environment setup
- [**Development vs Production**](./DEVELOPMENT_VS_PRODUCTION.md) - Local development setup (no AWS needed!)

### Architecture & Design
- [**Technical Architecture**](./TECHNICAL_ARCHITECTURE.md) - Complete technical architecture and design decisions
- [**Project Structure**](./PROJECT_STRUCTURE.md) - Directory structure and organization
- [**Database Schema**](./DATABASE_SCHEMA_DIAGRAM.md) - Database design and relationships

### Advanced Topics
- [**Mobile Migration**](./MOBILE_MIGRATION_STRATEGY.md) - Strategy for mobile app development
- [**API Documentation**](./docs/api/) - API endpoints and usage

## 🧪 Testing

```bash
# Backend tests
cd packages/backend
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage

# Frontend tests
cd packages/frontend
npm run test:unit           # Unit tests
npm run test:e2e            # E2E tests
```

## 📦 Building for Production

```bash
# Backend
cd packages/backend
npm run build

# Frontend
cd packages/frontend
npm run build

# Docker images
docker-compose -f docker-compose.prod.yml build
```

## 🚢 Deployment

The application uses GitHub Actions for CI/CD:
- Push to `develop` → Deploy to Staging
- Push to `main` → Deploy to Production

See [CI/CD Pipeline](./TECHNICAL_ARCHITECTURE.md#cicd-pipeline) for details.

## 🗺️ Roadmap

### Phase 1: MVP (Months 1-4) ✅ In Progress
- [ ] User authentication and profiles
- [ ] Pet management
- [ ] Basic search and booking
- [ ] Payment processing
- [ ] Review system
- [ ] Map integration

### Phase 2: Growth (Months 5-8)
- [ ] Mobile app (iOS & Android)
- [ ] Real-time chat
- [ ] Advanced search filters
- [ ] Subscription plans
- [ ] Analytics dashboard

### Phase 3: Scale (Months 9+)
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Insurance integration
- [ ] Background check integration
- [ ] Loyalty program

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Create a feature branch from `develop`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

3. Push and create a Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Team

- **Project Lead**: Your Name
- **Backend Lead**: Backend Lead Name
- **Frontend Lead**: Frontend Lead Name
- **Mobile Lead**: Mobile Lead Name

## 📞 Contact & Support

- **Email**: support@walkydoggy.com
- **Documentation**: https://docs.walkydoggy.com
- **Bug Reports**: [GitHub Issues](https://github.com/your-org/walkydoggy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/walkydoggy/discussions)

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript Framework
- [React Native](https://reactnative.dev/) - Mobile app framework
- [Express.js](https://expressjs.com/) - Web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Stripe](https://stripe.com/) - Payment processing
- [Mapbox](https://www.mapbox.com/) - Maps and location services
- All our contributors and supporters

---

**Built with ❤️ for pet lovers everywhere** 🐕 🐈 🐾

