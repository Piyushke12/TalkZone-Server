const express = require('express');
const router = express.Router();
const verifyRequest = require('../middlewares/authMiddleware');
const { accessChat, getAllChats, createGroupChat, leaveGroup } = require('../controllers/chatController');

router.post('/accesschat',verifyRequest,accessChat);
router.get('/getallchat',verifyRequest, getAllChats);
router.post('/creategroupchat',verifyRequest,createGroupChat);
router.post('/leavegroup',verifyRequest,leaveGroup);

module.exports = router;