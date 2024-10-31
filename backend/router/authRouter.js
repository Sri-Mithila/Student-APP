const express = require('express');
const { login, logout, checkAuth } = require('../controller/authController'); 
const router = express.Router();

router.post('/login', login); 
router.post('/logout', logout);
router.get('/check-auth', checkAuth)

module.exports = router;
