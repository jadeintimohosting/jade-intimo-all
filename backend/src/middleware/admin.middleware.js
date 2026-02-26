import logger from '#config/logger.js';

export const adminRoute = (req,res,next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated',
        });
      }

      if (req.user.role!=="admin") {
        logger.warn(
          `Access denied for user ${req.user.email} with role ${req.user.role}. Required: admin`
        );
        return res.status(403).json({
          error: 'Access denied',
          message: 'Insufficient permissions',
        });
      }

      next();
    } catch (e) {
      logger.error('Role verification error:', e);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Error during role verification',
      });
    }
};