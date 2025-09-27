# Chat Application

A modern, real-time chat application built with Node.js, Express, and Socket.IO. Features include file sharing, code syntax highlighting, reply functionality, and a terminal-inspired UI.

## 🚀 Features

- **Real-time Messaging**: Instant messaging with Socket.IO
- **File Sharing**: Upload and share files up to 50MB
- **Code Syntax Highlighting**: Support for multiple programming languages
- **Reply Functionality**: Reply to messages with auto-mention
- **Messenger-style Layout**: Modern chat bubble interface
- **Room-based Chat**: Multiple chat rooms with member management
- **Vietnamese Localization**: Fully localized for Vietnamese users
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Technology Stack

- **Backend**: Node.js, Express.js, Socket.IO
- **Frontend**: HTML5, CSS3 (TailwindCSS), Vanilla JavaScript
- **File Processing**: Multer for file uploads
- **Code Highlighting**: Prism.js
- **Real-time Communication**: WebSockets

## 🏗️ Project Structure

```
chat-app/
├── src/
│   ├── server/
│   │   ├── routes/          # API routes and handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/          # Server utilities and managers
│   │   ├── app.js          # Express app configuration
│   │   └── index.js        # Server entry point
│   └── client/
│       ├── pages/          # HTML pages
│       ├── scripts/        # Client-side JavaScript
│       ├── styles/         # CSS stylesheets
│       └── assets/         # Static assets
├── public/                 # Public static files
├── uploads/               # User uploaded files
├── docs/                  # Documentation
└── package.json          # Project dependencies
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - For chat interface: `http://localhost:3000/chat`

## 🎮 Usage

1. **Login**: Enter your name and room ID on the login page
2. **Chat**: Send messages, mention users with @username
3. **Reply**: Hover over messages and click the ↩ button to reply
4. **Share Files**: Click [FILE] button to upload and share files
5. **Share Code**: Use ```language syntax or paste code directly for highlighting

## 🔧 Configuration

- **Port**: Default 3000, configurable via `PORT` environment variable
- **File Upload Limit**: 50MB per file
- **Chat History**: Last 50 messages per room
- **Auto-cleanup**: Empty rooms are automatically cleaned up

## 📝 API Endpoints

- `GET /` - Login page
- `GET /chat` - Chat interface
- `POST /api/upload` - File upload endpoint
- `GET /health` - Health check endpoint

## 🌐 WebSocket Events

- `join-room` - Join a chat room
- `on-chat` - Send chat message
- `file-shared` - Share uploaded file
- `user-chat` - Receive chat message
- `room-members` - Update room member list

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Chat App Team** - Initial work and development

## 🙏 Acknowledgments

- TailwindCSS for the utility-first CSS framework
- Prism.js for code syntax highlighting
- Socket.IO for real-time communication
- Express.js for the web framework