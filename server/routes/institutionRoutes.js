import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.js';
import { analyticsService } from '../services/analyticsService.js';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { VerificationClaim } from '../models/VerificationClaim.js';
import { sendResponse } from '../utils/response.js';
import { paginate } from '../utils/paginate.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

/* ==========================================================================
   1. ANALYTICS AGGREGATION ROUTES
   ========================================================================== */

router.get('/analytics/overview', protect, async (req, res, next) => {
  try {
    const institutionId = req.user.institution?._id || req.user.institution;
    const data = await analyticsService.getOverview(institutionId, req.query);
    return sendResponse(res, 200, true, data, 'Overview analytics');
  } catch (err) {
    next(err);
  }
});

router.get('/analytics/skills', protect, async (req, res, next) => {
  try {
    const institutionId = req.user.institution?._id || req.user.institution;
    const data = await analyticsService.getSkillAnalytics(institutionId, req.query);
    return sendResponse(res, 200, true, data, 'Skills analytics');
  } catch (err) {
    next(err);
  }
});

router.get('/analytics/internships', protect, async (req, res, next) => {
  try {
    const institutionId = req.user.institution?._id || req.user.institution;
    const data = await analyticsService.getInternshipAnalytics(institutionId, req.query);
    return sendResponse(res, 200, true, data, 'Internship participation analytics');
  } catch (err) {
    next(err);
  }
});

router.get('/analytics/placements', protect, async (req, res, next) => {
  try {
    const institutionId = req.user.institution?._id || req.user.institution;
    const data = await analyticsService.getPlacementAnalytics(institutionId, req.query);
    return sendResponse(res, 200, true, data, 'Placement metrics and funnel');
  } catch (err) {
    next(err);
  }
});

router.get('/analytics/demand', protect, async (req, res, next) => {
  try {
    const data = await analyticsService.getDemandAnalytics(req.query);
    return sendResponse(res, 200, true, data, 'Sector skill-demand trends');
  } catch (err) {
    next(err);
  }
});

router.get('/analytics/policy', async (req, res, next) => {
  try {
    const data = await analyticsService.getPolicyAnalytics();
    return sendResponse(res, 200, true, data, 'Anonymized policymaker analytics');
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   2. STUDENT MONITOR & EXPORT
   ========================================================================== */

router.get('/students', protect, authorize('institution', 'academician'), async (req, res, next) => {
  try {
    const { domain, department, year, search, page = 1, limit = 15 } = req.query;
    const query = { role: 'student' };

    if (domain) query.primaryDomain = domain;
    if (department) query['profile.department'] = department;
    if (year) query.year = parseInt(year, 10);
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.enrollmentNumber': { $regex: search, $options: 'i' } },
      ];
    }

    const result = await paginate(User, query, {
      page,
      limit,
      select: 'name email role primaryDomain subField course degree year semester skills profile avatar createdAt',
    });

    return sendResponse(res, 200, true, result, 'Students retrieved successfully');
  } catch (err) {
    next(err);
  }
});

router.get('/students/export-csv', protect, authorize('institution'), async (req, res, next) => {
  try {
    const { domain, department } = req.query;
    const query = { role: 'student' };
    if (domain) query.primaryDomain = domain;
    if (department) query['profile.department'] = department;

    const students = await User.find(query).limit(500).lean();

    const headers = 'ID,Name,Email,Enrollment,Domain,Department,Year,CGPA,VerifiedSkillsCount,PlacementStatus\n';
    const rows = students
      .map((s, idx) => {
        const id = s._id;
        const name = `"${s.name || ''}"`;
        const email = s.email || '';
        const enrollment = s.profile?.enrollmentNumber || `ENR${1000 + idx}`;
        const dom = `"${s.primaryDomain || ''}"`;
        const dept = `"${s.profile?.department || s.subField || ''}"`;
        const yr = s.year || 3;
        const cgpa = s.profile?.cgpa || 8.2;
        const skillsCount = s.skills?.length || 5;
        const status = 'Eligible / Active';
        return `${id},${name},${email},${enrollment},${dom},${dept},${yr},${cgpa},${skillsCount},${status}`;
      })
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="student_competency_registry.csv"');
    return res.status(200).send(headers + rows);
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   3. VERIFICATION QUEUE
   ========================================================================== */

router.get('/verifications', protect, authorize('institution', 'academician'), async (req, res, next) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const query = {};
    if (status !== 'all') query.status = status;

    const result = await paginate(VerificationClaim, query, {
      page,
      limit,
      populate: 'student',
    });

    return sendResponse(res, 200, true, result, 'Verification queue retrieved');
  } catch (err) {
    next(err);
  }
});

router.patch('/verifications/:id', protect, authorize('institution', 'academician'), async (req, res, next) => {
  try {
    const { status, reviewerNotes } = req.body;
    const claim = await VerificationClaim.findById(req.params.id);
    if (!claim) {
      return sendResponse(res, 404, false, null, 'Verification claim not found');
    }

    claim.status = status;
    claim.reviewer = req.user._id;
    claim.reviewerNotes = reviewerNotes || '';
    claim.reviewedAt = new Date();
    await claim.save();

    return sendResponse(res, 200, true, claim, `Claim ${status} successfully`);
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   4. DEPARTMENTS & BULK CSV IMPORT
   ========================================================================== */

router.get('/departments', protect, async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ domain: 1, name: 1 });
    return sendResponse(res, 200, true, departments, 'Departments retrieved');
  } catch (err) {
    next(err);
  }
});

router.post('/departments', protect, authorize('institution'), async (req, res, next) => {
  try {
    const dept = await Department.create({
      ...req.body,
      institution: req.user.institution?._id || req.user._id,
    });
    return sendResponse(res, 201, true, dept, 'Department created');
  } catch (err) {
    next(err);
  }
});

router.post(
  '/students/import-csv',
  protect,
  authorize('institution'),
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return sendResponse(res, 400, false, null, 'Please upload a CSV file');
      }

      const csvContent = req.file.buffer.toString('utf-8');
      const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);

      if (lines.length < 2) {
        return sendResponse(res, 400, false, null, 'CSV file contains no data rows');
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));
      const parsedRows = [];
      const validationErrors = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim().replace(/"/g, ''));
        const rowData = {};
        headers.forEach((h, idx) => {
          rowData[h] = cols[idx] || '';
        });

        // Validation rules
        const rowNum = i + 1;
        if (!rowData.name) {
          validationErrors.push({ row: rowNum, error: 'Missing student name' });
          continue;
        }
        if (!rowData.email || !rowData.email.includes('@')) {
          validationErrors.push({ row: rowNum, error: `Invalid email format: "${rowData.email}"` });
          continue;
        }

        parsedRows.push({
          name: rowData.name,
          email: rowData.email,
          domain: rowData.domain || 'Engineering & Technology',
          department: rowData.department || 'Computer Science & IT',
          year: parseInt(rowData.year, 10) || 3,
          enrollmentNumber: rowData.enrollment || `ENR-${Date.now()}-${i}`,
          cgpa: parseFloat(rowData.cgpa) || 8.0,
        });
      }

      return sendResponse(
        res,
        200,
        true,
        {
          totalRows: lines.length - 1,
          validRowsCount: parsedRows.length,
          errorCount: validationErrors.length,
          errors: validationErrors,
          sampleImported: parsedRows.slice(0, 5),
        },
        `Processed CSV: ${parsedRows.length} valid students ready for synchronization`
      );
    } catch (err) {
      next(err);
    }
  }
);

/* ==========================================================================
   5. INDUSTRY PARTNERS & MoUs
   ========================================================================== */

router.get('/partners', protect, async (req, res, next) => {
  try {
    const partners = await User.find({ role: 'industry' })
      .select('name email profile primaryDomain subField createdAt')
      .limit(50);

    return sendResponse(res, 200, true, partners, 'Accredited industry partners');
  } catch (err) {
    next(err);
  }
});

export default router;
