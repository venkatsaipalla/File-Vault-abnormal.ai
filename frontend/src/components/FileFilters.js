import React from 'react';
import './FileFilters.css';

const FileFilters = ({ filters, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const clearFilters = () => {
    onChange({
      search: '',
      min_size: '',
      max_size: '',
      mime_type: '',
      date_from: '',
      date_to: '',
      duplicates_only: false,
    });
  };

  return (
    <div className="file-filters">
      <div className="filters-header">
        <h2>Search & Filter</h2>
        <button onClick={clearFilters} className="clear-btn">
          Clear Filters
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Search by Name</label>
          <input
            type="text"
            placeholder="Enter file name..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Min Size (bytes)</label>
          <input
            type="number"
            placeholder="e.g., 1024"
            value={filters.min_size}
            onChange={(e) => handleChange('min_size', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Max Size (bytes)</label>
          <input
            type="number"
            placeholder="e.g., 1048576"
            value={filters.max_size}
            onChange={(e) => handleChange('max_size', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>MIME Type</label>
          <input
            type="text"
            placeholder="e.g., image/png"
            value={filters.mime_type}
            onChange={(e) => handleChange('mime_type', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Date From</label>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => handleChange('date_from', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Date To</label>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => handleChange('date_to', e.target.value)}
          />
        </div>

        <div className="filter-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={filters.duplicates_only}
              onChange={(e) => handleChange('duplicates_only', e.target.checked)}
            />
            Show duplicates only
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileFilters;

