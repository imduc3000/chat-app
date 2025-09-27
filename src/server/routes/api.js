/**
 * API Routes
 * RESTful API endpoints for the chat application
 * 
 * @author Chat App Team
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { uploadFile } = require('./fileUpload');

// File upload endpoint
router.post('/upload', uploadFile);

// Future API endpoints can be added here
// router.get('/rooms', getRooms);
// router.get('/messages/:roomId', getMessages);
// router.delete('/messages/:messageId', deleteMessage);

module.exports = router;