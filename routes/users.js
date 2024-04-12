const express = require('express')
const auth = require('../middleware/auth')

const {registerUser, userDetails, loginUser, forgotPassword, updatePassword, newPassword} = require('../controllers/users')
const router = express.Router();

router.get('/auth',auth,userDetails)
router.post('/auth',registerUser)
router.post('/auth/login',loginUser)
router.post('/auth/forget-password',forgotPassword)
router.get('/auth/forget-password/:id/:token', updatePassword)
router.post('/auth/forget-password/:id/:token', newPassword)

module.exports = router