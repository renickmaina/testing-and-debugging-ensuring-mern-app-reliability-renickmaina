const jwt = require('jsonwebtoken');

// Debug logging helper
const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUTH DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

// Generate JWT token
const generateToken = (user) => {
  debugLog('Generating token for user:', { userId: user._id, username: user.username });
  
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret-key', {
    expiresIn: '7d'
  });

  debugLog('Token generated successfully');
  return token;
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    debugLog('Verifying token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    debugLog('Token verified successfully', { userId: decoded.userId });
    return decoded;
  } catch (error) {
    debugLog('Token verification failed', { error: error.message });
    throw new Error('Invalid token');
  }
};

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  try {
    debugLog('Authenticating request', { headers: req.headers });
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      debugLog('No token provided');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    debugLog('Authentication successful', { user: decoded });
    next();
  } catch (error) {
    debugLog('Authentication failed', { error: error.message });
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  debugLog
};