const fs = require('fs');
const path = require('path');

// Shared folder path - you can modify this to point to any folder
const SHARED_FOLDER_PATH = path.join(__dirname, '..', 'shared_folder');

// Ensure the shared folder exists
if (!fs.existsSync(SHARED_FOLDER_PATH)) {
  fs.mkdirSync(SHARED_FOLDER_PATH, { recursive: true });
  console.log(`Created shared folder at ${SHARED_FOLDER_PATH}`);
}

// Cache for file information to avoid constant disk reads
let fileCache = [];
let nextId = 1;

// Initialize file cache
function updateFileCache() {
  try {
    const files = fs.readdirSync(SHARED_FOLDER_PATH);
    
    // Create a new cache with updated information
    const newCache = files
      .filter(filename => {
        // Skip hidden files
        return !filename.startsWith('.');
      })
      .map(filename => {
        const filePath = path.join(SHARED_FOLDER_PATH, filename);
        const stats = fs.statSync(filePath);
        
        // Find if file already exists in cache to preserve ID
        const existingFile = fileCache.find(f => f.name === filename);
        
        return {
          id: existingFile ? existingFile.id : nextId++,
          name: filename,
          type: path.extname(filename).slice(1).toLowerCase(),
          size: formatFileSize(stats.size),
          dateModified: new Date(stats.mtime).toLocaleDateString(),
          path: filePath
        };
      });
    
    fileCache = newCache;
    console.log(`Updated file cache: ${fileCache.length} files`);
  } catch (err) {
    console.error('Error updating file cache:', err);
  }
}

// Format file size to human-readable format
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

// Initialize the file cache on startup
updateFileCache();

// Controller methods
const fileController = {
  // Get all files
  getAllFiles: (req, res) => {
    res.json(fileCache);
  },

  // Upload a file
  uploadFile: (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`File uploaded: ${req.file.originalname}`);
    
    // Update the file cache after upload
    updateFileCache();
    
    res.status(201).json({ 
      message: 'File uploaded successfully',
      file: req.file.originalname
    });
  },

  // Delete a file
  deleteFile: (req, res) => {
    const fileId = parseInt(req.params.id);
    const file = fileCache.find(f => f.id === fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    try {
      fs.unlinkSync(file.path);
      console.log(`File deleted: ${file.name}`);
      
      // Update the file cache after deletion
      updateFileCache();
      
      res.json({ message: 'File deleted successfully' });
    } catch (err) {
      console.error('Error deleting file:', err);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  },

  // Download a file
  downloadFile: (req, res) => {
    const fileId = parseInt(req.params.id);
    const file = fileCache.find(f => f.id === fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.download(file.path, file.name, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download file' });
      }
    });
  },

  // Get server info
  getServerInfo: (req, res) => {
    res.json({
      folderPath: SHARED_FOLDER_PATH,
      fileCount: fileCache.length,
      serverTime: new Date().toISOString()
    });
  },

  // Export for use in other modules
  getFilePath: () => SHARED_FOLDER_PATH,
  updateCache: () => updateFileCache()
};

module.exports = fileController; 