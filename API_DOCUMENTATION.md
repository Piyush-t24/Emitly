# 📡 API Documentation

## Base URL

- **Development**:
  - Backend: `http://localhost:5000/api`
  - Frontend (with proxy): `/api` (automatically proxied to `http://localhost:5000/api`)
- **Production**: `https://emitly.onrender.com/api`

**Note:** In development, the frontend uses a proxy configured in `frontend/package.json` that forwards all `/api/*` requests to `http://127.0.0.1:5000/api`. This means you can use relative URLs like `/api/user` in your frontend code, and they'll be automatically forwarded to the backend.

## Authentication

Most endpoints require JWT authentication. Include the token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

## User Endpoints

### Register User

```http
POST /api/user
Content-Type: application/json

{
  "name": "Piyush Gupta",
  "email": "piyush@example.com",
  "password": "123456",
  "pic": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
}
```

**Response:**

```json
{
    "_id":{"$oid":"683747196e942955703e72ea"},
    "name":"Piyush Gupta",
    "email":"piyush@example.com",
    "password":"123456",
    "pic":"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    "createdAt":{"$date":{"$numberLong":"1748453145755"}},
    "updatedAt":{"$date":{"$numberLong":"1748453145755"},"__v":{"$numberInt":"0"}
}
```

### Login User

```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get All Users

```http
GET /api/user
Authorization: Bearer <token>
```

## Chat Endpoints

### Access/Create Chat

```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "other_user_id"
}
```

### Get All Chats

```http
GET /api/chat
Authorization: Bearer <token>
```

### Create Group Chat

```http
POST /api/chat/group
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Group",
  "users": ["user_id_1", "user_id_2"]
}
```

### Rename Group

```http
PUT /api/chat/rename
Authorization: Bearer <token>
Content-Type: application/json

{
  "chatId": "chat_id",
  "chatName": "New Group Name"
}
```

### Add User to Group

```http
PUT /api/chat/groupadd
Authorization: Bearer <token>
Content-Type: application/json

{
  "chatId": "chat_id",
  "userId": "user_id_to_add"
}
```

### Remove User from Group

```http
PUT /api/chat/groupremove
Authorization: Bearer <token>
Content-Type: application/json

{
  "chatId": "chat_id",
  "userId": "user_id_to_remove"
}
```

## Message Endpoints

### Get All Messages

```http
GET /api/message/:chatId
Authorization: Bearer <token>
```

### Send Message

```http
POST /api/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello!",
  "chatId": "chat_id"
}
```

### Mark Messages as Read

```http
PUT /api/message/read/:chatId
Authorization: Bearer <token>
```

### Delete Message

```http
DELETE /api/message/delete/:messageId
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": {
    "_id": "message_id",
    "sender": {...},
    "content": "This message was deleted",
    "deleted": true,
    "chat": {...}
  }
}
```

## Notification Endpoints

### Get All Notifications

```http
GET /api/notification
Authorization: Bearer <token>
```

## Health Check

### Server Status

```http
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345.67
}
```

## Socket.IO Events

### Client → Server Events

#### Setup Connection

```javascript
socket.emit("setup", userData);
```

Establishes connection and registers user as online.

#### Join Chat

```javascript
socket.emit("join chat", chatId);
```

Joins a specific chat room.

#### Send Message

```javascript
socket.emit("new message", newMessage);
```

Sends a new message to the chat.

#### Typing

```javascript
socket.emit("typing", chatId);
```

Indicates user is typing in a chat.

#### Stop Typing

```javascript
socket.emit("stop typing", chatId);
```

Indicates user stopped typing.

#### Delete Message

```javascript
socket.emit("delete message", deletedMessage);
```

Notifies other users that a message was deleted.

#### Get Online Status

```javascript
socket.emit("get online status", userId, (status) => {
  // Handle status callback
});
```

Queries online status for a specific user.

### Server → Client Events

#### Message Received

```javascript
socket.on("message recieved", (newMessage) => {
  // Handle new message
});
```

#### Messages Read

```javascript
socket.on("messages read", (chatId) => {
  // Handle read receipt update
});
```

#### Message Deleted

```javascript
socket.on("message deleted", (deletedMessage) => {
  // Handle message deletion
});
```

#### Typing Indicator

```javascript
socket.on("typing", (chatId) => {
  // Show typing indicator
});
```

#### Stop Typing Indicator

```javascript
socket.on("stop typing", (chatId) => {
  // Hide typing indicator
});
```

#### User Online

```javascript
socket.on("user online", (userId) => {
  // Update user online status
});
```

#### User Offline

```javascript
socket.on("user offline", (userId) => {
  // Update user offline status
});
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error message here"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
