const express = require('express');
const router = express.Router();
const vmwareController = require('../controllers/vmwareController');

// Define routes
router.post('/start', vmwareController.startVM);
router.post('/stop', vmwareController.stopVM);
router.get('/status', vmwareController.getVMStatus);
router.get('/', vmwareController.getAllVMs);

module.exports = router; 