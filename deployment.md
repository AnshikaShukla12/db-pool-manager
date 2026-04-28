# Deployment Guide

How to deploy db-pool-manager to production.

---

## Option 1 — Deploy to Render (Free & Easy)

### Backend
1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set these values:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add environment variables from your `.env` file
5. Click **Deploy**

### Database
1. In Render → **New PostgreSQL**
2. Copy the **Internal Database URL**
3. Set it as `DATABASE_URL` in your backend service env vars

---

## Option 2 — Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

Add environment variables in the Railway dashboard.

---

## Option 3 — Deploy with Docker on a VPS

### On your VPS (Ubuntu):
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone the repo
git clone https://github.com/AnshikaShukla12/db-pool-manager.git
cd db-pool-manager

# Create production .env
cp backend/config/.env.example backend/.env
nano backend/.env   # fill in production values

# Start the app
docker compose -f docker/docker-compose.yml up -d --build
```

### Check it's running:
```bash
docker compose -f docker/docker-compose.yml ps
curl http://localhost:5000/api/health
```

---

## Environment Variables for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` |
| `DB_HOST` | Database host | `your-db-host.com` |
| `DB_USER` | Database user | `admin` |
| `DB_PASSWORD` | Database password | `strongpassword` |
| `DB_NAME` | Database name | `pooldb` |
| `JWT_SECRET` | JWT signing key | `long-random-string` |
| `POOL_MAX` | Max DB connections | `20` |

---

## Production Checklist

- [ ] `NODE_ENV=production` is set
- [ ] Strong `JWT_SECRET` is used (not default)
- [ ] Database password is strong
- [ ] `.env` file is NOT committed to git
- [ ] HTTPS is enabled (via reverse proxy like Nginx)
- [ ] Logs directory is writable
- [ ] Health check endpoint is working
