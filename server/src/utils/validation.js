const { body } = require('express-validator');

// Debug logging helper
const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[VALIDATION DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  debugLog('Email validation:', { email, isValid });
  return isValid;
};

// URL validation
const isValidUrl = (url) => {
  try {
    new URL(url);
    debugLog('URL validation: valid', { url });
    return true;
  } catch (error) {
    debugLog('URL validation: invalid', { url, error: error.message });
    return false;
  }
};

// Phone number validation (basic)
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  const isValid = phoneRegex.test(phone);
  
  debugLog('Phone validation:', { phone, isValid });
  return isValid;
};

// Date validation
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  const isValid = date instanceof Date && !isNaN(date);
  
  debugLog('Date validation:', { dateString, isValid });
  return isValid;
};

// Future date validation
const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const isFuture = date > now;
  
  debugLog('Future date validation:', { dateString, isFuture });
  return isFuture;
};

// Past date validation
const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const isPast = date < now;
  
  debugLog('Past date validation:', { dateString, isPast });
  return isPast;
};

// Number range validation
const isInRange = (value, min, max) => {
  const num = Number(value);
  const isValid = !isNaN(num) && num >= min && num <= max;
  
  debugLog('Range validation:', { value, min, max, isValid });
  return isValid;
};

// String length validation
const isValidLength = (str, min, max) => {
  const length = str ? str.length : 0;
  const isValid = length >= min && length <= max;
  
  debugLog('Length validation:', { str: str?.substring(0, 20), min, max, isValid });
  return isValid;
};

// Array validation
const isValidArray = (arr, minLength = 0, maxLength = Infinity) => {
  const isValid = Array.isArray(arr) && 
                 arr.length >= minLength && 
                 arr.length <= maxLength;
  
  debugLog('Array validation:', { 
    isArray: Array.isArray(arr), 
    length: arr?.length, 
    minLength, 
    maxLength, 
    isValid 
  });
  return isValid;
};

// Object validation
const isValidObject = (obj, requiredFields = []) => {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    debugLog('Object validation: not an object', { obj });
    return false;
  }

  const missingFields = requiredFields.filter(field => !(field in obj));
  const isValid = missingFields.length === 0;
  
  debugLog('Object validation:', { 
    hasRequiredFields: isValid, 
    missingFields, 
    isValid 
  });
  return isValid;
};

// Bug priority validation
const isValidPriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  const isValid = validPriorities.includes(priority);
  
  debugLog('Priority validation:', { priority, isValid });
  return isValid;
};

// Bug status validation
const isValidStatus = (status) => {
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  const isValid = validStatuses.includes(status);
  
  debugLog('Status validation:', { status, isValid });
  return isValid;
};

// Environment object validation
const isValidEnvironment = (environment) => {
  if (!environment || typeof environment !== 'object') {
    return false;
  }

  const validFields = ['os', 'browser', 'device', 'version'];
  const hasValidFields = Object.keys(environment).every(key => 
    validFields.includes(key)
  );

  debugLog('Environment validation:', { environment, hasValidFields });
  return hasValidFields;
};

// Comprehensive bug data validation
const validateBugData = (bugData, isUpdate = false) => {
  const errors = [];
  
  debugLog('Starting comprehensive bug validation:', { bugData, isUpdate });

  // For creation, title and description are required
  if (!isUpdate || bugData.title !== undefined) {
    if (!bugData.title || !bugData.title.trim()) {
      errors.push('Title is required');
    } else if (!isValidLength(bugData.title, 3, 100)) {
      errors.push('Title must be between 3 and 100 characters');
    }
  }

  if (!isUpdate || bugData.description !== undefined) {
    if (!bugData.description || !bugData.description.trim()) {
      errors.push('Description is required');
    } else if (!isValidLength(bugData.description, 10, 5000)) {
      errors.push('Description must be at least 10 characters long');
    }
  }

  // Priority validation
  if (bugData.priority !== undefined && !isValidPriority(bugData.priority)) {
    errors.push('Priority must be one of: low, medium, high, critical');
  }

  // Status validation
  if (bugData.status !== undefined && !isValidStatus(bugData.status)) {
    errors.push('Status must be one of: open, in-progress, resolved, closed');
  }

  // Steps to reproduce validation
  if (bugData.stepsToReproduce !== undefined) {
    if (!isValidArray(bugData.stepsToReproduce, 0, 20)) {
      errors.push('Steps to reproduce must be an array with maximum 20 items');
    } else {
      bugData.stepsToReproduce.forEach((step, index) => {
        if (step && !isValidLength(step, 1, 500)) {
          errors.push(`Step ${index + 1} must be between 1 and 500 characters`);
        }
      });
    }
  }

  // Environment validation
  if (bugData.environment !== undefined && !isValidEnvironment(bugData.environment)) {
    errors.push('Environment object contains invalid fields');
  }

  // Tags validation
  if (bugData.tags !== undefined) {
    if (!isValidArray(bugData.tags, 0, 10)) {
      errors.push('Tags must be an array with maximum 10 items');
    } else {
      bugData.tags.forEach((tag, index) => {
        if (tag && !isValidLength(tag, 1, 30)) {
          errors.push(`Tag ${index + 1} must be between 1 and 30 characters`);
        }
      });
    }
  }

  // Due date validation
  if (bugData.dueDate !== undefined && bugData.dueDate !== null) {
    if (!isValidDate(bugData.dueDate)) {
      errors.push('Due date must be a valid date');
    } else if (!isFutureDate(bugData.dueDate)) {
      errors.push('Due date must be in the future');
    }
  }

  debugLog('Comprehensive bug validation result:', { 
    isValid: errors.length === 0, 
    errors 
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// User data validation
const validateUserData = (userData, isUpdate = false) => {
  const errors = [];
  
  debugLog('Starting user data validation:', { userData, isUpdate });

  if (!isUpdate || userData.username !== undefined) {
    if (!userData.username || !userData.username.trim()) {
      errors.push('Username is required');
    } else if (!isValidLength(userData.username, 3, 30)) {
      errors.push('Username must be between 3 and 30 characters');
    }
  }

  if (!isUpdate || userData.email !== undefined) {
    if (!userData.email || !userData.email.trim()) {
      errors.push('Email is required');
    } else if (!isValidEmail(userData.email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!isUpdate || userData.password !== undefined) {
    if (!userData.password) {
      errors.push('Password is required');
    } else if (!isValidLength(userData.password, 6, 100)) {
      errors.push('Password must be at least 6 characters long');
    }
  }

  if (userData.role !== undefined && !['developer', 'tester', 'manager', 'admin'].includes(userData.role)) {
    errors.push('Role must be one of: developer, tester, manager, admin');
  }

  debugLog('User data validation result:', { 
    isValid: errors.length === 0, 
    errors 
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export all validation functions
module.exports = {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  isValidDate,
  isFutureDate,
  isPastDate,
  isInRange,
  isValidLength,
  isValidArray,
  isValidObject,
  isValidPriority,
  isValidStatus,
  isValidEnvironment,
  validateBugData,
  validateUserData
};