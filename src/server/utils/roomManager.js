/**
 * Room Management Utilities
 * Handles user rooms, member tracking, and room lifecycle
 * 
 * @author Chat App Team
 * @version 1.0.0
 */

class RoomManager {
    constructor() {
        // Store for user preferences, room members and chat history
        this.userPreferences = new Map(); // socketId -> { name, room, mutedAll, notificationsEnabled }
        this.roomMembers = new Map(); // room -> Set of user names
        this.chatHistory = new Map(); // room -> Array of messages (max 50 messages per room)
    }

    /**
     * Handle user joining a room
     * @param {Object} socket - Socket instance
     * @param {string} name - User name
     * @param {string} room - Room ID
     * @param {Object} io - Socket.IO server instance
     */
    async handleUserJoin(socket, name, room, io) {
        // If user was in another room, clean up old room first
        const oldUserPref = this.userPreferences.get(socket.id);
        if (oldUserPref && oldUserPref.room !== room) {
            await this.handleRoomSwitch(socket, oldUserPref, io);
        }
        
        socket.join(room);
        socket.name = name;
        socket.room = room;
        
        // Initialize user preferences
        this.userPreferences.set(socket.id, {
            name,
            room,
            mutedAll: false,
            notificationsEnabled: true
        });
        
        // Add user to room members
        if (!this.roomMembers.has(room)) {
            this.roomMembers.set(room, new Set());
        }
        this.roomMembers.get(room).add(name);
        
        console.log(`👤 ${name} joined room: ${room}`);
        
        // Send current room members to new user
        const members = Array.from(this.roomMembers.get(room));
        socket.emit('room-members', members);
        
        // Send chat history to new user
        if (this.chatHistory.has(room)) {
            const history = this.chatHistory.get(room);
            history.forEach(msg => {
                socket.emit('user-chat', { ...msg, isHistorical: true });
            });
        }
        
        // Notify other users in room
        socket.to(room).emit('user-chat', {
            name: 'System',
            message: `${name} đã tham gia phòng`
        });
        
        // Update member list for all users in room
        io.to(room).emit('room-members', members);
    }

    /**
     * Handle user switching rooms
     * @param {Object} socket - Socket instance
     * @param {Object} oldUserPref - Previous user preferences
     * @param {Object} io - Socket.IO server instance
     */
    async handleRoomSwitch(socket, oldUserPref, io) {
        const { room: oldRoom, name: oldName } = oldUserPref;
        
        if (this.roomMembers.has(oldRoom)) {
            this.roomMembers.get(oldRoom).delete(oldName);
            
            // Check if old room is now empty
            const remainingInOldRoom = Array.from(this.roomMembers.get(oldRoom));
            if (remainingInOldRoom.length === 0) {
                console.log(`🧹 Room ${oldRoom} is now empty. Cleaning up room data...`);
                this.roomMembers.delete(oldRoom);
                this.chatHistory.delete(oldRoom);
            } else {
                // Notify old room about user leaving
                io.to(oldRoom).emit('user-chat', {
                    name: 'System',
                    message: `${oldName} đã rời phòng`
                });
                io.to(oldRoom).emit('room-members', remainingInOldRoom);
            }
        }
    }

    /**
     * Handle user disconnection
     * @param {Object} socket - Socket instance
     * @param {Object} io - Socket.IO server instance
     */
    handleUserDisconnect(socket, io) {
        const userPref = this.userPreferences.get(socket.id);
        if (userPref) {
            const { name, room } = userPref;
            
            if (this.roomMembers.has(room)) {
                this.roomMembers.get(room).delete(name);
                
                const remainingMembers = Array.from(this.roomMembers.get(room));
                if (remainingMembers.length === 0) {
                    console.log(`🧹 Room ${room} is now empty after disconnect. Cleaning up...`);
                    this.roomMembers.delete(room);
                    this.chatHistory.delete(room);
                } else {
                    socket.to(room).emit('user-chat', {
                        name: 'System',
                        message: `${name} đã rời phòng`
                    });
                    io.to(room).emit('room-members', remainingMembers);
                }
            }
            
            this.userPreferences.delete(socket.id);
        }
    }

    /**
     * Update user preferences
     * @param {string} socketId - Socket ID
     * @param {Object} preferences - User preferences
     */
    updateUserPreferences(socketId, preferences) {
        const currentPrefs = this.userPreferences.get(socketId);
        if (currentPrefs) {
            this.userPreferences.set(socketId, { ...currentPrefs, ...preferences });
        }
    }

    /**
     * Add message to room history
     * @param {string} room - Room ID
     * @param {Object} message - Message object
     */
    addToRoomHistory(room, message) {
        if (!this.chatHistory.has(room)) {
            this.chatHistory.set(room, []);
        }
        
        const roomHistory = this.chatHistory.get(room);
        roomHistory.push(message);
        
        // Keep only last 50 messages
        if (roomHistory.length > 50) {
            roomHistory.shift();
        }
    }

    /**
     * Get room members
     * @param {string} room - Room ID
     * @returns {Array} Array of member names
     */
    getRoomMembers(room) {
        return this.roomMembers.has(room) ? Array.from(this.roomMembers.get(room)) : [];
    }
}

module.exports = { RoomManager };