import React, { useState, useEffect } from 'react';
import './SharedFolder.css';

const SharedFolder = () => {
  const [files, setFiles] = useState([
    { id: 1, name: 'config.json', type: 'json', size: '2.3 KB', dateModified: '2023-04-10' },
    { id: 2, name: 'vm-setup.sh', type: 'sh', size: '4.1 KB', dateModified: '2023-04-05' },
    { id: 3, name: 'README.md', type: 'md', size: '1.8 KB', dateModified: '2023-04-02' },
    { id: 4, name: 'data.csv', type: 'csv', size: '8.5 KB', dateModified: '2023-04-08' }
  ]);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'json': return '📄';
      case 'sh': return '📜';
      case 'md': return '📝';
      case 'csv': return '📊';
      case 'txt': return '📄';
      case 'pdf': return '📑';
      case 'img': case 'png': case 'jpg': return '🖼️';
      default: return '📁';
    }
  };
  
  const handleFileSelect = (file) => {
    setSelectedFile(selectedFile?.id === file.id ? null : file);
  };
  
  const handleFileUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const fileInput = document.getElementById('file-upload');
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileType = file.name.split('.').pop();
        
        const newFile = {
          id: files.length + 1,
          name: file.name,
          type: fileType,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          dateModified: new Date().toLocaleDateString('en-US')
        };
        
        setFiles([...files, newFile]);
        fileInput.value = '';
      }
      
      setIsUploading(false);
    }, 1500);
  };
  
  const handleFileDelete = () => {
    if (selectedFile) {
      if (window.confirm(`Are you sure you want to delete ${selectedFile.name}?`)) {
        setFiles(files.filter(file => file.id !== selectedFile.id));
        setSelectedFile(null);
      }
    }
  };
  
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
              disabled={isUploading}
              style={{ display: 'none' }}
            />
          </label>
          
          <button 
            className="action-btn delete-btn" 
            disabled={!selectedFile || isUploading}
            onClick={handleFileDelete}
          >
            🗑️ Delete
          </button>
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
        
        <div className="files-list">
          {files.map(file => (
            <div 
              key={file.id} 
              className={`file-item ${selectedFile?.id === file.id ? 'selected' : ''}`}
              onClick={() => handleFileSelect(file)}
            >
              <span className="col-name">
                <span className="file-icon">{getFileIcon(file.type)}</span>
                {file.name}
              </span>
              <span className="col-size">{file.size}</span>
              <span className="col-date">{file.dateModified}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="folder-footer">
        <p>Connected to shared VM folder • {files.length} files</p>
        <button className="refresh-btn" disabled={isUploading}>🔄 Refresh</button>
      </div>
    </div>
  );
};

export default SharedFolder; 