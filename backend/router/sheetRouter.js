const { createFolderStructure, createSpreadsheet } = require('../controller/driveController');
const { isOAuthAuthenticated } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();

router.post('/create', isOAuthAuthenticated, createSpreadsheet);


module.exports = router;