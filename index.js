#!/usr/bin/env node

/**
 * Chat Application Entry Point (Backward Compatibility)
 * 
 * This file maintains backward compatibility for existing deployments
 * that might still reference the old index.js location.
 * 
 * The actual server code has been moved to src/server/index.js
 */

console.log('🔄 Starting Chat Application...');
console.log('📁 Using new organized file structure');

// Import and start the server from new location
require('./src/server/index.js');
