# API Documentation

## Overview

The Chat Application provides RESTful API endpoints and WebSocket events for real-time communication and file sharing.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the application does not require authentication. Users are identified by their chosen username within each chat room.

## HTTP Endpoints

### 1. Pages

#### Get Login Page
```http
GET /
```

**Description**: Serves the login page where users enter their name and room ID.

**Response**: HTML page

---

#### Get Chat Interface
```http
GET /chat
```

**Description**: Serves the main chat interface.

**Response**: HTML page

---

### 2. API Endpoints

#### Upload File
```http
POST /api/upload
```

**Description**: Upload a file to be shared in chat.

**Request**: 
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field

**Response**:
```json
{
  "success": true,
  "file": {
    "filename": "1640995200000-123456789-document.pdf",
    "originalname": "document.pdf",
    "mimetype": "application/pdf",
    "size": 1024000,
    "path": "/uploads/1640995200000-123456789-document.pdf",
    "uploadedAt": "2023-12-31T12:00:00.000Z"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "No file uploaded"
}
```

---

#### Health Check
```http
GET /health
```

**Description**: Check server health status.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2023-12-31T12:00:00.000Z",
  "uptime": 3600.123
}
```

## WebSocket Events

### Client to Server Events

#### Join Room
```javascript
socket.emit('join-room', { name: 'John', room: '123' });
```

**Description**: Join a chat room with a given name and room ID.

**Parameters**:
- `name` (string): User's display name
- `room` (string): Room identifier

---

#### Send Message
```javascript
socket.emit('on-chat', { 
  name: 'John', 
  room: '123', 
  message: 'Hello world!',
  replyTo: { // optional
    username: 'Jane',
    message: 'Original message'
  }
});
```

**Description**: Send a chat message to a room.

**Parameters**:
- `name` (string): Sender's name
- `room` (string): Target room ID
- `message` (string): Message content
- `replyTo` (object, optional): Reply context

---

#### Share File
```javascript
socket.emit('file-shared', {
  name: 'John',
  room: '123',
  fileInfo: {
    filename: 'file123.pdf',
    originalname: 'document.pdf',
    size: 1024000,
    path: '/uploads/file123.pdf'
  }
});
```

**Description**: Share an uploaded file in a room.

**Parameters**:
- `name` (string): Sender's name
- `room` (string): Target room ID
- `fileInfo` (object): File information from upload endpoint

---

### Server to Client Events

#### Room Members Update
```javascript
socket.on('room-members', (members) => {
  console.log('Current members:', members);
});
```

**Description**: Receive updated list of room members.

**Data**: Array of member names

---

#### Receive Message
```javascript
socket.on('user-chat', (messageData) => {
  console.log('New message:', messageData);
});
```

**Description**: Receive a new chat message.

**Data Structure**:
```javascript
{
  name: 'John',
  message: 'Hello world!',
  mentions: ['@Jane'],
  timestamp: '2023-12-31T12:00:00.000Z',
  replyTo: { // if replying
    username: 'Jane',
    message: 'Original message'
  },
  isHistorical: false // true for chat history
}
```

---

#### File Shared
```javascript
socket.on('file-shared', (data) => {
  console.log('File shared:', data);
});
```

**Description**: Receive notification of a shared file.

**Data Structure**:
```javascript
{
  name: 'John',
  fileInfo: {
    filename: 'file123.pdf',
    originalname: 'document.pdf',
    size: 1024000,
    path: '/uploads/file123.pdf'
  },
  timestamp: '2023-12-31T12:00:00.000Z'
}
```

---

#### Error
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

**Description**: Receive error notifications.

**Data Structure**:
```javascript
{
  message: 'Error description'
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## File Upload Constraints

- Maximum file size: 50MB
- No file type restrictions (consider adding for security)
- Files are stored in `/uploads` directory
- Automatic cleanup of old files can be implemented

## Error Codes

- `400`: Bad Request (missing required fields)
- `404`: Route not found
- `500`: Internal server error

## WebSocket Connection

Connect to WebSocket at:
```javascript
const socket = io('http://localhost:3000');
```

The connection will be established automatically when the client loads.