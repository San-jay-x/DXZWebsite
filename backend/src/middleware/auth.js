const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware for protecting routes
 * Verifies JWT token and adds user information to request object
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check if still exists and is verified
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }
    
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please verify your email first.'
      });
    }
    
    // Add user info to request object
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token expired.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

/**
 * Optional authentication middleware
 * Does not fail if no token is provided, but verifies token if present
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }
    
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    if (!token) {
      return next();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (user && user.isVerified) {
      req.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified
      };
    }
    
    next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue without user
    next();
  }
};

/**
 * Admin authentication middleware (for future admin features)
 */
const authenticateAdmin = async (req, res, next) => {
  try {
    await authenticate(req, res, () => {
      // Check if user is admin (you can add admin field to User model)
      if (req.user.email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during admin authentication.'
    });
  }
};

module.exports = {
  authenticate,
  optionalAuth,
  authenticateAdmin
};