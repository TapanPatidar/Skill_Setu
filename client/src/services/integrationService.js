import api, { isMockMode } from './api.js';

const mockIntegrations = [
  {
    id: 'nptel-swayam',
    name: 'NPTEL & SWAYAM MoE Portal',
    category: 'Learning Platforms',
    description: 'Direct credit mapping and proctored MOOC course completion sync for Indian universities.',
    status: 'connected',
    lastSync: '10 minutes ago',
    recordsSynced: '1,420 courses',
    health: '100% operational',
  },
  {
    id: 'digilocker-abc',
    name: 'DigiLocker & Academic Bank of Credits',
    category: 'Verification & Credentialing',
    description: 'Automated verification of official student degrees, marksheets and skill badges.',
    status: 'connected',
    lastSync: '2 hours ago',
    recordsSynced: '2,156 credentials verified',
    health: '100% operational',
  },
  {
    id: 'campus-sis',
    name: 'Campus Enterprise ERP / SIS',
    category: 'Institutional Databases',
    description: 'Bi-directional sync of student roll numbers, CGPA, semester progression and branch transfers.',
    status: 'connected',
    lastSync: 'Yesterday at 11:30 PM',
    recordsSynced: '2,450 student records',
    health: '100% operational',
  },
  {
    id: 'coursera-campus',
    name: 'Coursera for Campus API',
    category: 'Learning Platforms',
    description: 'Specialized enterprise micro-credentials and industry lab completions sync.',
    status: 'configured',
    lastSync: '3 days ago',
    recordsSynced: '340 certificates',
    health: 'Standby',
  },
];

export const integrationService = {
  async getIntegrations() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 150));
      return { success: true, data: mockIntegrations };
    }
    try {
      return await api.get('/integrations');
    } catch (err) {
      return { success: true, data: mockIntegrations };
    }
  },

  async triggerSync(id) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 400));
      const item = mockIntegrations.find((i) => i.id === id);
      if (item) {
        item.lastSync = 'Just now';
        item.status = 'connected';
      }
      return {
        success: true,
        data: {
          integration: item,
          syncResult: { recordsProcessed: 48, status: 'synced', timestamp: new Date().toISOString() },
        },
        message: `Synchronization completed for ${item?.name || 'integration'}`,
      };
    }
    return await api.post(`/integrations/${id}/sync`);
  },
};
