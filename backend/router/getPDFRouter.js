const express = require('express');
const router = express.Router();
const { isOauthAuthenicated } = require('../middlewares/authMiddleware');
const { generateMultiplePDFs, generateSinglePDF } = require('../controller/getPDFController');

router.post('/generatepdf', generateSinglePDF);
router.post('/generatepdfs', generateMultiplePDFs);

module.exports = router;
