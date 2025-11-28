// BugItem.jsx
import React, { useState } from 'react';
import Button from './Button';

const BugItem = ({ bug, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onUpdate(bug._id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update bug status:', error);
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      setIsUpdating(true);
      try {
        await onDelete(bug._id);
      } catch (error) {
        console.error('Failed to delete bug:', error);
      }
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return '🔴';
      case 'in-progress': return '🔵';
      case 'resolved': return '🟢';
      default: return '⚪';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '💤';
      default: return '⚡';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return priority;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`bug-item ${bug.priority === 'high' ? 'bug-item-critical' : ''}`}>
      <div className="bug-item-header">
        <div className="bug-title-section">
          <h3 className="bug-title">{bug.title}</h3>
          <div className="bug-meta-tags">
            <span className={`status-tag status-${bug.status}`}>
              <span className="status-icon">{getStatusIcon(bug.status)}</span>
              {getStatusLabel(bug.status)}
            </span>
            <span className={`priority-tag priority-${bug.priority}`}>
              <span className="priority-icon">{getPriorityIcon(bug.priority)}</span>
              {getPriorityLabel(bug.priority)}
            </span>
            {bug.createdAt && (
              <span className="date-tag">
                📅 {formatDate(bug.createdAt)}
              </span>
            )}
          </div>
        </div>
        
        <div className="bug-actions">
          {bug.status !== 'resolved' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => handleStatusChange('resolved')}
              disabled={isUpdating}
              className="action-btn"
            >
              {isUpdating ? (
                <>
                  <span className="loading-dots"></span>
                  Updating
                </>
              ) : (
                <>
                  <span className="btn-icon">✅</span>
                  Mark Resolved
                </>
              )}
            </Button>
          )}
          
          {bug.status === 'open' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleStatusChange('in-progress')}
              disabled={isUpdating}
              className="action-btn"
            >
              {isUpdating ? (
                <>
                  <span className="loading-dots"></span>
                  Updating
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Start Progress
                </>
              )}
            </Button>
          )}
          
          <Button
            size="sm"
            variant="danger"
            onClick={handleDelete}
            disabled={isUpdating}
            className="action-btn delete-btn"
          >
            {isUpdating ? (
              <>
                <span className="loading-dots"></span>
                Deleting
              </>
            ) : (
              <>
                <span className="btn-icon">🗑️</span>
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="bug-content">
        <p className="bug-description">{bug.description}</p>
        
        <div className="bug-footer">
          <div className="bug-id">
            <span className="id-label">ID:</span>
            <span className="id-value">{bug._id?.slice(-8)}</span>
          </div>
          
          {isUpdating && (
            <div className="updating-indicator">
              <div className="pulse-dot"></div>
              Updating...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BugItem;