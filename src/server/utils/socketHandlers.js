/**
 * Socket.IO Event Handlers
 * Centralized WebSocket event handling for real-time chat functionality
 * 
 * @author Chat App Team
 * @version 1.0.0
 */

const { ChatManager } = require('./chatManager');
const { RoomManager } = require('./roomManager');

// Initialize managers
const chatManager = new ChatManager();
const roomManager = new RoomManager();

/**
 * Setup Socket.IO event handlers
 * @param {Object} io - Socket.IO server instance
 */
function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`👤 User connected: ${socket.id}`);

        // Handle room joining
        socket.on('join-room', async ({ name, room }) => {
            try {
                await roomManager.handleUserJoin(socket, name, room, io);
            } catch (error) {
                console.error('❌ Error in join-room:', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // Handle chat messages
        socket.on('on-chat', async ({ name, room, message, replyTo }) => {
            try {
                await chatManager.handleMessage(socket, { name, room, message, replyTo }, io);
            } catch (error) {
                console.error('❌ Error in on-chat:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle file sharing
        socket.on('file-shared', async (fileData) => {
            try {
                await chatManager.handleFileShare(socket, fileData, io);
            } catch (error) {
                console.error('❌ Error in file-shared:', error);
                socket.emit('error', { message: 'Failed to share file' });
            }
        });

        // Handle user preferences
        socket.on('update-preferences', (preferences) => {
            roomManager.updateUserPreferences(socket.id, preferences);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            roomManager.handleUserDisconnect(socket, io);
            console.log(`👋 User disconnected: ${socket.id}`);
        });
    });
}

module.exports = { setupSocketHandlers };