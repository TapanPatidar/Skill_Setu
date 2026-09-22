import { Notification } from '../models/Notification.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc Get user notifications
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });

    return sendResponse(res, 200, true, { notifications, unreadCount }, 'Notifications retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Mark notification as read
 * @route PATCH /api/notifications/:id/read
 * @access Private
 */
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return sendResponse(res, 404, false, null, 'Notification not found');

    return sendResponse(res, 200, true, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Mark all notifications as read
 * @route PATCH /api/notifications/read-all
 * @access Private
 */
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    return sendResponse(res, 200, true, null, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};
