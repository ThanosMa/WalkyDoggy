# 👋 START HERE

Welcome to WalkyDoggy! Follow these steps to get started:

## Quick Setup (10 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Docker Services
```bash
docker-compose up -d
```

### 3. Configure Environment Files

**Backend:**
```bash
cd packages/backend
copy ENV_TEMPLATE.txt .env
```

**Frontend:**
```bash
cd packages/frontend
copy ENV_TEMPLATE.txt .env
```

### 4. Start Development Servers

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

### 5. Open Browser
Visit: **http://localhost:8080** 🎉

---

## ✅ Checklist

- [ ] Node.js 20+ installed
- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] Run `npm install`
- [ ] Run `docker-compose up -d`
- [ ] Created `.env` files
- [ ] Backend running on port 3000
- [ ] Frontend running on port 8080
- [ ] Browser shows WalkyDoggy homepage

---

## 📚 Next Steps

Once everything is running:

1. **Read**: [GETTING_STARTED_NOW.md](./GETTING_STARTED_NOW.md) - Detailed setup guide
2. **Learn**: [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) - Understand the architecture
3. **Code**: Start building features!

---

## 🆘 Problems?

- **Docker not starting?** Make sure Docker Desktop is running
- **Port conflicts?** Check if ports 3000, 8080 are available
- **Dependencies error?** Delete `node_modules` and run `npm install` again
- **Still stuck?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section

---

## 🎯 What You Get

- ✅ Vue.js 3 frontend (port 8080)
- ✅ Express backend (port 3000)
- ✅ MongoDB database
- ✅ Redis cache
- ✅ Email testing (MailHog)
- ✅ File storage (MinIO)
- ✅ **Total cost: $0/month** 💰

---

**Let's build something amazing! 🚀**

