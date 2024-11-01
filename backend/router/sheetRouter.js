const {createSpreadsheet } = require('../controller/driveController');
const {insertData, getData, updateData, deleteData} = require('../controller/sheetController');
const { isOAuthAuthenticated } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();

router.post('/create', isOAuthAuthenticated, createSpreadsheet);
router.post('/insert', isOAuthAuthenticated, insertData);
router.post('/getdata', isOAuthAuthenticated, getData);
router.post('/update', isOAuthAuthenticated, updateData);
router.post('/delete', isOAuthAuthenticated, deleteData);

module.exports = router;