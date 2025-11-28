const Bug = require('../models/Bug');

// Get all bugs
const getAllBugs = async (req, res) => {
  try {
    console.log('GET /api/bugs - Fetching all bugs');
    const bugs = await Bug.find().sort({ createdAt: -1 });
    console.log(`Found ${bugs.length} bugs`);
    res.json(bugs);
  } catch (error) {
    console.error('Error fetching bugs:', error);
    res.status(500).json({ error: 'Failed to fetch bugs' });
  }
};

// Get bug by ID
const getBugById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/bugs/${id} - Fetching bug by ID`);
    
    const bug = await Bug.findById(id);
    if (!bug) {
      console.log(`Bug with ID ${id} not found`);
      return res.status(404).json({ error: 'Bug not found' });
    }
    
    res.json(bug);
  } catch (error) {
    console.error('Error fetching bug:', error);
    res.status(500).json({ error: 'Failed to fetch bug' });
  }
};

// Create new bug
const createBug = async (req, res) => {
  try {
    console.log('POST /api/bugs - Creating new bug');
    console.log('Request body:', req.body);

    const { title, description, priority, status } = req.body;

    // Basic validation
    if (!title || !description) {
      return res.status(400).json({ 
        error: 'Title and description are required' 
      });
    }

    const bugData = {
      title,
      description,
      priority: priority || 'medium',
      status: status || 'open'
    };

    const bug = new Bug(bugData);
    await bug.save();
    
    console.log('Bug created successfully:', bug._id);
    res.status(201).json(bug);
  } catch (error) {
    console.error('Error creating bug:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Failed to create bug' });
  }
};

// Update bug
const updateBug = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log(`PUT /api/bugs/${id} - Updating bug`);
    console.log('Update data:', updates);

    // Remove any fields that shouldn't be updated
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const bug = await Bug.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!bug) {
      console.log(`Bug with ID ${id} not found for update`);
      return res.status(404).json({ error: 'Bug not found' });
    }

    console.log('Bug updated successfully:', bug._id);
    res.json(bug);
  } catch (error) {
    console.error('Error updating bug:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Failed to update bug' });
  }
};

// Delete bug
const deleteBug = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /api/bugs/${id} - Deleting bug`);

    const bug = await Bug.findByIdAndDelete(id);
    
    if (!bug) {
      console.log(`Bug with ID ${id} not found for deletion`);
      return res.status(404).json({ error: 'Bug not found' });
    }

    console.log('Bug deleted successfully:', id);
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    console.error('Error deleting bug:', error);
    res.status(500).json({ error: 'Failed to delete bug' });
  }
};

module.exports = {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug
};