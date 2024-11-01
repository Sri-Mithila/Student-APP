const { createFolderStructure, createSpreadsheet } = require('../controller/driveController');
const { isOAuthAuthenticated } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();

router.post('/folder', isOAuthAuthenticated, createFolderStructure);

module.exports = router;