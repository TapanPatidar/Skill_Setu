import { TECHNICAL_QUESTIONS_BY_DOMAIN, APTITUDE_QUESTIONS, SOFT_SKILLS_QUESTIONS } from '../seed/questionBank.js';
import { SkillAssessment } from '../models/SkillAssessment.js';
import { SkillProfile } from '../models/SkillProfile.js';
import { User } from '../models/User.js';
import { sendResponse } from '../utils/response.js';
import { calculateSkillGaps } from '../services/matchingService.js';

/**
 * @desc Get assessment questions by domain & subField
 * @route GET /api/assessments/questions
 * @access Private (Student)
 */
export const getAssessmentQuestions = async (req, res, next) => {
  try {
    const { domain = 'Engineering & Technology', subField = 'Computer Science & IT' } = req.query;

    const domainQuestions = TECHNICAL_QUESTIONS_BY_DOMAIN[domain] || TECHNICAL_QUESTIONS_BY_DOMAIN['Engineering & Technology'];

    // Select questions tailored to this subfield or domain
    let technical = domainQuestions.filter((q) => !q.subField || q.subField === subField);
    if (technical.length < 5) {
      technical = domainQuestions.slice(0, 10);
    }

    // Strip out answer key for test security
    const sanitizedTechnical = technical.map(({ correctAnswer, explanation, ...q }) => q);
    const sanitizedAptitude = APTITUDE_QUESTIONS.map(({ correctAnswer, explanation, ...q }) => q);
    const sanitizedSoftSkills = SOFT_SKILLS_QUESTIONS.map(({ correctAnswer, ...q }) => q);

    return sendResponse(
      res,
      200,
      true,
      {
        domain,
        subField,
        sections: [
          {
            id: 'technical',
            title: `${subField || domain} Technical Evaluation`,
            durationMinutes: 20,
            questions: sanitizedTechnical,
          },
          {
            id: 'soft-skills',
            title: 'Professional Scenario & Collaborative Judgment',
            durationMinutes: 10,
            questions: sanitizedSoftSkills,
          },
          {
            id: 'aptitude',
            title: 'Cognitive & Quantitative Aptitude Test',
            durationMinutes: 15,
            questions: sanitizedAptitude,
          },
        ],
      },
      'Assessment questions retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Submit assessment answers and calculate composite scores
 * @route POST /api/assessments/submit
 * @access Private (Student)
 */
export const submitAssessment = async (req, res, next) => {
  try {
    const { domain, subField, technicalAnswers = [], aptitudeAnswers = [], softSkillAnswers = [] } = req.body;
    const studentId = req.user._id;

    const domainPool = TECHNICAL_QUESTIONS_BY_DOMAIN[domain] || TECHNICAL_QUESTIONS_BY_DOMAIN['Engineering & Technology'];

    // Score Technical
    let techCorrect = 0;
    const answeredSkillsGained = [];
    technicalAnswers.forEach((ans) => {
      const qObj = domainPool.find((q) => q.id === ans.id);
      if (qObj && qObj.correctAnswer === ans.selectedOption) {
        techCorrect += 1;
        if (qObj.skill) answeredSkillsGained.push(qObj.skill);
      }
    });
    const technicalScore = technicalAnswers.length > 0 ? Math.round((techCorrect / technicalAnswers.length) * 100) : 75;

    // Score Aptitude
    let aptCorrect = 0;
    aptitudeAnswers.forEach((ans) => {
      const qObj = APTITUDE_QUESTIONS.find((q) => q.id === ans.id);
      if (qObj && qObj.correctAnswer === ans.selectedOption) {
        aptCorrect += 1;
      }
    });
    const aptitudeScore = aptitudeAnswers.length > 0 ? Math.round((aptCorrect / aptitudeAnswers.length) * 100) : 80;

    // Score Soft Skills
    let softCorrect = 0;
    softSkillAnswers.forEach((ans) => {
      const qObj = SOFT_SKILLS_QUESTIONS.find((q) => q.id === ans.id);
      if (qObj && qObj.correctAnswer === ans.selectedOption) {
        softCorrect += 1;
      }
    });
    const softSkillsScore = softSkillAnswers.length > 0 ? Math.round((softCorrect / softSkillAnswers.length) * 100) : 85;

    // Composite Weighted Score
    const overallScore = Math.round(technicalScore * 0.5 + aptitudeScore * 0.3 + softSkillsScore * 0.2);

    // Persist Assessment Result
    const assessment = await SkillAssessment.create({
      student: studentId,
      title: `${domain} - ${subField} Diagnostic`,
      domain,
      subField,
      technicalScore,
      aptitudeScore,
      softSkillsScore,
      overallScore,
      scoresByCategory: [
        { category: 'Technical Domain Knowledge', scorePercent: technicalScore, proficiencyLevel: technicalScore > 80 ? 'Advanced' : 'Intermediate' },
        { category: 'Aptitude & Problem Solving', scorePercent: aptitudeScore, proficiencyLevel: aptitudeScore > 80 ? 'Advanced' : 'Intermediate' },
        { category: 'Soft Skills & Leadership', scorePercent: softSkillsScore, proficiencyLevel: softSkillsScore > 80 ? 'Advanced' : 'Intermediate' },
      ],
      status: 'completed',
      completedAt: new Date(),
    });

    // Update User Profile with domain, subfield & newly verified skills
    const user = await User.findById(studentId);
    if (user) {
      user.primaryDomain = domain;
      if (subField) user.subField = subField;
      if (answeredSkillsGained.length > 0) {
        const mergedSkills = new Set([...user.skills, ...answeredSkillsGained]);
        user.skills = Array.from(mergedSkills);
      }
      await user.save();
    }

    // Update or Create SkillProfile
    const calculatedGaps = user ? calculateSkillGaps(user) : [];
    let skillProfile = await SkillProfile.findOne({ student: studentId });

    const benchmarkData = [
      { subject: 'Technical Core', studentScore: technicalScore, industryBenchmark: 75, fullMark: 100 },
      { subject: 'Analytical Aptitude', studentScore: aptitudeScore, industryBenchmark: 70, fullMark: 100 },
      { subject: 'Professional Soft Skills', studentScore: softSkillsScore, industryBenchmark: 80, fullMark: 100 },
      { subject: 'Hands-on Tools', studentScore: Math.min(100, technicalScore + 5), industryBenchmark: 75, fullMark: 100 },
      { subject: 'System Design/GCP', studentScore: Math.max(50, technicalScore - 10), industryBenchmark: 65, fullMark: 100 },
    ];

    if (!skillProfile) {
      skillProfile = await SkillProfile.create({
        student: studentId,
        readinessScore: overallScore,
        skillGaps: calculatedGaps,
        benchmarks: benchmarkData,
        verifiedSkills: answeredSkillsGained.map((skillName) => ({
          skillName,
          level: overallScore > 80 ? 'Advanced' : 'Intermediate',
          verifiedAt: new Date(),
        })),
      });
    } else {
      skillProfile.readinessScore = overallScore;
      skillProfile.skillGaps = calculatedGaps;
      skillProfile.benchmarks = benchmarkData;
      answeredSkillsGained.forEach((s) => {
        if (!skillProfile.verifiedSkills.some((v) => v.skillName === s)) {
          skillProfile.verifiedSkills.push({
            skillName: s,
            level: overallScore > 80 ? 'Advanced' : 'Intermediate',
            verifiedAt: new Date(),
          });
        }
      });
      await skillProfile.save();
    }

    return sendResponse(
      res,
      201,
      true,
      {
        assessment,
        profile: skillProfile,
        scores: {
          technicalScore,
          aptitudeScore,
          softSkillsScore,
          overallScore,
        },
      },
      'Assessment evaluated and skill profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
};
