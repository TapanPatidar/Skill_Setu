import api, { isMockMode } from './api.js';
import {
  mockDepartments,
  mockVerificationQueue,
  mockIndustryPartners,
  mockInstitutionStudents,
} from '../mock/mockData.js';

export const institutionService = {
  // Analytics Endpoints
  async getOverview(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        success: true,
        data: {
          totalStudents: 2450,
          assessedCount: 2156,
          assessedPercentage: 88,
          activeInternships: 412,
          placementRate: 91.4,
          avgReadinessScore: 84.6,
          activeMoUsCount: 38,
          industryPartnersCount: 64,
          nirfScore: '3.72 A++',
        },
      };
    }
    try {
      return await api.get('/institution/analytics/overview', { params });
    } catch (err) {
      return {
        success: true,
        data: {
          totalStudents: 2450,
          assessedCount: 2156,
          assessedPercentage: 88,
          activeInternships: 412,
          placementRate: 91.4,
          avgReadinessScore: 84.6,
          activeMoUsCount: 38,
          industryPartnersCount: 64,
          nirfScore: '3.72 A++',
        },
      };
    }
  },

  async getSkillAnalytics(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        success: true,
        data: {
          departmentProgress: [
            { department: 'Computer Science & IT', domain: 'Engineering & Technology', assessedCount: 620, avgScore: 86.4, criticalGaps: 12, topGap: 'Cloud Architecture & Microservices' },
            { department: 'Integrative Therapeutics', domain: 'Healthcare & Ayush', assessedCount: 340, avgScore: 84.2, criticalGaps: 8, topGap: 'GCP Clinical Trial Documentation' },
            { department: 'Corporate Strategy & Finance', domain: 'Management & Business', assessedCount: 410, avgScore: 82.8, criticalGaps: 14, topGap: 'Financial Modeling & Valuation' },
            { department: 'Electronic Systems', domain: 'Engineering & Technology', assessedCount: 290, avgScore: 79.5, criticalGaps: 18, topGap: 'Embedded Linux & RTOS' },
            { department: 'Design & Human Factors', domain: 'Design & Creative Arts', assessedCount: 180, avgScore: 88.0, criticalGaps: 6, topGap: 'Design Systems Architecture' },
            { department: 'Precision Agronomy', domain: 'Agriculture & Agri-Tech', assessedCount: 150, avgScore: 81.2, criticalGaps: 11, topGap: 'Drone GIS Multispectral Analytics' },
          ],
          topGapsByDomain: [
            { domain: 'Engineering & Technology', primarySkillGap: 'Microservices & Distributed DBs', secondarySkillGap: 'Kubernetes Telemetry', affectedStudentsCount: 78, recommendedAction: 'TCS Industry Sabbatical Lab' },
            { domain: 'Healthcare & Ayush', primarySkillGap: 'Good Clinical Practices (GCP)', secondarySkillGap: 'HPLC Chemometric Fingerprinting', affectedStudentsCount: 42, recommendedAction: 'AIIA National Workshop' },
            { domain: 'Management & Business', primarySkillGap: 'LBO & Financial Modeling', secondarySkillGap: 'ESG Quantitative Risk', affectedStudentsCount: 56, recommendedAction: 'Deloitte Corporate Cohort' },
            { domain: 'Design & Creative Arts', primarySkillGap: 'Design Tokens & Multi-Brand Systems', secondarySkillGap: 'WCAG AAA Audit', affectedStudentsCount: 24, recommendedAction: 'Zoho Design Masterclass' },
          ],
        },
      };
    }
    try {
      return await api.get('/institution/analytics/skills', { params });
    } catch (err) {
      return { success: true, data: { departmentProgress: [], topGapsByDomain: [] } };
    }
  },

  async getInternshipAnalytics(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        success: true,
        data: {
          monthlyParticipation: [
            { month: 'Apr 25', engineering: 120, healthcare: 45, management: 60, sciences: 25, design: 20 },
            { month: 'May 25', engineering: 180, healthcare: 55, management: 90, sciences: 35, design: 28 },
            { month: 'Jun 25', engineering: 260, healthcare: 80, management: 130, sciences: 50, design: 42 },
            { month: 'Jul 25', engineering: 280, healthcare: 85, management: 140, sciences: 55, design: 45 },
            { month: 'Aug 25', engineering: 210, healthcare: 70, management: 110, sciences: 45, design: 35 },
            { month: 'Sep 25', engineering: 150, healthcare: 65, management: 85, sciences: 30, design: 25 },
            { month: 'Oct 25', engineering: 190, healthcare: 72, management: 95, sciences: 38, design: 30 },
            { month: 'Nov 25', engineering: 220, healthcare: 88, management: 115, sciences: 46, design: 38 },
            { month: 'Dec 25', engineering: 240, healthcare: 92, management: 125, sciences: 52, design: 40 },
            { month: 'Jan 26', engineering: 270, healthcare: 95, management: 135, sciences: 58, design: 44 },
            { month: 'Feb 26', engineering: 290, healthcare: 105, management: 145, sciences: 62, design: 48 },
            { month: 'Mar 26', engineering: 310, healthcare: 115, management: 160, sciences: 68, design: 52 },
          ],
          domainBreakdown: [
            { domain: 'Engineering & Tech', count: 420, percentage: 38, avgStipend: '₹ 28,500/mo' },
            { domain: 'Management & Business', count: 260, percentage: 24, avgStipend: '₹ 24,000/mo' },
            { domain: 'Healthcare & Ayush', count: 180, percentage: 16, avgStipend: '₹ 22,000/mo' },
            { domain: 'Commerce & Finance', count: 110, percentage: 10, avgStipend: '₹ 20,500/mo' },
            { domain: 'Design & Creative Arts', count: 80, percentage: 7, avgStipend: '₹ 25,000/mo' },
            { domain: 'Science & Research', count: 55, percentage: 5, avgStipend: '₹ 21,000/mo' },
          ],
          totalActiveInterns: 1105,
          avgStipendAcrossCampus: '₹ 24,800/mo',
        },
      };
    }
    try {
      return await api.get('/institution/analytics/internships', { params });
    } catch (err) {
      return { success: true, data: { monthlyParticipation: [], domainBreakdown: [] } };
    }
  },

  async getPlacementAnalytics(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        success: true,
        data: {
          totalOffers: 1290,
          uniqueStudentsPlaced: 1210,
          placementRate: 91.4,
          highestPackage: '₹ 44.0 LPA',
          averagePackage: '₹ 10.8 LPA',
          funnel: [
            { stage: 'Eligible Cohort', count: 1850, rate: '100%' },
            { stage: 'Assessed & Verified', count: 1720, rate: '93.0%' },
            { stage: 'Applied for Placements', count: 1640, rate: '88.6%' },
            { stage: 'Shortlisted & Interviewed', count: 1420, rate: '76.8%' },
            { stage: 'Offered Positions', count: 1290, rate: '69.7%' },
            { stage: 'Offers Accepted', count: 1210, rate: '65.4%' },
          ],
          packageByDomain: [
            { domain: 'Engineering & Tech', avgPackage: 12.4, highestPackage: 44.0, medianPackage: 10.2 },
            { domain: 'Management & Business', avgPackage: 11.2, highestPackage: 28.5, medianPackage: 9.8 },
            { domain: 'Design & Creative Arts', avgPackage: 9.8, highestPackage: 22.0, medianPackage: 8.5 },
            { domain: 'Healthcare & Ayush', avgPackage: 8.6, highestPackage: 18.0, medianPackage: 7.8 },
            { domain: 'Commerce & Finance', avgPackage: 8.2, highestPackage: 19.5, medianPackage: 7.2 },
            { domain: 'Science & Research', avgPackage: 7.9, highestPackage: 16.0, medianPackage: 7.0 },
          ],
          topRecruiters: [
            { company: 'Tata Consultancy Services', offersCount: 142, tier: 'Tier-1 Elite', avgCTC: '₹ 9.5 LPA' },
            { company: 'Sun Pharma & Ranbaxy Labs', offersCount: 86, tier: 'Core Life Sciences', avgCTC: '₹ 8.8 LPA' },
            { company: 'Deloitte India & Strategy', offersCount: 74, tier: 'Big-4 Consulting', avgCTC: '₹ 12.8 LPA' },
            { company: 'Larsen & Toubro (L&T)', offersCount: 68, tier: 'Heavy Engineering', avgCTC: '₹ 10.5 LPA' },
            { company: 'All India Institute of Ayurveda', offersCount: 42, tier: 'National Institute', avgCTC: '₹ 9.2 LPA' },
            { company: 'Zoho Corporation', offersCount: 39, tier: 'Product Unicorn', avgCTC: '₹ 14.0 LPA' },
          ],
        },
      };
    }
    try {
      return await api.get('/institution/analytics/placements', { params });
    } catch (err) {
      return { success: true, data: { funnel: [], packageByDomain: [], topRecruiters: [] } };
    }
  },

  async getDemandAnalytics(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 150));
      return {
        success: true,
        data: {
          sectorDemands: [
            { sector: 'IT Services & Software', growthRate: '+24%', inDemandSkills: ['Cloud Microservices', 'React/Next.js', 'System Design', 'DevOps/Docker', 'Generative AI APIs'], hiringVelocity: 'Very High', avgSalary: '₹ 11.5 LPA' },
            { sector: 'Healthcare, Hospitals & Wellness', growthRate: '+19%', inDemandSkills: ['GCP Clinical Trials', 'Ayurvedic Formulations', 'Digital Health ABDM', 'Pharmacovigilance', 'HPLC/GC-MS'], hiringVelocity: 'High', avgSalary: '₹ 8.6 LPA' },
            { sector: 'Banking, Financial Services & Fintech', growthRate: '+18%', inDemandSkills: ['Financial Modeling', 'Credit Risk Underwriting', 'Fintech APIs', 'Ind AS / IFRS', 'Data Analytics'], hiringVelocity: 'High', avgSalary: '₹ 11.0 LPA' },
            { sector: 'Product Startups & SaaS', growthRate: '+31%', inDemandSkills: ['Full-Stack TypeScript', 'Product Analytics', 'Figma Design Systems', 'LLM Agent Engineering', 'Growth Hacking'], hiringVelocity: 'Surging', avgSalary: '₹ 15.2 LPA' },
            { sector: 'Manufacturing & Heavy Engineering', growthRate: '+14%', inDemandSkills: ['CAD/SolidWorks', 'PLC/SCADA', 'Six Sigma Lean', 'Robotics Automation', 'Quality Assurance'], hiringVelocity: 'Steady', avgSalary: '₹ 8.9 LPA' },
          ],
        },
      };
    }
    try {
      return await api.get('/institution/analytics/demand', { params });
    } catch (err) {
      return { success: true, data: { sectorDemands: [] } };
    }
  },

  async getPolicyAnalytics() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        success: true,
        data: {
          nationalReadiness: [
            { domain: 'Engineering & Technology', readinessScore: 82, totalAssessed: 142000, industryAlignment: 88, targetEmploymentRate: 92 },
            { domain: 'Management & Business', readinessScore: 78, totalAssessed: 98000, industryAlignment: 82, targetEmploymentRate: 85 },
            { domain: 'Healthcare & Ayush', readinessScore: 84, totalAssessed: 56000, industryAlignment: 90, targetEmploymentRate: 94 },
            { domain: 'Commerce & Finance', readinessScore: 74, totalAssessed: 84000, industryAlignment: 79, targetEmploymentRate: 81 },
            { domain: 'Design & Creative Arts', readinessScore: 86, totalAssessed: 32000, industryAlignment: 91, targetEmploymentRate: 89 },
            { domain: 'Science & Research', readinessScore: 76, totalAssessed: 48000, industryAlignment: 75, targetEmploymentRate: 78 },
            { domain: 'Law, Policy & Governance', readinessScore: 80, totalAssessed: 29000, industryAlignment: 83, targetEmploymentRate: 85 },
            { domain: 'Agriculture & Agri-Tech', readinessScore: 81, totalAssessed: 24000, industryAlignment: 87, targetEmploymentRate: 88 },
            { domain: 'Media & Communication', readinessScore: 83, totalAssessed: 31000, industryAlignment: 85, targetEmploymentRate: 84 },
            { domain: 'Education & Pedagogy', readinessScore: 79, totalAssessed: 42000, industryAlignment: 82, targetEmploymentRate: 86 },
            { domain: 'Hospitality & Tourism', readinessScore: 85, totalAssessed: 38000, industryAlignment: 89, targetEmploymentRate: 90 },
          ],
          regionalIndices: [
            { region: 'Northern Region (Delhi, Punjab, UP)', readinessIndex: 83.4, participationCount: 1420, activeMoUs: 320 },
            { region: 'Southern Region (Karnataka, TN, Kerala)', readinessIndex: 86.8, participationCount: 1890, activeMoUs: 490 },
            { region: 'Western Region (Maharashtra, Gujarat)', readinessIndex: 85.2, participationCount: 1650, activeMoUs: 410 },
            { region: 'Eastern & North-Eastern Region', readinessIndex: 78.6, participationCount: 940, activeMoUs: 210 },
            { region: 'Central Region (MP, Chhattisgarh)', readinessIndex: 79.5, participationCount: 820, activeMoUs: 180 },
          ],
          totalInstitutionsOnboarded: 482,
          totalNationalStudentsAssessed: '6.2 Lakh+',
          allIndiaAverageReadiness: 81.2,
          nirfNaacCriteriaVAlignment: '94.8%',
        },
      };
    }
    try {
      return await api.get('/institution/analytics/policy');
    } catch (err) {
      return { success: true, data: {} };
    }
  },

  // Student Monitoring
  async getStudents(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      let filtered = [...mockInstitutionStudents];
      if (params.domain) filtered = filtered.filter((s) => s.domain === params.domain);
      if (params.department) filtered = filtered.filter((s) => s.department === params.department);
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.enrollmentNumber.toLowerCase().includes(q)
        );
      }
      return {
        success: true,
        data: { items: filtered, pagination: { total: filtered.length, page: 1, pages: 1, limit: 15 } },
      };
    }
    try {
      return await api.get('/institution/students', { params });
    } catch (err) {
      return {
        success: true,
        data: { items: mockInstitutionStudents, pagination: { total: mockInstitutionStudents.length, page: 1, pages: 1, limit: 15 } },
      };
    }
  },

  // Verification Queue
  async getVerificationQueue(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 150));
      let filtered = [...mockVerificationQueue];
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter((c) => c.status === params.status);
      }
      return {
        success: true,
        data: { items: filtered, pagination: { total: filtered.length, page: 1, pages: 1, limit: 20 } },
      };
    }
    try {
      return await api.get('/institution/verifications', { params });
    } catch (err) {
      return {
        success: true,
        data: { items: mockVerificationQueue, pagination: { total: mockVerificationQueue.length, page: 1, pages: 1, limit: 20 } },
      };
    }
  },

  async updateVerificationClaim(id, status, reviewerNotes = '') {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      const claim = mockVerificationQueue.find((c) => c._id === id);
      if (claim) {
        claim.status = status;
        claim.reviewerNotes = reviewerNotes;
      }
      return { success: true, data: claim, message: `Claim ${status} successfully` };
    }
    return await api.patch(`/institution/verifications/${id}`, { status, reviewerNotes });
  },

  // Departments
  async getDepartments() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 150));
      return { success: true, data: mockDepartments };
    }
    try {
      return await api.get('/institution/departments');
    } catch (err) {
      return { success: true, data: mockDepartments };
    }
  },

  async createDepartment(payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      const dept = { _id: `dept_${Date.now()}`, ...payload };
      mockDepartments.push(dept);
      return { success: true, data: dept };
    }
    return await api.post('/institution/departments', payload);
  },

  // Industry Partners
  async getIndustryPartners() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 150));
      return { success: true, data: mockIndustryPartners };
    }
    try {
      return await api.get('/institution/partners');
    } catch (err) {
      return { success: true, data: mockIndustryPartners };
    }
  },

  // Bulk CSV Import (simulation for mock mode)
  async importStudentsCsv(file) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 600));
      return {
        success: true,
        data: {
          totalRows: 48,
          validRowsCount: 46,
          errorCount: 2,
          errors: [
            { row: 14, error: 'Invalid email format: "rahul.guptagmail.com"' },
            { row: 31, error: 'Missing department code' },
          ],
          sampleImported: [
            { name: 'Kavita Menon', email: 'kavita.m@nit.edu.in', domain: 'Engineering & Technology', department: 'CSE' },
            { name: 'Sameer Joshi', email: 'sameer.j@nit.edu.in', domain: 'Management & Business', department: 'SOM' },
          ],
        },
        message: 'Processed CSV: 46 valid students ready for synchronization',
      };
    }
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/institution/students/import-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
