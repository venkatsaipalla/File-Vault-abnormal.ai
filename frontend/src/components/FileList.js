import React from 'react';
import { downloadFile } from '../services/api';
import './FileList.css';

const FileList = ({ files, loading, onRefresh }) => {
  const handleDownload = async (file) => {
    try {
      await downloadFile(file.id, file.name);
    } catch (error) {
      alert('Error downloading file');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="file-list">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading files...</p>
        </div>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="file-list">
        <div className="empty-state">
          <span className="empty-icon">📁</span>
          <p>No files found. Upload a file to get started!</p>
          <button onClick={onRefresh} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="file-list">
      <div className="list-header">
        <h2>Files ({files.length})</h2>
        <button onClick={onRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="files-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Type</th>
              <th>Upload Count</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className={file.upload_count > 1 ? 'duplicate' : ''}>
                <td className="file-name" title={file.name}>
                  {file.name}
                  {file.upload_count > 1 && (
                    <span className="duplicate-badge" title="This file has duplicates">
                      🔄
                    </span>
                  )}
                </td>
                <td>{formatFileSize(file.file_size)}</td>
                <td className="mime-type">{file.mime_type || 'Unknown'}</td>
                <td>
                  <span className={`upload-count ${file.upload_count > 1 ? 'highlight' : ''}`}>
                    {file.upload_count}
                  </span>
                </td>
                <td>{formatDate(file.uploaded_at)}</td>
                <td>
                  <button
                    onClick={() => handleDownload(file)}
                    className="download-btn"
                    title="Download file"
                  >
                    ⬇️ Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList;

