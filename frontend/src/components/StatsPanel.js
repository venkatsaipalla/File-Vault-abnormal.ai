import React from 'react';
import './StatsPanel.css';

const StatsPanel = ({ stats }) => {
  if (!stats) {
    return (
      <div className="stats-panel">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="stats-panel">
      <h2>📊 Storage Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total_files}</div>
          <div className="stat-label">Total Files</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.unique_files}</div>
          <div className="stat-label">Unique Files</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-value">{stats.duplicate_entries}</div>
          <div className="stat-label">Duplicate Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.total_size_mb} MB</div>
          <div className="stat-label">Total Size</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{stats.space_saved_mb} MB</div>
          <div className="stat-label">Space Saved</div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;

