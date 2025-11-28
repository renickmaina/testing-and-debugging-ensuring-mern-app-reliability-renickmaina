//validation.js
const { body } = require('express-validator');

const validateBug = [
  body('title')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved'])
    .withMessage('Status must be open, in-progress, or resolved')
];

module.exports = {
  validateBug
};