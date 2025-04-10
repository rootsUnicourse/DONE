# VM Shared Folder Server

This server monitors a folder on your file system and makes it accessible to VMs through a REST API.

## Features

- Real-time monitoring of file system changes
- File upload via API
- File download functionality
- File deletion with proper error handling
- CORS enabled for cross-origin requests
- Human-readable file sizes

## Setup Instructions

### 1. Install Dependencies

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install
```

### 2. Configure Shared Folder Path (Optional)

By default, the server creates a `shared_folder` directory inside the server folder. If you want to change this to a different location, open `server.js` and modify the `SHARED_FOLDER_PATH` variable:

```javascript
// Change this to your desired folder path
const SHARED_FOLDER_PATH = path.join(__dirname, 'shared_folder');

// Example: Use an absolute path
// const SHARED_FOLDER_PATH = '/path/to/your/shared/folder';
```

### 3. Start the Server

```bash
# Start the server
npm start

# Or run with automatic restart on file changes
npm run dev
```

The server will run on port 3001 by default. You'll see output like:

```
=== VM Shared Folder Server ===
Server running on http://localhost:3001
Watching shared folder: /path/to/your/shared_folder
```

## API Endpoints

The server provides the following endpoints:

### File Operations

- `GET /api/files` - Get a list of all files
- `POST /api/files/upload` - Upload a file
- `DELETE /api/files/:id` - Delete a file by ID
- `GET /api/files/download/:id` - Download a file by ID
- `GET /api/files/server-info` - Get server information

### VMware Operations

- `POST /api/vmware/start` - Start a VM (requires vmName in request body)
- `POST /api/vmware/stop` - Stop a VM (requires vmName in request body)
- `GET /api/vmware/status` - Get VM status (requires vmName as query parameter)
- `GET /api/vmware` - Get list of all configured VMs

## Client Integration

In your React client, you can connect to this server using the 'SharedFolder' component, which is already configured to use these endpoints.

## Troubleshooting

- **CORS errors**: The server has CORS enabled, but you may need to modify the configuration if your client runs on a different port.
- **Permission errors**: Make sure the server has read/write permissions for the shared folder.
- **Port conflicts**: If port 3001 is already in use, modify the `PORT` constant in `server.js`.

## Security Notes

This server is designed for development and local networks. For production use:

- Add proper authentication
- Use HTTPS
- Implement file type validation
- Add rate limiting for uploads 