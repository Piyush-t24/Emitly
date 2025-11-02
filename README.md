# 💬 Emitly - Real-Time Chat Application

<div align="center">

<!-- ![Emitly Logo](frontend/public/assets/EmitlyLogo/Emitly.png) -->

<img
  src="frontend/public/assets/EmitlyLogo/Emitly.png"
  alt="Emitly Logo"
  className="mx-auto h-8 object-contain"
/>

**A modern, real-time chat application built with React and Node.js**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0+-339933?logo=node.js)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?logo=socket.io)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.15.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Demo](#-demo--screenshots) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Demo & Screenshots](#-demo--screenshots)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Challenges & Solutions](#-challenges--solutions)
- [AI Tools Used](#-ai-tools-used)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**Emitly** is a full-stack real-time chat application that enables users to communicate instantly with one-on-one messaging and group chats. Built with modern web technologies, it provides a seamless chatting experience similar to WhatsApp and other popular messaging platforms.

### Key Highlights

- ✅ **Real-time messaging** with Socket.IO
- ✅ **One-on-one and group chats**
- ✅ **Read receipts** (sent, delivered, read status)
- ✅ **User presence** (online/offline indicators)
- ✅ **Emoji support** with emoji picker
- ✅ **Message deletion** (soft delete)
- ✅ **Typing indicators**
- ✅ **Notifications** for new messages
- ✅ **Responsive design** with Tailwind CSS
- ✅ **JWT-based authentication**

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- Secure JWT token-based authentication
- Protected routes and API endpoints
- Guest user support

### 💬 Chat Features

- **One-on-One Chats**: Private conversations between two users
- **Group Chats**: Create and manage group conversations
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Message Status**: View sent, delivered, and read receipts
- **Typing Indicators**: See when someone is typing
- **Emoji Support**: Rich emoji picker for expressive messages
- **Message Deletion**: Delete your own messages (soft delete)
- **Message Timestamps**: View when messages were sent

### 👥 User Management

- **User Search**: Find and connect with other users
- **User Profiles**: View and update user profiles
- **Online Status**: See who's online in real-time
- **Avatar Support**: Custom profile pictures

### 🔔 Notifications

- Real-time notifications for new messages
- Unread message counts
- Notification badges

### 🎨 UI/UX

- Modern, clean interface
- Responsive design (mobile-friendly)
- Smooth animations and transitions
- Loading states and error handling

---

## 🛠️ Tech Stack

### Frontend

- **React 18.2.0** - UI library
- **React Router DOM 7.6.1** - Routing
- **Tailwind CSS 3.3.3** - Styling
- **Socket.io Client 4.8.1** - Real-time communication
- **Axios 1.9.0** - HTTP client
- **Emoji Picker React 4.15.0** - Emoji picker component
- **React Hot Toast 2.5.2** - Toast notifications
- **React Scrollable Feed 2.0.3** - Scrollable chat feed
- **Lucide React 0.544.0** - Icons

### Backend

- **Node.js 18+** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **Socket.io 4.8.1** - WebSocket server
- **MongoDB 8.15.0** - Database (via Mongoose)
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **Bcryptjs 3.0.2** - Password hashing
- **Dotenv 16.5.0** - Environment variables
- **CORS 2.8.5** - Cross-origin resource sharing

### Development Tools

- **Nodemon 3.1.10** - Development server auto-reload
- **Concurrently 8.2.2** - Run multiple scripts simultaneously

### Architecture Notes

- **Proxy Configuration**: Frontend uses a proxy (`"proxy": "http://127.0.0.1:5000"` in `frontend/package.json`) to forward API requests to the backend during development
- **Single Command**: Use `npm run dev` to run both frontend and backend together
- **Production**: Backend serves static frontend files directly (no proxy needed)

---

## 📸 Demo & Screenshots

<div align="center">

### Homepage

![Homepage](frontend/public/assets/screenshots/screenshot1.png)
_Clean and modern login/signup interface_

### Chat Interface

![Chat Interface](frontend/public/assets/screenshots/screenshot2.png)
_Real-time messaging with emoji support_

### Group Chat

![Group Chat](frontend/public/assets/screenshots/screenshot3.png)
_Create and manage group conversations_

### User Search

![User Search](frontend/public/assets/screenshots/screenshot4.png)
_Search and connect with other users_

### Profile & Settings

![Profile](frontend/public/assets/screenshots/screenshot5.png)
_User profile management_

### Notifications

![Notifications](frontend/public/assets/screenshots/screenshot6.png)
_Real-time message notifications_

</div>

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB Atlas account** (or local MongoDB instance)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Piyush-t24/Emitly.git
cd Emitly
```

### Step 2: Install Dependencies

Install backend and frontend dependencies:

```bash
# Install root dependencies (includes backend)
npm install --legacy-peer-deps

# Install frontend dependencies
npm install --legacy-peer-deps --prefix frontend
```

### Step 3: Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/emitly?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=production
```

**Important:**

- Get your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Generate a strong JWT secret (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### Step 4: Run the Application

#### Development Mode (Recommended - Runs Both)

```bash
npm run dev
```

This will start both backend and frontend simultaneously:

- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

**How it works:**

- The frontend has a proxy configured (`"proxy": "http://127.0.0.1:5000"` in `frontend/package.json`)
- All API requests from frontend (e.g., `/api/user`, `/api/chat`) are automatically proxied to the backend
- This means you don't need to specify full backend URLs in your frontend code
- The frontend runs on port 3000, backend on port 5000, but API calls work seamlessly

#### Run Separately

**Backend only (at root):**

```bash
npm start
```

or for development with auto-reload:

```bash
npm run server
```

**Frontend only:**

```bash
npm start --prefix frontend
```

**Note:** When running separately, make sure the backend is running first, as the frontend proxy depends on it.

### Step 5: Build for Production

```bash
npm run build
```

This builds the React frontend and prepares it for deployment.

---

## 🔧 Environment Variables

### Required Variables

| Variable     | Description               | Example                                              |
| ------------ | ------------------------- | ---------------------------------------------------- |
| `MONGO_URI`  | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/emitly` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_super_secret_key_here`                         |
| `PORT`       | Backend server port       | `5000`                                               |
| `NODE_ENV`   | Environment mode          | `development` or `production`                        |

See `.env.example` for the template.

---

## 📡 API Documentation

For complete API documentation including all endpoints, request/response formats, Socket.IO events, and authentication details, please refer to:

👉 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

The API documentation includes:

- Base URLs for development and production
- Authentication guide
- All REST API endpoints (User, Chat, Message, Notification, Health Check)
- Socket.IO events (client → server and server → client)
- Request/response examples
- Error handling

---

## 📁 Project Structure

```
Emitly/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── generateToken.js   # JWT token generation
│   ├── controllers/
│   │   ├── chatControllers.js
│   │   ├── messageControllers.js
│   │   ├── notificationControllers.js
│   │   └── userControllers.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── errorMiddleware.js # Error handling
│   ├── Models/
│   │   ├── chatModel.js
│   │   ├── messageModel.js
│   │   ├── notificationModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   └── server.js              # Express server & Socket.IO
│
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   ├── EmitlyLogo/
│   │   │   └── screenshots/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Authentication/
│   │   │   │   ├── Login.js
│   │   │   │   └── Signup.js
│   │   │   ├── miscellaneous/
│   │   │   │   ├── GroupChatModal.js
│   │   │   │   ├── ProfileModal.js
│   │   │   │   ├── SideDrawer.js
│   │   │   │   └── UpdateGroupChatModal.js
│   │   │   ├── ScrollableChat.js
│   │   │   ├── SingleChat.js
│   │   │   ├── MyChats.js
│   │   │   └── userAvatar/
│   │   ├── Context/
│   │   │   └── ChatProvider.js  # Global state management
│   │   ├── Pages/
│   │   │   ├── Homepage.js
│   │   │   └── ChatPage.js
│   │   ├── services/
│   │   │   └── keepAliveService.js  # Render.com keep-alive
│   │   ├── config/
│   │   │   └── ChatLogics.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── .env.example               # Environment variables template
├── .gitignore
├── package.json               # Root package.json
├── RENDER_DEPLOYMENT.md       # Deployment guide
└── README.md                  # This file
```

---

## 🚧 Challenges & Solutions

### 1. **Real-time Message Synchronization**

**Challenge:** Ensuring messages are delivered instantly across all connected clients without polling.

**Solution:**

- Implemented Socket.IO for bidirectional real-time communication
- Created event handlers for `new message`, `message received`, and `typing` events
- Used React Context API to manage socket connections globally

### 2. **Read Receipts Implementation**

**Challenge:** Tracking which users have read messages in group chats and one-on-one conversations.

**Solution:**

- Added `readBy` array field to message schema
- Implemented `markMessagesAsRead` API endpoint
- Created Socket.IO event `messages read` to broadcast read status in real-time
- Display read receipts with blue double ticks (similar to WhatsApp)

### 3. **User Presence (Online/Offline Status)**

**Challenge:** Showing real-time online/offline status of users.

**Solution:**

- Created `onlineUsers` Map on the server to track connected users
- Implemented `setup` socket event to register users when they connect
- Added `get online status` socket event for clients to query status
- Broadcast `user online` and `user offline` events on connection/disconnection

### 4. **CORS Configuration & Proxy Setup**

**Challenge:** Handling API requests between frontend and backend in development and production.

**Solution:**

- **Development**: Configured proxy in `frontend/package.json` (`"proxy": "http://127.0.0.1:5000"`) to automatically forward API requests from frontend (port 3000) to backend (port 5000)
- **Production**: Configured Express CORS middleware with function-based origin checking for separate deployments
- Enabled credentials for authenticated requests
- Configured Socket.IO CORS to match Express settings
- In production single deployment, backend serves static files directly (no CORS needed)

### 5. **Render.com Cold Starts**

**Challenge:** Free tier services on Render spin down after 15 minutes of inactivity, causing slow first requests.

**Solution:**

- Created `/health` endpoint for keep-alive pings
- Implemented frontend keep-alive service that pings server every 5 minutes
- Documented external ping services (UptimeRobot) for 24/7 uptime

### 6. **Message Deletion (Soft Delete)**

**Challenge:** Implementing message deletion that works across all clients in real-time.

**Solution:**

- Added `deleted` boolean field to message schema
- Created `deleteMessage` API endpoint with authorization checks
- Implemented Socket.IO `message deleted` event for real-time updates
- Updated UI to show "This message was deleted" for deleted messages

### 7. **State Management Complexity**

**Challenge:** Managing complex state across multiple components (chats, messages, notifications, online users).

**Solution:**

- Created `ChatProvider` context for global state management
- Used `useCallback` and `useMemo` to optimize re-renders
- Separated concerns with dedicated state hooks

### 8. **Text Wrapping in Messages**

**Challenge:** Messages displaying incorrectly with line breaks and spacing issues.

**Solution:**

- Normalized message content by replacing newlines with spaces
- Collapsed multiple spaces into single spaces
- Set proper CSS `white-space` properties for natural text wrapping

---

## 🤖 AI Tools Used

This project was developed with assistance from AI tools to accelerate development and solve complex problems:

### **Cursor AI** (Primary)

- **Code Generation**: Generated boilerplate code for components, routes, and controllers
- **Debugging**: Helped identify and fix bugs in Socket.IO connections and state management
- **Refactoring**: Suggested improvements for code structure and performance optimization
- **Documentation**: Assisted in writing clear code comments and documentation

### **How AI Was Used:**

1. **Initial Setup**: Generated project structure and configuration files
2. **Feature Implementation**: Created Socket.IO event handlers and real-time features
3. **Bug Fixes**: Identified issues with CORS, authentication, and state management
4. **Code Optimization**: Suggested React hooks optimization and performance improvements
5. **Documentation**: Helped write API documentation and deployment guides

### **Benefits:**

- ⚡ Faster development cycle
- 🐛 Reduced debugging time
- 📚 Better code quality and best practices
- 🎯 Focus on problem-solving rather than boilerplate

---

## 🚀 Deployment

### Deploying to Render.com

#### Prerequisites

- Render.com account
- MongoDB Atlas account
- GitHub repository

#### Steps

1. **Create a New Web Service on Render**

   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Build Settings**

   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

3. **Set Environment Variables**

   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Deploy**

   - Click "Create Web Service"
   - Wait for deployment to complete

5. **Prevent Cold Starts** (Optional)
   - Use UptimeRobot or similar service to ping `/health` every 5 minutes
   - Or the built-in keep-alive service will work when users are active

### Alternative Deployment Platforms

- **Vercel**: For frontend (requires separate backend deployment)
- **Railway**: Similar to Render, supports full-stack
- **Netlify**: For frontend, with serverless functions
- **Heroku**: Classic PaaS option

See `RENDER_DEPLOYMENT.md` for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Piyush Gupta**

- GitHub: [@Piyush-t24](https://github.com/Piyush-t24)
- Email: [23it3031@rgipt.ac.in]

---

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [React](https://reactjs.org/) for the amazing UI library
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [Render](https://render.com/) for hosting platform

---

## 🎥 Video Walkthrough

Watch the video walkthrough to see Emitly in action:

[![Loom Video Walkthrough](https://img.shields.io/badge/Loom-Video%20Walkthrough-FF00CC?logo=loom&logoColor=white)](https://loom.com/share/your-video-id-here)

> **Note:** Video link will be added soon. Check back later for a detailed walkthrough of the application features and functionality.

---

<div align="center">

**Made with ❤️ using React, Node.js, and Socket.IO**

⭐ Star this repo if you found it helpful!

</div>
