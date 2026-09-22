import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { activeIntegrations, LearningPlatformAdapter, CertificationProviderAdapter, InstitutionalSisAdapter } from '../services/integrations/index.js';
import { sendResponse } from '../utils/response.js';

const router = express.Router();

/**
 * @route   GET /api/integrations
 * @desc    Get all integrations and connector health
 */
router.get('/', protect, async (req, res, next) => {
  try {
    return sendResponse(res, 200, true, activeIntegrations, 'Active integration connectors');
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/integrations/:id/sync
 * @desc    Trigger sync on a specific integration adapter
 */
router.post('/:id/sync', protect, authorize('institution'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const integration = activeIntegrations.find((item) => item.id === id);

    if (!integration) {
      return sendResponse(res, 404, false, null, 'Integration connector not found');
    }

    let syncResult;
    if (id === 'nptel-swayam') {
      const adapter = new LearningPlatformAdapter();
      syncResult = await adapter.syncStudentCourses(req.user._id);
    } else if (id === 'digilocker-abc') {
      const adapter = new CertificationProviderAdapter();
      syncResult = await adapter.verifyCredential('CERT-2026-NITAHS', 'ABC-98234-110');
    } else {
      const adapter = new InstitutionalSisAdapter();
      syncResult = await adapter.syncStudentRoster('NIT-AHS-001');
    }

    // Update timestamp in memory
    integration.lastSync = 'Just now';
    integration.status = 'connected';

    return sendResponse(
      res,
      200,
      true,
      {
        integration,
        syncResult,
        syncedAt: new Date().toISOString(),
      },
      `Synchronization completed for ${integration.name}`
    );
  } catch (err) {
    next(err);
  }
});

export default router;
