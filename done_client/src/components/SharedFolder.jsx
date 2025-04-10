import React, { useState, useEffect } from 'react';
import './SharedFolder.css';

const SharedFolder = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);
  
  const API_URL = 'http://localhost:3001/api'; // Updated API URL for the new server

  // Fetch files on component mount and set up polling
  useEffect(() => {
    fetchFiles();
    fetchServerInfo();
    
    // Poll for file changes every 5 seconds
    const intervalId = setInterval(fetchFiles, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchServerInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/server-info`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setServerInfo(data);
    } catch (err) {
      console.error('Failed to fetch server info:', err);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/files`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setFiles(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      setError('Failed to load files. Please check if the server is running.');
      setIsLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'json': return '📄';
      case 'sh': return '📜';
      case 'md': return '📝';
      case 'csv': return '📊';
      case 'txt': return '📄';
      case 'pdf': return '📑';
      case 'img': case 'png': case 'jpg': case 'jpeg': case 'gif': return '🖼️';
      case 'js': case 'jsx': return '📜';
      case 'html': case 'htm': return '🌐';
      case 'css': return '🎨';
      default: return '📁';
    }
  };
  
  const handleFileSelect = (file) => {
    setSelectedFile(selectedFile?.id === file.id ? null : file);
  };
  
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('file-upload');
    if (fileInput.files.length === 0) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    
    try {
      const response = await fetch(`${API_URL}/files/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Fetch the updated file list
      await fetchFiles();
      fileInput.value = '';
    } catch (err) {
      console.error('Failed to upload file:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleFileDelete = async () => {
    if (!selectedFile) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedFile.name}?`)) {
      try {
        const response = await fetch(`${API_URL}/files/${selectedFile.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Update the file list
        await fetchFiles();
        setSelectedFile(null);
      } catch (err) {
        console.error('Failed to delete file:', err);
        setError('Failed to delete file. Please try again.');
      }
    }
  };

  const handleFileDownload = async (file) => {
    try {
      window.open(`${API_URL}/files/download/${file.id}`, '_blank');
    } catch (err) {
      console.error('Failed to download file:', err);
      setError('Failed to download file. Please try again.');
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchFiles();
    fetchServerInfo();
  };
  
  if (error) {
    return (
      <div className="shared-folder-container">
        <div className="folder-header">
          <h3>Shared VM Folder</h3>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRefresh} className="refresh-btn">Try Again</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="shared-folder-container">
      <div className="folder-header">
        <h3>Shared VM Folder</h3>
        <div className="folder-actions">
          <label htmlFor="file-upload" className="upload-btn">
            📤 Upload
            <input 
              type="file" 
              id="file-upload" 
              onChange={handleFileUpload}
              disabled={isUploading || isLoading}
              style={{ display: 'none' }}
            />
          </label>
          
          <button 
            className="action-btn delete-btn" 
            disabled={!selectedFile || isUploading || isLoading}
            onClick={handleFileDelete}
          >
            🗑️ Delete
          </button>
          
          {selectedFile && (
            <button 
              className="action-btn download-btn" 
              onClick={() => handleFileDownload(selectedFile)}
              disabled={isUploading || isLoading}
            >
              ⬇️ Download
            </button>
          )}
        </div>
      </div>
      
      {isUploading && (
        <div className="upload-progress">
          <div className="upload-bar"></div>
          <p>Uploading file...</p>
        </div>
      )}
      
      <div className="files-container">
        <div className="files-header">
          <span className="col-name">Name</span>
          <span className="col-size">Size</span>
          <span className="col-date">Modified</span>
        </div>
        
        {isLoading ? (
          <div className="loading-message">Loading files...</div>
        ) : (
          <div className="files-list">
            {files.length === 0 ? (
              <div className="empty-folder">No files found in the shared folder</div>
            ) : (
              files.map(file => (
                <div 
                  key={file.id} 
                  className={`file-item ${selectedFile?.id === file.id ? 'selected' : ''}`}
                  onClick={() => handleFileSelect(file)}
                  onDoubleClick={() => handleFileDownload(file)}
                >
                  <span className="col-name">
                    <span className="file-icon">{getFileIcon(file.type)}</span>
                    {file.name}
                  </span>
                  <span className="col-size">{file.size}</span>
                  <span className="col-date">{file.dateModified}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <div className="folder-footer">
        <p>
          {serverInfo ? 
            `Connected to shared VM folder • ${files.length} files` : 
            'Connecting to server...'}
        </p>
        <button 
          className="refresh-btn" 
          disabled={isUploading || isLoading}
          onClick={handleRefresh}
          title="Refresh file list"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default SharedFolder; 