import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, institution, skills, interests, profile } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendResponse(res, 400, false, null, 'User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      institution: institution || null,
      skills: skills || [],
      interests: interests || [],
      profile: profile || {},
    });

    const token = generateToken(user._id, user.role);

    // Return sanitized user object
    const userObj = user.toObject();
    delete userObj.password;

    return sendResponse(
      res,
      201,
      true,
      {
        user: userObj,
        token,
      },
      'User registered successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, null, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password').populate('institution');

    if (!user) {
      return sendResponse(res, 401, false, null, 'Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, false, null, 'Invalid credentials');
    }

    const token = generateToken(user._id, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    return sendResponse(
      res,
      200,
      true,
      {
        user: userObj,
        token,
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('institution');
    return sendResponse(res, 200, true, user, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
};
