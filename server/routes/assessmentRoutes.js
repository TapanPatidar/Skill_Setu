import express from 'express';
import { getAssessmentQuestions, submitAssessment } from '../controllers/assessmentController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/questions', protect, getAssessmentQuestions);
router.post('/submit', protect, authorizeRoles('student'), submitAssessment);

export default router;
