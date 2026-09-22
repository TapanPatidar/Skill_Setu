import { PortfolioItem } from '../models/PortfolioItem.js';
import { User } from '../models/User.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc Get public student portfolio (verified & active items)
 * @route GET /api/portfolio/:userId
 * @access Public
 */
export const getPublicPortfolio = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return sendResponse(res, 404, false, null, 'User not found');

    const items = await PortfolioItem.find({ student: req.params.userId })
      .populate('verifiedBy', 'name role')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, { user, items }, 'Public portfolio retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get logged-in student's portfolio items
 * @route GET /api/portfolio
 * @access Private (Student)
 */
export const getMyPortfolio = async (req, res, next) => {
  try {
    const items = await PortfolioItem.find({ student: req.user._id })
      .populate('verifiedBy', 'name role')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, items, 'Your portfolio items');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Add new portfolio item
 * @route POST /api/portfolio
 * @access Private (Student)
 */
export const addPortfolioItem = async (req, res, next) => {
  try {
    const item = await PortfolioItem.create({
      ...req.body,
      student: req.user._id,
      verified: false,
    });

    return sendResponse(res, 201, true, item, 'Portfolio item added successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update portfolio item
 * @route PATCH /api/portfolio/:id
 * @access Private (Student)
 */
export const updatePortfolioItem = async (req, res, next) => {
  try {
    const item = await PortfolioItem.findOne({ _id: req.params.id, student: req.user._id });
    if (!item) return sendResponse(res, 404, false, null, 'Item not found');

    const updated = await PortfolioItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendResponse(res, 200, true, updated, 'Portfolio item updated');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete portfolio item
 * @route DELETE /api/portfolio/:id
 * @access Private (Student)
 */
export const deletePortfolioItem = async (req, res, next) => {
  try {
    const item = await PortfolioItem.findOneAndDelete({ _id: req.params.id, student: req.user._id });
    if (!item) return sendResponse(res, 404, false, null, 'Item not found or unauthorized');

    return sendResponse(res, 200, true, null, 'Portfolio item deleted');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Verify student portfolio item (Academician, Industry, Institution)
 * @route PATCH /api/portfolio/:id/verify
 * @access Private (Academician, Industry, Institution)
 */
export const verifyPortfolioItem = async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      return sendResponse(res, 403, false, null, 'Students cannot self-verify portfolio items');
    }

    const item = await PortfolioItem.findById(req.params.id);
    if (!item) return sendResponse(res, 404, false, null, 'Portfolio item not found');

    item.verified = true;
    item.verifiedBy = req.user._id;
    item.verifiedRole = req.user.role;
    item.verifiedAt = new Date();

    await item.save();
    return sendResponse(res, 200, true, item, `Portfolio item verified by ${req.user.name} (${req.user.role})`);
  } catch (error) {
    next(error);
  }
};
