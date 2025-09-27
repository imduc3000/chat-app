/**
 * Chat Application Server
 * Main Express application setup and configuration
 * 
 * @author Chat App Team
 * @version 1.0.0
 */

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

// Import custom modules
const { setupMiddleware } = require('./middleware');
const { setupRoutes } = require('./routes');
const { setupSocketHandlers } = require('./utils/socketHandlers');
const { ensureDirectories } = require('./utils/fileSystem');

/**
 * Create and configure Express application
 * @returns {Object} Express app instance and HTTP server
 */
function createApp() {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    // Ensure required directories exist
    ensureDirectories();

    // Setup middleware
    setupMiddleware(app);

    // Setup routes
    setupRoutes(app);

    // Setup Socket.IO handlers
    setupSocketHandlers(io);

    return { app, server, io };
}

module.exports = { createApp };