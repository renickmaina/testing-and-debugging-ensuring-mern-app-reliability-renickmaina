import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BugItem from '../../components/BugItem';

// Mock window.confirm
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

describe('BugItem Component', () => {
  const mockBug = {
    _id: '1',
    title: 'Test Bug',
    description: 'Test bug description',
    status: 'open',
    priority: 'medium'
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  it('renders bug information correctly', () => {
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Test Bug')).toBeInTheDocument();
    expect(screen.getByText('Test bug description')).toBeInTheDocument();
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('shows correct buttons for open status', () => {
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    expect(screen.getByRole('button', { name: /mark resolved/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start progress/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onUpdate when status buttons are clicked', async () => {
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /mark resolved/i }));
    });

    expect(mockOnUpdate).toHaveBeenCalledWith('1', { status: 'resolved' });
  });

  it('calls onDelete with confirmation', async () => {
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    });

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this bug?');
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('does not call onDelete when confirmation is cancelled', async () => {
    mockConfirm.mockReturnValue(false);
    
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    });

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});