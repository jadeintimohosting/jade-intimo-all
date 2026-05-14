import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      logger.warn(`authenticateToken: missing token on ${req.method} ${req.originalUrl}`);
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No access token provided',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;

    logger.info(`User authenticated: ${decoded.email} (role=${decoded.role}) on ${req.method} ${req.originalUrl}`);
    next();
  } catch (e) {
    if (e.message === 'Failed to authenticate token') {
      logger.warn(`authenticateToken: invalid/expired token on ${req.method} ${req.originalUrl}`);
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid or expired token',
      });
    }

    logger.error(`authenticateToken unexpected error on ${req.method} ${req.originalUrl}: ${e.message}`, e);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Error during authentication',
    });
  }
};

export const requireRole = allowedRoles => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated',
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(
          `Access denied for user ${req.user.email} with role ${req.user.role}. Required: ${allowedRoles.join(', ')}`
        );
        return res.status(403).json({
          error: 'Access denied',
          message: 'Insufficient permissions',
        });
      }

      next();
    } catch (e) {
      logger.error(`requireRole error on ${req.method} ${req.originalUrl} (user=${req.user?.email}): ${e.message}`, e);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Error during role verification',
      });
    }
  };
};
