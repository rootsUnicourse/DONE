# VM Shared Folder Setup

This component allows you to connect to a real folder on your system that will be shared across VMs.

## Requirements

To get the shared folder functionality working:

1. Node.js (v14+ recommended)
2. npm or yarn package manager

## Setup Instructions

### 1. Install Backend Dependencies

First, create the backend server that will monitor your folder:

```bash
# Copy the server package.json to use
cp server-package.json server/package.json

# Create a directory for the server
mkdir -p server
cd server

# Install dependencies
npm install
```

### 2. Configure Shared Folder Path

Open `server.js` and modify the `SHARED_FOLDER_PATH` variable to point to your desired folder:

```javascript
// Change this to your actual shared folder path
const SHARED_FOLDER_PATH = path.join(__dirname, '../shared_folder');
```

You can use an absolute path if you want to share a specific folder on your system.

### 3. Start the Backend Server

```bash
# Start the server
npm start
```

The server will run on port 3001 by default and will:
- Create the shared folder if it doesn't exist
- Watch for file changes in real-time
- Provide APIs for file upload, download, and deletion

### 4. Start the React App

In a separate terminal:

```bash
# Return to main project directory
cd ..

# Start the React app
npm start
```

## How It Works

- The backend server uses `chokidar` to watch for file system changes
- The frontend polls for updates every 5 seconds
- File operations (upload, delete) are handled by the backend API
- Files are stored in the actual file system

## Troubleshooting

- If you see "Failed to load files" error, make sure the backend server is running
- If uploads fail, check that the server has write permissions to the shared folder
- For CORS errors, ensure the frontend is connecting to the correct API URL (default: http://localhost:3001)

## Customization

You can change the polling interval by modifying the `setInterval` timing in `SharedFolder.jsx`:

```javascript
const intervalId = setInterval(fetchFiles, 5000); // Change 5000 (5 seconds) to your desired interval
``` 