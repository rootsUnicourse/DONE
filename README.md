# VM Management Dashboard

This project provides a dashboard for managing virtual machines with file sharing capabilities.

## Project Structure

- `done_client/` - React application for the VM management dashboard
- `server/` - Node.js server for shared folder functionality

## Features

- VM monitoring with on/off toggle controls
- VM testing suite with various diagnostic options
- Shared folder with real-time file synchronization across VMs
- File upload, download, and management capabilities

## Setup Instructions

### 1. Start the Server

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Start the server
npm start
```

The server will create a `shared_folder` directory that is monitored for changes.

### 2. Start the React Client

```bash
# Navigate to the client directory
cd done_client

# Install dependencies
npm install

# Start the development server
npm start
```

The React application should be available at http://localhost:3000

## Component Overview

### Virtual Machines

Displays a row of VM screens with toggle switches to turn them on and off.

### Testing Suite

Provides various testing options for the VMs including network scanning, security checks, performance tests, and diagnostics.

### Shared Folder

Connects to the Node.js server to show files that are shared across all VMs. Allows uploading, downloading, and deleting files.

## Development

This project uses:

- React for the frontend
- Express.js for the backend server
- Chokidar for file system monitoring
- React Router for navigation

## License

MIT