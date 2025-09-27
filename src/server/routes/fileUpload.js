/**
 * File Upload Handler
 * Handles file upload functionality with multer
 * 
 * @author Chat App Team
 * @version 1.0.0
 */

const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Configure multer options
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Add file type validation if needed
        cb(null, true);
    }
});

/**
 * Handle file upload endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadFile = [
    upload.single('file'),
    (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    error: 'No file uploaded',
                    success: false 
                });
            }
            
            const fileInfo = {
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: '/uploads/' + req.file.filename,
                uploadedAt: new Date().toISOString()
            };
            
            console.log(`📁 File uploaded: ${fileInfo.originalname} (${fileInfo.size} bytes)`);
            
            res.json({
                success: true,
                file: fileInfo
            });
            
        } catch (error) {
            console.error('❌ File upload error:', error);
            res.status(500).json({
                error: 'File upload failed',
                success: false
            });
        }
    }
];

module.exports = { uploadFile };