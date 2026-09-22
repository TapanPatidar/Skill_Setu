import express from 'express';
import {
  submitApplication,
  getMyApplications,
  getOpportunityApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('student'), submitApplication);
router.get('/mine', protect, authorizeRoles('student'), getMyApplications);
router.get('/opportunity/:id', protect, authorizeRoles('industry', 'institution'), getOpportunityApplications);
router.patch('/:id/status', protect, authorizeRoles('industry', 'institution'), updateApplicationStatus);

export default router;
