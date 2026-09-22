import React, { useState, useEffect } from 'react';
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Plus,
  FolderOpen,
  FileCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { documentService } from '../../services/documentService.js';
import { useToast } from '../../context/ToastContext.jsx';

export const DocumentsVaultPage = () => {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [category, setCategory] = useState('resume');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await documentService.getMyDocuments();
      if (res?.data) {
        setDocuments(res.data);
      }
    } catch (err) {
      showToast('Error loading documents vault', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', docTitle || selectedFile?.name || 'Document.pdf');
      formData.append('category', category);
      if (selectedFile) formData.append('file', selectedFile);

      const res = await documentService.uploadDocument(formData);
      if (res?.success) {
        showToast('Document uploaded and vaulted securely!', 'success');
        setIsUploadModalOpen(false);
        setDocTitle('');
        setSelectedFile(null);
        fetchDocs();
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload document', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.deleteDocument(id);
      showToast('Document removed from vault', 'success');
      fetchDocs();
    } catch (err) {
      showToast('Failed to delete document', 'error');
    }
  };

  const filteredDocs =
    activeCategory === 'all'
      ? documents
      : documents.filter((d) => d.category === activeCategory);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              SECURE DOCUMENT VAULT
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">ENCRYPTED AT REST</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Documents & Academic Credentials Vault</h1>
          <p className="text-sm text-[#64748B]">
            Store your verified resumes, institution NOCs, degrees, and certified credentials ready for 1-click recruiter sharing.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-[#0052FF] text-white text-xs gap-1.5"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Upload Document
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto text-xs">
        {[
          { id: 'all', label: 'All Documents' },
          { id: 'resume', label: 'Resumes & CVs' },
          { id: 'noc', label: 'Institutional NOCs' },
          { id: 'certificate', label: 'Certifications' },
          { id: 'academic-record', label: 'Academic Records' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeCategory === tab.id
                ? 'bg-[#0052FF] text-white'
                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] space-y-3">
          <FolderOpen className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-semibold text-[#0F172A]">No documents found in this category</h3>
          <p className="text-xs text-[#64748B]">Upload your verified documents to apply seamlessly for internships.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => {
            const isVerified = doc.metadata?.verifiedByInstitution;
            const sizeKb = doc.fileSize ? Math.round(doc.fileSize / 1024) : 250;

            return (
              <div
                key={doc._id}
                className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#CBD5E1] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#0F172A]">{doc.title}</h4>
                      <Badge variant="secondary" className="text-[10px] font-mono-label uppercase">
                        {doc.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#64748B]">
                      {sizeKb} KB • Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {isVerified ? (
                    <Badge className="bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0] gap-1 text-[11px] font-mono-label">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Institution Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[11px] font-mono-label text-[#64748B]">
                      Standard Upload
                    </Badge>
                  )}

                  <a
                    href={doc.filePath || '#'}
                    download={doc.title}
                    className="p-2 rounded-lg text-[#64748B] hover:text-[#0052FF] hover:bg-[#0052FF]/10 transition-colors"
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-2 rounded-lg text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload to Secure Document Vault"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Document Title / Display Name:</label>
              <Input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Aarav_Sharma_Engineering_Resume_2026.pdf"
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Document Classification:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A]"
              >
                <option value="resume">Resume / Curriculum Vitae</option>
                <option value="noc">Institutional No Objection Certificate (NOC)</option>
                <option value="certificate">Industry / Academic Certificate</option>
                <option value="academic-record">Official Transcript / Marksheet</option>
                <option value="portfolio-work">Portfolio Design / Capstone Report</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Select File (PDF, DOCX, PNG, JPG - max 10MB):</label>
              <div className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-6 text-center hover:border-[#0052FF] transition-colors bg-[#FAFAFA]">
                <UploadCloud className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                <p className="text-xs text-[#334155] font-medium">
                  {selectedFile ? selectedFile.name : 'Click to browse or drag and drop document'}
                </p>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="vault-file-input"
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                />
                <label
                  htmlFor="vault-file-input"
                  className="mt-2 inline-block px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0052FF] font-medium cursor-pointer text-xs hover:bg-[#F8FAFC]"
                >
                  Browse Computer
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={uploading} className="bg-[#0052FF] text-white">
                {uploading ? 'Vaulting...' : 'Upload to Vault'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
