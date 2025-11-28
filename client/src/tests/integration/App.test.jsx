import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../../App';

// Mock the API module before imports
jest.mock('../../services/api', () => {
  const mockBugService = {
    getAllBugs: jest.fn(),
    createBug: jest.fn(),
    updateBug: jest.fn(),
    deleteBug: jest.fn(),
  };
  return { bugService: mockBugService };
});

// Now import the mocked module
import { bugService } from '../../services/api';

describe('App Integration Tests', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Login bug',
      description: 'User cannot login with correct credentials',
      status: 'open',
      priority: 'high'
    },
    {
      _id: '2',
      title: 'UI alignment issue',
      description: 'Buttons are not properly aligned on mobile',
      status: 'in-progress',
      priority: 'medium'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    bugService.getAllBugs.mockResolvedValue(mockBugs);
    bugService.createBug.mockResolvedValue({ ...mockBugs[0], _id: '3' });
    bugService.updateBug.mockResolvedValue({ ...mockBugs[0], status: 'resolved' });
    bugService.deleteBug.mockResolvedValue({});
  });

  it('loads and displays bugs on mount', async () => {
    await act(async () => {
      render(<App />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Login bug')).toBeInTheDocument();
      expect(screen.getByText('UI alignment issue')).toBeInTheDocument();
    });
  });

  it('creates a new bug', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for bugs to load
    await screen.findByText('Login bug');
    
    // Click to show form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /report new bug/i }));
    });
    
    // Fill out the form
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/title/i), { 
        target: { value: 'New integration bug' } 
      });
      fireEvent.change(screen.getByLabelText(/description/i), { 
        target: { value: 'This is a bug found during integration testing' } 
      });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create bug/i }));
    });

    await waitFor(() => {
      expect(bugService.createBug).toHaveBeenCalledWith({
        title: 'New integration bug',
        description: 'This is a bug found during integration testing',
        priority: 'medium',
        status: 'open'
      });
    });
  });

  it('updates bug status', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for bugs to load
    await screen.findByText('Login bug');
    
    // Click mark resolved button
    await act(async () => {
      const resolveButtons = screen.getAllByRole('button', { name: /mark resolved/i });
      fireEvent.click(resolveButtons[0]);
    });

    await waitFor(() => {
      expect(bugService.updateBug).toHaveBeenCalledWith('1', { status: 'resolved' });
    });
  });

    it('handles API errors gracefully', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    bugService.getAllBugs.mockRejectedValue(new Error('API Error'));
    
    await act(async () => {
      render(<App />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load bugs/i)).toBeInTheDocument();
    });

    // Restore console.error
    console.error = originalError;
  });
  });