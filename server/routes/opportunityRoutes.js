import express from 'express';
import {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  getMyOpportunities,
  getOpportunityCandidates,
} from '../controllers/opportunityController.js';
import { protect, optionalProtect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalProtect, getOpportunities);
router.get('/mine', protect, authorizeRoles('industry', 'institution'), getMyOpportunities);
router.get('/:id', optionalProtect, getOpportunityById);
router.post('/', protect, authorizeRoles('industry', 'institution'), createOpportunity);
router.patch('/:id', protect, authorizeRoles('industry', 'institution'), updateOpportunity);
router.get('/:id/candidates', protect, authorizeRoles('industry', 'institution'), getOpportunityCandidates);

export default router;
