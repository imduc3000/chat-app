/**
 * Route Configuration
 * Centralized route setup for Express application
 * 
 * @author Chat App Team
 * @version 1.0.0
 */

const path = require('path');
const { fileUploadHandler } = require('./fileUpload');

/**
 * Setup all routes for the Express application
 * @param {Object} app - Express application instance
 */
function setupRoutes(app) {
    // Main pages
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/pages/index.html'));
    });

    app.get('/chat', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/pages/chat.html'));
    });

    // API routes
    app.use('/api', require('./api'));

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ 
            status: 'healthy', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    });

    // 404 handler
    app.use('*', (req, res) => {
        res.status(404).json({ 
            error: 'Route not found',
            path: req.originalUrl 
        });
    });
}

module.exports = { setupRoutes };