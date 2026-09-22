import api, { isMockMode } from './api.js';
import { mockDocuments } from '../mock/mockData.js';

export const documentService = {
  async getMyDocuments() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: mockDocuments };
    }

    try {
      return await api.get('/documents');
    } catch (err) {
      return { success: true, data: mockDocuments };
    }
  },

  async uploadDocument(formData) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 350));
      const title = formData.get ? formData.get('title') : 'Uploaded Document.pdf';
      const category = formData.get ? formData.get('category') : 'certificate';
      const newDoc = {
        _id: `doc_${Date.now()}`,
        title: title || 'Credential_Document.pdf',
        category: category || 'certificate',
        fileSize: 340000,
        createdAt: new Date().toISOString(),
        metadata: { verifiedByInstitution: false, hash: `SHA256-${Date.now().toString(16)}` },
      };
      mockDocuments.unshift(newDoc);
      return { success: true, data: newDoc, message: 'Document uploaded to secure vault' };
    }

    return await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async deleteDocument(id) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      const idx = mockDocuments.findIndex((d) => d._id === id);
      if (idx !== -1) mockDocuments.splice(idx, 1);
      return { success: true, message: 'Document deleted from vault' };
    }

    return await api.delete(`/documents/${id}`);
  },
};
