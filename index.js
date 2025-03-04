const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Phục vụ các file tĩnh
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
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
});

// Thêm cổng động cho Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

