/**
 * File System Utilities
 * Helper functions for file system operations
 * 
 * @author Chat App Team
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

/**
 * Ensure required directories exist
 */
function ensureDirectories() {
    const directories = [
        path.join(__dirname, '../../../uploads'),
        path.join(__dirname, '../../../public')
    ];

    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Created directory: ${dir}`);
        }
    });
}

/**
 * Clean up old uploaded files (optional utility for future use)
 * @param {number} maxAgeInDays - Maximum age in days
 */
function cleanupOldFiles(maxAgeInDays = 7) {
    const uploadsDir = path.join(__dirname, '../../../uploads');
    const now = Date.now();
    const maxAge = maxAgeInDays * 24 * 60 * 60 * 1000; // Convert to milliseconds

    if (!fs.existsSync(uploadsDir)) return;

    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('❌ Error reading uploads directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(uploadsDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;

                if (now - stats.mtime.getTime() > maxAge) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`❌ Error deleting old file ${file}:`, err);
                        } else {
                            console.log(`🗑️ Cleaned up old file: ${file}`);
                        }
                    });
                }
            });
        });
    });
}

module.exports = { ensureDirectories, cleanupOldFiles };