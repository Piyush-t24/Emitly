# Render Deployment Guide

## Single Render Deployment (Frontend + Backend)

### 1. Render Configuration

**Service Type:** Web Service

**Build Command:**

```bash
npm run build
```

**Start Command:**

```bash
npm start
```

### 2. Environment Variables

Set these in Render dashboard:

```
NODE_ENV=production
MONGO_URI=your-mongodb-atlas-connection-string
```

### 3. How it Works

1. **Build Process:**

   - Installs all dependencies
   - Builds React frontend to `frontend/build/`
   - Backend serves both API and static files

2. **Production Setup:**
   - Backend runs on Render's assigned port
   - Frontend is served as static files from backend
   - No CORS issues (same domain)
   - Socket.io works seamlessly

### 4. File Structure After Build

```
/
├── backend/
│   ├── server.js (serves API + static files)
│   └── ...
├── frontend/
│   └── build/ (React build files)
└── package.json
```

### 5. API Endpoints

- `GET /` - Serves React app
- `GET /health` - Health check
- `GET /api/*` - Backend API routes
- `POST /api/*` - Backend API routes

### 6. Socket.io

- Automatically works on same domain
- No CORS configuration needed
- Real-time features work seamlessly

### 7. Prevent Cold Starts (Keep-Alive)

Render's free tier services spin down after 15 minutes of inactivity. To prevent cold starts:

**Option 1: Built-in Keep-Alive (Recommended)**

- The app automatically pings `/health` endpoint every 5 minutes when users have the app open
- This works well if users are actively using the app

**Option 2: External Ping Service (For 24/7 Uptime)**

- Use a free service like [UptimeRobot](https://uptimerobot.com/) or [cron-job.org](https://cron-job.org/)
- Set up a monitor to ping your Render URL every 5 minutes:
  ```
  URL: https://your-app-name.onrender.com/health
  Interval: 5 minutes
  Method: GET
  ```

**Health Check Endpoint:**

- `GET /health` - Returns server status and uptime
- Use this for keep-alive pings

### 8. Benefits

✅ Single deployment  
✅ No CORS issues  
✅ Socket.io works perfectly  
✅ Cost effective (one service)  
✅ Easy to manage  
✅ Built-in keep-alive service
