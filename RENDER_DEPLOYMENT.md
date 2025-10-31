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

### 7. Benefits

✅ Single deployment  
✅ No CORS issues  
✅ Socket.io works perfectly  
✅ Cost effective (one service)  
✅ Easy to manage
