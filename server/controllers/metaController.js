import { DOMAIN_TAXONOMY, getAllDomains, getSubFieldsForDomain, INDUSTRY_SECTORS, SOFT_SKILLS } from '../config/domains.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc Get complete domain taxonomy, sectors, and soft skills
 * @route GET /api/meta/domains
 * @access Public
 */
export const getDomainTaxonomy = async (req, res, next) => {
  try {
    return sendResponse(
      res,
      200,
      true,
      {
        taxonomy: DOMAIN_TAXONOMY,
        domains: getAllDomains(),
        sectors: INDUSTRY_SECTORS,
        softSkills: SOFT_SKILLS,
      },
      'Domain taxonomy retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};
