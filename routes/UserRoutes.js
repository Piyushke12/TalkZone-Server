const express = require('express');
const router = express.Router();
const verifyRequest = require('../middlewares/authMiddleware')
const {authUser, getUser, registerUser}  = require('../controllers/userController')

router.post('/register', registerUser)
router.post('/login',authUser);
router.post('/getuser',verifyRequest, getUser);

module.exports = router;