/**
 * @file matchingService.js
 * Pure, swappable matching service for SkillSetu.
 * Evaluates student skill profiles against opportunities, target roles, and industry benchmarks.
 *
 * Scoring algorithm weights:
 * - Direct Technical Skill Overlap: 50%
 * - Domain & Sub-Field Affinity: 25%
 * - Adjacent-Domain Transferability: 15% (e.g., Mechanical -> Auto/EV; CS -> Fintech/Health-IT)
 * - Interests & Soft Skill Alignment: 10%
 */

import { DOMAIN_TAXONOMY, getAllSkillsList } from '../config/domains.js';

/**
 * Maps adjacent and cross-disciplinary domain affinities.
 * Allows students in foundational disciplines to discover viable adjacent industries.
 */
export const ADJACENT_DOMAIN_AFFINITIES = {
  'Computer Science & IT': ['Data Science & AI', 'Health Informatics & Digital Health', 'Banking & Fintech', 'UI/UX & Product Design'],
  'Data Science & AI': ['Computer Science & IT', 'Finance & Corporate Strategy', 'Clinical Research & Trials', 'Precision Agriculture & Crop Science'],
  'Electronics & Communication': ['Computer Science & IT', 'Mechanical & Automation', 'Automobile & Electric Vehicles (EV)'],
  'Mechanical & Automation': ['Automobile & Electric Vehicles (EV)', 'Precision Agriculture & Crop Science', 'Civil & Infrastructure'],
  'Ayurveda & Traditional Medicine': ['Pharmaceutical Sciences & Regulatory', 'Clinical Research & Trials', 'Health Informatics & Digital Health'],
  'Pharmaceutical Sciences & Regulatory': ['Clinical Research & Trials', 'Ayurveda & Traditional Medicine', 'Biotechnology & Bio-Engineering'],
  'Finance & Corporate Strategy': ['Banking & Fintech', 'Accounting & Audit', 'Data Science & AI'],
  'UI/UX & Product Design': ['Computer Science & IT', 'Graphic & Brand Communication', 'Product Management'],
};

/**
 * Calculates match percentage between student profile and an opportunity
 * @param {Object} studentProfile - { skills: string[], primaryDomain: string, subField: string, interests: string[] }
 * @param {Object} opportunity - { requiredSkills: string[], domain: string, subField: string, sector: string }
 * @returns {{ matchScore: number, matchedSkills: string[], missingSkills: string[], affinityBoost: number }}
 */
export function calculateOpportunityMatch(studentProfile, opportunity) {
  const studentSkills = new Set((studentProfile.skills || []).map((s) => s.toLowerCase().trim()));
  const requiredSkills = opportunity.requiredSkills || [];

  if (requiredSkills.length === 0) {
    return { matchScore: 75, matchedSkills: [], missingSkills: [], affinityBoost: 0 };
  }

  const matched = [];
  const missing = [];

  requiredSkills.forEach((skill) => {
    if (studentSkills.has(skill.toLowerCase().trim())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  // 1. Skill Overlap Ratio (0 to 50 pts)
  const skillRatio = matched.length / requiredSkills.length;
  const skillPoints = skillRatio * 50;

  // 2. Exact Domain / Subfield Affinity (0 to 25 pts)
  let domainPoints = 0;
  if (studentProfile.primaryDomain === opportunity.domain) {
    domainPoints += 15;
    if (studentProfile.subField === opportunity.subField) {
      domainPoints += 10;
    }
  }

  // 3. Adjacent Domain Affinity (0 to 15 pts)
  let adjacentPoints = 0;
  const adjacentList = ADJACENT_DOMAIN_AFFINITIES[studentProfile.subField] || [];
  if (adjacentList.includes(opportunity.subField) || adjacentList.includes(opportunity.sector)) {
    adjacentPoints = 15;
  }

  // 4. Interest Alignment (0 to 10 pts)
  let interestPoints = 0;
  const studentInterests = (studentProfile.interests || []).map((i) => i.toLowerCase().trim());
  const oppSector = (opportunity.sector || '').toLowerCase().trim();
  if (studentInterests.some((i) => oppSector.includes(i) || i.includes(oppSector))) {
    interestPoints = 10;
  } else if (matched.length > 0) {
    interestPoints = 5;
  }

  const totalScore = Math.min(100, Math.round(skillPoints + domainPoints + adjacentPoints + interestPoints));

  return {
    matchScore: Math.max(35, totalScore),
    matchedSkills: matched,
    missingSkills: missing,
    affinityBoost: adjacentPoints > 0 ? adjacentPoints : 0,
  };
}

/**
 * Generates prioritized skill gaps against target role / industry benchmarks
 * @param {Object} student - User document with skills, primaryDomain, subField, targetRole
 * @returns {Array<{ skillName: string, currentProficiency: number, requiredProficiency: number, severity: 'critical'|'moderate'|'low', category: string }>}
 */
export function calculateSkillGaps(student) {
  const currentSkills = new Set((student.skills || []).map((s) => s.toLowerCase().trim()));
  const domain = student.primaryDomain || 'Engineering & Technology';
  const subField = student.subField || 'Computer Science & IT';

  const expectedSkills = DOMAIN_TAXONOMY[domain]?.subFields?.[subField]?.skills || [
    'DSA',
    'React',
    'Node.js',
    'SQL',
    'Git',
  ];

  const gaps = [];

  expectedSkills.forEach((skill, index) => {
    const hasSkill = currentSkills.has(skill.toLowerCase().trim());
    if (!hasSkill) {
      const isCritical = index < 3; // First 3 core skills are critical
      gaps.push({
        skillName: skill,
        currentProficiency: 20 + Math.floor(Math.random() * 20),
        requiredProficiency: isCritical ? 85 : 75,
        severity: isCritical ? 'critical' : index < 6 ? 'moderate' : 'low',
        category: domain,
      });
    }
  });

  return gaps;
}

/**
 * Returns career path visual data and recommended industry roles
 * @param {Object} student
 * @returns {Object} { targetRoles: Array<{ role: string, matchPercentage: number, domain: string, missingSkills: string[] }>, careerPath: Object }
 */
export function getRecommendationsAndCareerPath(student) {
  const domain = student.primaryDomain || 'Engineering & Technology';
  const subField = student.subField || 'Computer Science & IT';
  const studentSkills = new Set((student.skills || []).map((s) => s.toLowerCase().trim()));

  const subFieldObj = DOMAIN_TAXONOMY[domain]?.subFields?.[subField];
  const targetRoles = [];

  if (subFieldObj?.roles) {
    subFieldObj.roles.forEach((roleTitle) => {
      const reqSkills = subFieldObj.skills.slice(0, 5);
      const matched = reqSkills.filter((s) => studentSkills.has(s.toLowerCase().trim()));
      const matchPct = Math.round(50 + (matched.length / reqSkills.length) * 45);
      const missing = reqSkills.filter((s) => !studentSkills.has(s.toLowerCase().trim()));

      targetRoles.push({
        role: roleTitle,
        domain,
        subField,
        matchPercentage: matchPct,
        missingSkills: missing,
      });
    });
  }

  // Also include adjacent domain roles
  const adjacentSubFields = ADJACENT_DOMAIN_AFFINITIES[subField] || [];
  adjacentSubFields.forEach((adjSubField) => {
    Object.entries(DOMAIN_TAXONOMY).forEach(([domName, domData]) => {
      if (domData.subFields[adjSubField]) {
        const adjObj = domData.subFields[adjSubField];
        adjObj.roles.slice(0, 1).forEach((roleTitle) => {
          targetRoles.push({
            role: `${roleTitle} (Adjacent Opportunity)`,
            domain: domName,
            subField: adjSubField,
            matchPercentage: 74,
            missingSkills: adjObj.skills.slice(0, 2),
            isAdjacent: true,
          });
        });
      }
    });
  });

  const careerPath = {
    currentLevel: student.year ? `Year ${student.year} Scholar` : 'Junior Scholar',
    targetRole: student.profile?.targetRole || targetRoles[0]?.role || 'Full-Stack Developer',
    milestones: [
      { step: 1, title: 'Foundational Diagnostics & Skill Mapping', status: 'completed' },
      { step: 2, title: 'Close Priority Skill Gaps (Critical Level)', status: 'in-progress' },
      { step: 3, title: 'Industry-Accredited Micro-Credential Enrollment', status: 'upcoming' },
      { step: 4, title: 'Corporate Summer Internship / Co-Op', status: 'upcoming' },
      { step: 5, title: 'Final Placement & Verifiable Portfolio Audit', status: 'upcoming' },
    ],
  };

  return {
    targetRoles: targetRoles.sort((a, b) => b.matchPercentage - a.matchPercentage),
    careerPath,
  };
}
