/**
 * Standard API response helper
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {boolean} success
 * @param {any} data
 * @param {string} message
 */
export const sendResponse = (res, statusCode = 200, success = true, data = null, message = '') => {
  return res.status(statusCode).json({
    success,
    data,
    message,
  });
};
