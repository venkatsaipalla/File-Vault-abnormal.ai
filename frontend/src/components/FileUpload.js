import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import './FileUpload.css';

const FileUpload = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const result = await uploadFile(file);
      setMessageType(result.is_duplicate ? 'warning' : 'success');
      setMessage(result.message || (result.is_duplicate 
        ? 'Duplicate file detected! File reference created instead.'
        : 'File uploaded successfully!'));
      
      if (onUpload) {
        onUpload();
      }
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.error || 'Error uploading file. Please try again.');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload File</h2>
      <div className="upload-area">
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          disabled={uploading}
          className="file-input"
        />
        <label htmlFor="file-input" className={`upload-label ${uploading ? 'uploading' : ''}`}>
          {uploading ? (
            <>
              <span className="spinner"></span>
              Uploading...
            </>
          ) : (
            <>
              <span className="upload-icon">📤</span>
              Choose a file or drag and drop
            </>
          )}
        </label>
      </div>
      {message && (
        <div className={`upload-message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

