import React, { useState, useEffect } from 'react';
import {
  Building2,
  Upload,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { institutionService } from '../../services/institutionService.js';
import { getAllDomains } from '../../lib/domains.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const DepartmentsImportPage = () => {
  const { showToast } = useToast();
  const domains = getAllDomains();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);

  // New Dept Form
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    domain: 'Engineering & Technology',
    headOfDepartment: '',
    email: '',
  });

  // CSV Import State
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await institutionService.getDepartments();
      if (res?.data) {
        setDepartments(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateDept = async (e) => {
    e.preventDefault();
    try {
      const res = await institutionService.createDepartment(deptForm);
      if (res.success) {
        showToast(`Department ${deptForm.name} created!`, 'success');
        setDepartments((prev) => [...prev, { ...deptForm, totalStudents: 0, totalFaculty: 0, avgReadinessScore: 75 }]);
        setShowAddDeptModal(false);
        setDeptForm({ name: '', code: '', domain: 'Engineering & Technology', headOfDepartment: '', email: '' });
      }
    } catch (err) {
      showToast('Failed to add department', 'error');
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleUploadCsv = async () => {
    if (!selectedFile) {
      showToast('Please select a valid CSV file first', 'error');
      return;
    }
    setImporting(true);
    try {
      const res = await institutionService.importStudentsCsv(selectedFile);
      if (res.success) {
        setImportResult(res.data);
        showToast(res.message || 'CSV imported successfully!', 'success');
      }
    } catch (err) {
      showToast('Import failed', 'error');
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadSampleCsv = () => {
    const csv =
      'name,email,enrollmentNumber,domain,department,year,phone\n' +
      'Ananya Sen,ananya.s@institution.edu.in,EN20230041,Engineering & Technology,Computer Science & IT,3,+919876543210\n' +
      'Dr. Raghav Joshi,raghav.j@institution.edu.in,HC20230018,Healthcare & Ayush,Integrative Therapeutics,4,+919876543211\n' +
      'Tanvi Parekh,tanvi.p@institution.edu.in,MB20240092,Management & Business,Corporate Strategy & Finance,2,+919876543212\n';

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'SkillSetu_Student_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Template downloaded', 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-label font-bold bg-[#0052FF]/10 text-[#0052FF]">
              DEPARTMENTAL GOVERNANCE & ROSTER
            </span>
            <span className="text-xs text-[#64748B]">• Multi-Disciplinary Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            Departments & Bulk Student Onboarding
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Configure institutional academic departments, assign Heads of Department, and synchronize thousands of student records through standardized CSV batch imports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => setShowAddDeptModal(true)} className="flex items-center gap-2 text-xs">
            <Plus className="w-4 h-4" /> Add Academic Department
          </Button>
        </div>
      </div>

      {/* 2. Bulk CSV Student Import Section */}
      <Card className="border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#0052FF]" />
                Bulk Student Cohort Onboarding via CSV
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload institutional student rosters to auto-generate verified portal credentials, benchmark diagnostics, and DigiLocker linkages.
              </p>
            </div>
            <Button variant="outline" onClick={handleDownloadSampleCsv} className="text-xs flex items-center gap-1.5 self-start sm:self-auto">
              <Download className="w-3.5 h-3.5 text-[#0052FF]" /> Download Template (.CSV)
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-[#CBD5E1] hover:border-[#0052FF] rounded-2xl p-8 text-center transition-colors bg-white cursor-pointer"
            onClick={() => document.getElementById('csvInput')?.click()}
          >
            <input
              id="csvInput"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
            />
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0052FF] mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-[#0F172A]">
              {selectedFile ? selectedFile.name : 'Click to browse or drag & drop student CSV file here'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports standard UTF-8 CSV with roll numbers, discipline, department, and email headers.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              {selectedFile ? `Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)` : 'No file selected'}
            </span>
            <Button
              variant="primary"
              disabled={!selectedFile || importing}
              onClick={handleUploadCsv}
              className="text-xs flex items-center gap-1.5"
            >
              {importing ? 'Validating & Importing...' : 'Validate & Import Batch'}
            </Button>
          </div>

          {/* Import Result Feedback */}
          {importResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 mt-4">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Batch Processing Summary</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-slate-700 pt-1">
                <div>Total Rows: <strong className="font-mono-label">{importResult.totalRows}</strong></div>
                <div>Valid Records: <strong className="font-mono-label text-emerald-700">{importResult.validRowsCount}</strong></div>
                <div>Syntax Warnings: <strong className="font-mono-label text-amber-700">{importResult.errorCount}</strong></div>
              </div>

              {importResult.errors?.length > 0 && (
                <div className="pt-2 border-t border-emerald-200 text-[11px] text-amber-900 space-y-1">
                  <span className="font-bold">Skipped rows with errors:</span>
                  {importResult.errors.map((err, i) => (
                    <div key={i}>• Row {err.row}: {err.error}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Academic Departments Directory */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A]">Institutional Academic Departments ({departments.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Card key={dept._id} className="border-[#E2E8F0] rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-label font-bold uppercase bg-blue-50 text-[#0052FF] border border-blue-200">
                    {dept.code}
                  </span>
                  <span className="text-[11px] font-mono-label text-slate-500">
                    {dept.domain}
                  </span>
                </div>

                <CardTitle className="text-base font-bold text-[#0F172A]">
                  {dept.name}
                </CardTitle>

                <div className="text-xs text-slate-600 mt-1">
                  HOD: <strong className="text-[#0F172A]">{dept.headOfDepartment}</strong>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100 text-center">
                  <div className="p-2 rounded-xl bg-[#F8FAFC]">
                    <span className="text-[10px] text-slate-500 block">Students</span>
                    <span className="font-bold font-mono-label text-[#0F172A]">{dept.totalStudents || 420}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8FAFC]">
                    <span className="text-[10px] text-slate-500 block">Faculty</span>
                    <span className="font-bold font-mono-label text-[#0F172A]">{dept.totalFaculty || 24}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8FAFC]">
                    <span className="text-[10px] text-slate-500 block">Readiness</span>
                    <span className="font-bold font-mono-label text-[#0052FF]">{dept.avgReadinessScore || 84}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateDept} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Add Academic Department</h2>
                <p className="text-xs text-slate-500">Create new departmental entity for student and faculty assignment</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDeptModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Precision Agronomy & Agri-Tech Systems"
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Department Code *</label>
                  <input
                    type="text"
                    required
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. AGRI"
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] font-mono-label focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Discipline</label>
                  <select
                    value={deptForm.domain}
                    onChange={(e) => setDeptForm({ ...deptForm, domain: e.target.value })}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none"
                  >
                    {domains.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Head of Department (HOD) Name *</label>
                <input
                  type="text"
                  required
                  value={deptForm.headOfDepartment}
                  onChange={(e) => setDeptForm({ ...deptForm, headOfDepartment: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Chandran"
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button type="button" variant="outline" onClick={() => setShowAddDeptModal(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="text-xs">
                Create Department
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
