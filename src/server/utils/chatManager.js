/**
 * Chat Management Utilities
 * Handles message processing, file sharing, and chat history
 * 
 * @author Chat App Team
 * @version 1.0.0
 */

const { RoomManager } = require('./roomManager');

class ChatManager {
    constructor() {
        // Use singleton pattern for RoomManager
        this.roomManager = new RoomManager();
    }

    /**
     * Handle incoming chat message
     * @param {Object} socket - Socket instance
     * @param {Object} messageData - Message data
     * @param {Object} io - Socket.IO server instance
     */
    async handleMessage(socket, { name, room, message, replyTo }, io) {
        if (!name || !room || !message) {
            console.error('❌ Invalid message data:', { name, room, message });
            return;
        }
        
        const isCode = message.includes('```');
        const formattedMessage = isCode 
            ? message.replace(/\r\n/g, '\n')
            : message;
        
        // Check for mentions (@username)
        const mentionRegex = /@(\w+)/g;
        const mentions = [...formattedMessage.matchAll(mentionRegex)].map(match => match[1]);
        
        // Create message object
        const messageData = { 
            name, 
            message: formattedMessage, 
            mentions: mentions,
            timestamp: new Date().toISOString(),
            replyTo: replyTo || null  // Include reply info if present
        };
        
        // Save message to chat history
        this.roomManager.addToRoomHistory(room, messageData);
        
        console.log(`💬 Message from ${name} in ${room}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
        
        // Emit to all users in room
        io.to(room).emit('user-chat', messageData);
    }

    /**
     * Handle file sharing
     * @param {Object} socket - Socket instance
     * @param {Object} fileData - File data
     * @param {Object} io - Socket.IO server instance
     */
    async handleFileShare(socket, fileData, io) {
        const { name, room, fileInfo } = fileData;
        
        if (!name || !room || !fileInfo) {
            console.error('❌ Invalid file share data:', fileData);
            return;
        }

        // Create file message for history
        const fileMessage = {
            name,
            message: `đã gửi một file: ${fileInfo.originalname}`,
            timestamp: new Date().toISOString(),
            type: 'file',
            fileInfo
        };

        // Save to chat history
        this.roomManager.addToRoomHistory(room, fileMessage);

        console.log(`📁 File shared by ${name} in ${room}: ${fileInfo.originalname}`);

        // Emit file share event to all users in room
        io.to(room).emit('file-shared', {
            name,
            fileInfo,
            timestamp: fileMessage.timestamp
        });
    }

    /**
     * Process message for mentions and special content
     * @param {string} message - Raw message
     * @returns {Object} Processed message data
     */
    processMessage(message) {
        const mentionRegex = /@(\w+)/g;
        const mentions = [...message.matchAll(mentionRegex)].map(match => match[1]);
        
        const isCode = message.includes('```');
        const hasFile = message.includes('[FILE:');
        
        return {
            originalMessage: message,
            mentions,
            isCode,
            hasFile,
            formattedMessage: isCode ? message.replace(/\r\n/g, '\n') : message
        };
    }

    /**
     * Validate message content
     * @param {Object} messageData - Message data to validate
     * @returns {boolean} Validation result
     */
    validateMessage({ name, room, message }) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return false;
        }
        
        if (!room || typeof room !== 'string' || room.trim().length === 0) {
            return false;
        }
        
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return false;
        }
        
        // Additional validation rules can be added here
        if (message.length > 10000) { // Max message length
            return false;
        }
        
        return true;
    }
}

module.exports = { ChatManager };