import express from 'express';
import { getStudentSkillProfile, getSkillGaps, getCareerRecommendations } from '../controllers/skillsController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, authorizeRoles('student'), getStudentSkillProfile);
router.get('/gaps', protect, authorizeRoles('student'), getSkillGaps);
router.get('/recommendations', protect, authorizeRoles('student'), getCareerRecommendations);

export default router;
