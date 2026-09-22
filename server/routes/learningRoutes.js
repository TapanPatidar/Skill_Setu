import express from 'express';
import {
  getLearningPrograms,
  createLearningProgram,
  enrollInProgram,
  updateProgress,
} from '../controllers/learningController.js';
import { protect, optionalProtect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalProtect, getLearningPrograms);
router.post('/', protect, authorizeRoles('industry', 'institution', 'academician'), createLearningProgram);
router.post('/:id/enroll', protect, authorizeRoles('student'), enrollInProgram);
router.patch('/:id/progress', protect, authorizeRoles('student'), updateProgress);

export default router;
