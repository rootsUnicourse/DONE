const express = require('express');
const cors = require('cors');
const chokidar = require('chokidar');
const path = require('path');
const fileController = require('./controllers/fileController');
const fileRoutes = require('./routes/fileRoutes');
const vmwareRoutes = require('./routes/vmwareRoutes');

const app = express();
const PORT = 3001;

// Get the shared folder path from the controller
const SHARED_FOLDER_PATH = fileController.getFilePath();

// Set up chokidar to watch the shared folder for changes
const watcher = chokidar.watch(SHARED_FOLDER_PATH, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// Update cache on file changes
watcher
  .on('add', path => {
    console.log(`File added: ${path}`);
    fileController.updateCache();
  })
  .on('unlink', path => {
    console.log(`File removed: ${path}`);
    fileController.updateCache();
  })
  .on('change', path => {
    console.log(`File changed: ${path}`);
    fileController.updateCache();
  });

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/files', fileRoutes);
app.use('/api/vmware', vmwareRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`=== VM Shared Folder Server ===`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Watching shared folder: ${SHARED_FOLDER_PATH}`);
}); 