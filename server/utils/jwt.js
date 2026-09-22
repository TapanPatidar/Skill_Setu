import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'skillsetu_jwt_fallback_secret_ayush_2026';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

/**
 * Generate a signed JWT token
 * @param {string} userId
 * @param {string} role
 * @returns {string}
 */
export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

/**
 * Verify JWT token
 * @param {string} token
 * @returns {any}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
