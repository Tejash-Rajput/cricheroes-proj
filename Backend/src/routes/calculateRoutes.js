const express = require('express');
const router = express.Router();
const calculateController = require('../controllers/calculateController');
const { validateCalculateRequest } = require('../middleware/validateCalculate');

router.post('/', validateCalculateRequest, calculateController.calculatePerformance);

module.exports = router;
