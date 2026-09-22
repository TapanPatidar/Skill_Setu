import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { protect } from '../middleware/auth.js';
import { sendResponse } from '../utils/response.js';
import { DOMAIN_TAXONOMY } from '../config/domains.js';

const router = express.Router();

/**
 * Helper to generate an intelligent domain-tailored response
 * when GEMINI_API_KEY is not configured or in offline mock mode.
 */
const generateMockCareerGuidance = (query, domain, subField, student) => {
  const domainInfo = DOMAIN_TAXONOMY[domain] || DOMAIN_TAXONOMY['Engineering & Technology'];
  const subFieldInfo = domainInfo.subFields?.[subField] || Object.values(domainInfo.subFields)[0];
  const targetRoles = subFieldInfo?.roles?.slice(0, 3).join(', ') || 'Domain Specialist';
  const highDemandSkills = subFieldInfo?.skills?.slice(0, 4).join(', ') || 'Core Competencies';
  const recommendedPrograms = subFieldInfo?.programs?.slice(0, 2).join(' and ') || 'Micro-credentials';

  const q = query.toLowerCase();

  if (q.includes('internship') || q.includes('opportunity') || q.includes('apply')) {
    return `Based on your discipline in **${domain}** (${subField}), top corporate recruiters are actively hiring for **${targetRoles}**.\n\n` +
      `**Actionable Recommendations:**\n` +
      `1. Ensure your profile showcases verified competencies in **${highDemandSkills}**.\n` +
      `2. Check the "Internships & Jobs" console for open apprenticeships currently offering industry mentorship.\n` +
      `3. Consider taking the **${recommendedPrograms}** to boost your readiness index above 85%.`;
  }

  if (q.includes('skill') || q.includes('gap') || q.includes('learn')) {
    return `In **${domain}**, our institutional skill gap analysis highlights high industry hiring demand for:\n\n` +
      `• **Primary Focus:** ${highDemandSkills}\n` +
      `• **Emerging Tools:** Sector-specific automation, compliance frameworks, and digital documentation.\n\n` +
      `We recommend taking the diagnostic assessment in your student dashboard to identify your exact proficiency percentile and receive automated program pairings.`;
  }

  return `Hello ${student?.name?.split(' ')[0] || 'Scholar'}! As a student in **${domain}** (${subField || 'Undergraduate'}), your pathway to industry leadership is bright.\n\n` +
    `**Key Strategic Priorities for Semester ${student?.semester || 6}:**\n` +
    `• **Target Industry Roles:** ${targetRoles}\n` +
    `• **Core Competency Focus:** Build demonstrable project evidence around **${highDemandSkills}**.\n` +
    `• **Next Steps:** Complete your skill diagnostic assessment, secure an institution-verified certificate in your vault, and browse curated internships. How else can I guide your career journey today?`;
};

/**
 * @route   POST /api/ai/career-guidance
 * @desc    Student AI Career Advisor with Gemini API plug-in and domain awareness
 * @access  Private / Public with student context
 */
router.post('/career-guidance', protect, async (req, res, next) => {
  try {
    const { prompt, domain: reqDomain, subField: reqSubField } = req.body;
    const userDomain = reqDomain || req.user.primaryDomain || 'Engineering & Technology';
    const userSubField = reqSubField || req.user.subField || '';

    // Check if Gemini API key is configured
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const systemInstruction = `You are SkillSetu's AI Career Advisor, specialized in Indian higher education, academia-industry collaboration, and National Education Policy (NEP) alignment across all 11 disciplines.
The current student is enrolled in Domain: "${userDomain}" and Sub-field: "${userSubField}".
Student Name: "${req.user.name}", Year: ${req.user.year || 3}.
Provide concise, highly actionable, encouraging, and domain-specific career advice, skill development roadmaps, and internship preparation tips. Use clear markdown formatting.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt || 'How can I best prepare for placements in my domain?',
          config: {
            systemInstruction,
          },
        });

        const replyText = response.text;

        return sendResponse(
          res,
          200,
          true,
          {
            reply: replyText,
            source: 'gemini-3.8-flash',
            domain: userDomain,
            subField: userSubField,
          },
          'AI Career Guidance generated via Gemini'
        );
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to domain-aware engine:', geminiError.message);
        // Fall through to domain-aware mock generator
      }
    }

    // Domain-aware engine fallback
    const mockReply = generateMockCareerGuidance(prompt || '', userDomain, userSubField, req.user);

    return sendResponse(
      res,
      200,
      true,
      {
        reply: mockReply,
        source: 'domain-aware-assistant',
        domain: userDomain,
        subField: userSubField,
        note: 'Plug in GEMINI_API_KEY in server environment to enable live Gemini 3.8 Flash model.',
      },
      'AI Career Guidance generated'
    );
  } catch (err) {
    next(err);
  }
});

export default router;
