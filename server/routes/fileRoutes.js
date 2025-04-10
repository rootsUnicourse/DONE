const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');

// Configure file storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileController.getFilePath());
  },
  filename: (req, file, cb) => {
    // Use original filename
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Define routes
router.get('/', fileController.getAllFiles);
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.delete('/:id', fileController.deleteFile);
router.get('/download/:id', fileController.downloadFile);
router.get('/server-info', fileController.getServerInfo);

module.exports = router; 