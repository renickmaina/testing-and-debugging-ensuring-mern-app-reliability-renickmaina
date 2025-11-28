import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BugForm from '../../components/BugForm';

describe('BugForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with default values', () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toHaveValue('medium');
    expect(screen.getByLabelText(/status/i)).toHaveValue('open');
    expect(screen.getByRole('button', { name: /create bug/i })).toBeInTheDocument();
  });

  it('renders with existing bug data when editing', () => {
    const bug = {
      title: 'Test Bug',
      description: 'Test description',
      priority: 'high',
      status: 'in-progress'
    };

    render(<BugForm bug={bug} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Bug');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Test description');
    expect(screen.getByLabelText(/priority/i)).toHaveValue('high');
    expect(screen.getByLabelText(/status/i)).toHaveValue('in-progress');
    expect(screen.getByRole('button', { name: /update bug/i })).toBeInTheDocument();
  });

  it('validates form fields and shows errors', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /create bug/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    // Fill form
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/title/i), { 
        target: { value: 'Test Bug Title' } 
      });
      fireEvent.change(screen.getByLabelText(/description/i), { 
        target: { value: 'This is a detailed description of the bug' } 
      });
    });
    
    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create bug/i }));
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug Title',
        description: 'This is a detailed description of the bug',
        priority: 'medium',
        status: 'open'
      });
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('disables buttons when loading', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />);
    
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });
});