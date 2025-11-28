// BugForm.jsx
import React, { useState, useEffect } from 'react';
import Button from './Button';

const BugForm = ({ bug, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bug) {
      setFormData({
        title: bug.title || '',
        description: bug.description || '',
        priority: bug.priority || 'medium',
        status: bug.status || 'open'
      });
    }
  }, [bug]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bug-form">
      <div className="form-header">
        <h2 className="form-title">
          {bug ? 'Edit Bug Report' : 'Report New Bug'}
        </h2>
        <div className="form-subtitle">
          {bug ? 'Update the bug details below' : 'Fill in the details to report a new bug'}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          🐛 Bug Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="What's the issue? e.g., Login button not working"
        />
        {errors.title && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {errors.title}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          📝 Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          placeholder="Describe the bug in detail... 
• Steps to reproduce
• Expected behavior  
• Actual behavior
• Screenshots (if any)"
          rows={6}
        />
        {errors.description && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {errors.description}
          </div>
        )}
        <div className="character-count">
          {formData.description.length}/10 min characters
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-half">
          <label htmlFor="priority" className="form-label">
            🚨 Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select"
          >
            <option value="low">🟢 Low - Minor issue</option>
            <option value="medium">🟡 Medium - Normal priority</option>
            <option value="high">🔴 High - Needs attention</option>
          </select>
        </div>

        <div className="form-group form-group-half">
          <label htmlFor="status" className="form-label">
            📊 Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="open">🟠 Open - New issue</option>
            <option value="in-progress">🔵 In Progress - Being worked on</option>
            <option value="resolved">🟢 Resolved - Fixed</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            disabled={isLoading}
            className="cancel-btn"
          >
            ← Cancel
          </Button>
        )}
        
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isLoading}
          className="submit-btn"
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Saving...
            </>
          ) : (
            bug ? '💾 Update Bug' : '🚀 Create Bug'
          )}
        </Button>
      </div>
    </form>
  );
};

export default BugForm;