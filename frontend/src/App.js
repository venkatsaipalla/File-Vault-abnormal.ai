import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import FileFilters from './components/FileFilters';
import StatsPanel from './components/StatsPanel';
import { getFiles, getStats } from './services/api';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    min_size: '',
    max_size: '',
    mime_type: '',
    date_from: '',
    date_to: '',
    duplicates_only: false,
  });

  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await getFiles(filters);
      setFiles(data.results || data);
    } catch (error) {
      console.error('Error loading files:', error);
      alert('Error loading files. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadFiles();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFileUploaded = () => {
    loadFiles();
    loadStats();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛡️ Abnormal File Vault</h1>
        <p>Secure file hosting with intelligent deduplication</p>
      </header>

      <div className="App-container">
        <StatsPanel stats={stats} />

        <div className="main-content">
          <FileUpload onUpload={handleFileUploaded} />

          <FileFilters
            filters={filters}
            onChange={handleFilterChange}
          />

          <FileList
            files={files}
            loading={loading}
            onRefresh={loadFiles}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

