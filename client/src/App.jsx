import React, { useState, useEffect } from 'react';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import Button from './components/Button';
import ErrorBoundary from './components/ErrorBoundary';
import { bugService } from './services/api';

function App() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBug, setEditingBug] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Load bugs on component mount
  useEffect(() => {
    loadBugs();
  }, []);

  const loadBugs = async () => {
    try {
      setLoading(true);
      setError(null);
      const bugsData = await bugService.getAllBugs();
      console.log('Loaded bugs:', bugsData);
      // Ensure bugsData is an array
      setBugs(Array.isArray(bugsData) ? bugsData : []);
    } catch (err) {
      console.error('Failed to load bugs:', err);
      setError('Failed to load bugs. Please try again later.');
      setBugs([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBug = async (bugData) => {
    try {
      setFormLoading(true);
      await bugService.createBug(bugData);
      await loadBugs(); // Reload the list
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Failed to create bug:', err);
      setError('Failed to create bug. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateBug = async (bugId, updateData) => {
    try {
      await bugService.updateBug(bugId, updateData);
      await loadBugs(); // Reload the list
      setError(null);
    } catch (err) {
      console.error('Failed to update bug:', err);
      setError('Failed to update bug. Please try again.');
    }
  };

  const handleDeleteBug = async (bugId) => {
    try {
      await bugService.deleteBug(bugId);
      await loadBugs(); // Reload the list
      setError(null);
    } catch (err) {
      console.error('Failed to delete bug:', err);
      setError('Failed to delete bug. Please try again.');
    }
  };

  const handleEditBug = (bug) => {
    setEditingBug(bug);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingBug) {
      await handleUpdateBug(editingBug._id, formData);
    } else {
      await handleCreateBug(formData);
    }
    setEditingBug(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBug(null);
  };

  return (
    <ErrorBoundary>
      <div className="container">
        <header style={{ marginBottom: '30px' }}>
          <h1>🐛 Bug Tracker</h1>
          <p>Track and manage software bugs efficiently</p>
        </header>

        {error && (
          <div className="error-message" style={{ marginBottom: '20px', padding: '10px', background: '#ffebee' }}>
            {error}
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => setError(null)}
              style={{ marginLeft: '10px' }}
            >
              Dismiss
            </Button>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          {!showForm ? (
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => setShowForm(true)}
            >
              Report New Bug
            </Button>
          ) : (
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h2>{editingBug ? 'Edit Bug' : 'Report New Bug'}</h2>
              <BugForm
                bug={editingBug}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
                isLoading={formLoading}
              />
            </div>
          )}
        </div>

        <main>
          <h2>Reported Bugs</h2>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={loadBugs}
            disabled={loading}
            style={{ marginBottom: '15px' }}
          >
            Refresh
          </Button>
          
          <BugList
            bugs={bugs}
            onUpdate={handleUpdateBug}
            onDelete={handleDeleteBug}
            isLoading={loading}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;