// BugList.jsx
import React from 'react';
import BugItem from './BugItem';

const BugList = ({ bugs, onUpdate, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner-large"></div>
        <h3 className="loading-title">Loading Bugs</h3>
        <p className="loading-subtitle">Fetching your bug reports...</p>
      </div>
    );
  }

  // Handle cases where bugs might not be an array
  if (!bugs || !Array.isArray(bugs)) {
    console.error('Bugs is not an array:', bugs);
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Oops! Something went wrong</h3>
        <p className="error-description">We couldn't load the bug data. Please refresh the page or try again later.</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          🔄 Refresh Page
        </button>
      </div>
    );
  }

  if (bugs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🐛</div>
        <h3 className="empty-title">No Bugs Found</h3>
        <p className="empty-description">
          Your bug list is empty! Start by reporting the first bug to track issues effectively.
        </p>
        <div className="empty-actions">
          <div className="tip-card">
            <span className="tip-icon">💡</span>
            <span className="tip-text">Great bugs include clear steps to reproduce and expected vs actual behavior</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bug-list-container">
      <div className="bug-list-header">
        <div className="bug-list-stats">
          <span className="stats-badge total">
            📊 Total: <strong>{bugs.length}</strong>
          </span>
          <span className="stats-badge open">
            🔴 Open: <strong>{bugs.filter(bug => bug.status === 'open').length}</strong>
          </span>
          <span className="stats-badge progress">
            🔵 In Progress: <strong>{bugs.filter(bug => bug.status === 'in-progress').length}</strong>
          </span>
          <span className="stats-badge resolved">
            🟢 Resolved: <strong>{bugs.filter(bug => bug.status === 'resolved').length}</strong>
          </span>
        </div>
      </div>
      
      <div className="bug-list">
        {bugs.map(bug => (
          <BugItem
            key={bug._id}
            bug={bug}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      <div className="bug-list-footer">
        <p className="footer-note">
          Showing <strong>{bugs.length}</strong> bug{bugs.length !== 1 ? 's' : ''} • 
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default BugList;