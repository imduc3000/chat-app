const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Cấu hình multer để xử lý upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Phục vụ các file tĩnh
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

// API xử lý upload file
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileInfo = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: '/uploads/' + req.file.filename
    };
    
    res.json(fileInfo);
});

// Socket.io handlers
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join-room', ({ name, room }) => {
        socket.join(room);
        console.log(`${name} joined room: ${room}`);
        // Thông báo cho phòng có người mới tham gia
        io.to(room).emit('user-chat', { 
            name: 'System', 
            message: `${name} has joined the room` 
        });
    });

    socket.on('on-chat', ({ name, room, message }) => {
        const isCode = message.includes('```');
        const formattedMessage = isCode 
            ? message.replace(/\r\n/g, '\n')
            : message;
        
        io.to(room).emit('user-chat', { name, message: formattedMessage });
    });
    
    // Xử lý file được chia sẻ
    socket.on('file-share', ({ name, room, fileInfo }) => {
        io.to(room).emit('file-shared', { name, fileInfo });
    });
});

// Thêm cổng động cho Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

