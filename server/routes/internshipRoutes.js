import express from 'express';
import {
  getMyInternships,
  updateInternshipProgress,
  postMentorFeedback,
  completeInternship,
} from '../controllers/internshipController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/mine', protect, getMyInternships);
router.patch('/mine', protect, authorizeRoles('student'), updateInternshipProgress);
router.post('/:id/feedback', protect, authorizeRoles('industry', 'academician'), postMentorFeedback);
router.post('/:id/complete', protect, authorizeRoles('industry', 'institution'), completeInternship);

export default router;
