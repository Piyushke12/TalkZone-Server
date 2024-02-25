const express = require('express')
const router = express.Router();
const verifyRequest  = require('../middlewares/authMiddleware');
const {createMessage, accessMessages} = require('../controllers/messageController');

router.post('/sendmessage', verifyRequest, createMessage);
router.get('/accessmessage', verifyRequest, accessMessages);

module.exports = router;