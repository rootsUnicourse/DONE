const express = require('express');
const router = express.Router();
const vmwareController = require('../controllers/vmwareController');

// Define routes
router.post('/start', vmwareController.startVM);
router.post('/stop', vmwareController.stopVM);
router.get('/status', vmwareController.getVMStatus);
router.get('/', vmwareController.getAllVMs);

// Direct access route for stopping VM through browser URL
router.get('/stop-vm/:vmName', (req, res) => {
  // Create a mock request object with the VM name from the URL parameter
  const mockReq = {
    body: { vmName: req.params.vmName }
  };
  
  // Call the stopVM controller method directly
  vmwareController.stopVM(mockReq, res);
});

module.exports = router; 