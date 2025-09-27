/**
 * Middleware Configuration
 * Centralized middleware setup for Express application
 * 
 * @author Chat App Team
 * @version 1.0.0
 */

const express = require('express');
const path = require('path');

/**
 * Setup all middleware for the Express application
 * @param {Object} app - Express application instance
 */
function setupMiddleware(app) {
    // Static file serving
    const publicPath = path.join(__dirname, '../../client');
    const uploadsPath = path.join(__dirname, '../../../uploads');
    
    app.use(express.static(publicPath));
    app.use('/uploads', express.static(uploadsPath));
    
    // Body parsing middleware (for future API extensions)
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Security headers
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });

    // Request logging (development)
    if (process.env.NODE_ENV !== 'production') {
        app.use((req, res, next) => {
            console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });
    }
}

module.exports = { setupMiddleware };