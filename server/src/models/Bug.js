const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'in-progress', 'resolved'],
      message: 'Status must be either open, in-progress, or resolved'
    },
    default: 'open'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be either low, medium, or high'
    },
    default: 'medium'
  },
  // Remove the author reference for now to simplify
  // author: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  // Add these fields for tracking
  reportedBy: {
    type: String,
    default: 'Anonymous'
  },
  stepsToReproduce: {
    type: String,
    trim: true
  },
  expectedBehavior: {
    type: String,
    trim: true
  },
  actualBehavior: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
bugSchema.index({ status: 1 });
bugSchema.index({ priority: 1 });
bugSchema.index({ createdAt: -1 });

// Static method to get bugs by status
bugSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

// Instance method to mark as resolved
bugSchema.methods.markAsResolved = function() {
  this.status = 'resolved';
  return this.save();
};

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;