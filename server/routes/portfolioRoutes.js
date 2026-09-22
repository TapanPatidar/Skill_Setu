import express from 'express';
import {
  getPublicPortfolio,
  getMyPortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  verifyPortfolioItem,
} from '../controllers/portfolioController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId/public', getPublicPortfolio);
router.get('/', protect, authorizeRoles('student'), getMyPortfolio);
router.post('/', protect, authorizeRoles('student'), addPortfolioItem);
router.patch('/:id', protect, authorizeRoles('student'), updatePortfolioItem);
router.delete('/:id', protect, authorizeRoles('student'), deletePortfolioItem);
router.patch('/:id/verify', protect, authorizeRoles('academician', 'industry', 'institution'), verifyPortfolioItem);

export default router;
