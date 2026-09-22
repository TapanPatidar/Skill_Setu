import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { sendResponse } from '../utils/response.js';

/**
 * Protect routes by validating Bearer token
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendResponse(res, 401, false, null, 'Not authorized, token missing');
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendResponse(res, 401, false, null, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, null, 'Not authorized, token invalid or expired');
  }
};

/**
 * Optional protection - attaches user if token is present and valid
 */
export const optionalProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user) req.user = user;
    } catch (e) {
      // ignore token validation errors for optional routes
    }
  }
  next();
};

/**
 * Authorize specific roles
 * @param  {...string} roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        false,
        null,
        `User role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource`
      );
    }
    next();
  };
};
