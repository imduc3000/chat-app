/**
 * Server Entry Point
 * Starts the chat application server
 * 
 * @author Chat App Team
 * @version 1.0.0
 */

const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;

/**
 * Start the server
 */
function startServer() {
    const { server } = createApp();
    
    server.listen(PORT, () => {
        console.log(`🚀 Chat Server running on port ${PORT}`);
        console.log(`📝 Access application: http://localhost:${PORT}`);
        console.log(`💬 Chat interface: http://localhost:${PORT}/chat`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
        console.log('📴 SIGTERM received, shutting down gracefully');
        server.close(() => {
            console.log('👋 Process terminated');
        });
    });
}

// Start server if this file is run directly
if (require.main === module) {
    startServer();
}

module.exports = { startServer };