const express = require('express');
const router = express.Router();
const {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug
} = require('../controllers/bugController');

// Get all bugs
router.get('/', getAllBugs);

// Get bug by ID
router.get('/:id', getBugById);

// Create new bug
router.post('/', createBug);

// Update bug
router.put('/:id', updateBug);

// Delete bug
router.delete('/:id', deleteBug);

module.exports = router;