import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ProtectedRoute } from './components/layout/ProtectedRoute.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { PlaceholderModule } from './pages/PlaceholderModule.jsx';

// Student Pages
import { AssessmentPage } from './pages/student/AssessmentPage.jsx';
import { SkillProfilePage } from './pages/student/SkillProfilePage.jsx';
import { CareerGuidancePage } from './pages/student/CareerGuidancePage.jsx';
import { OpportunitiesPage } from './pages/student/OpportunitiesPage.jsx';
import { ApplicationsPage } from './pages/student/ApplicationsPage.jsx';
import { InternshipPage } from './pages/student/InternshipPage.jsx';
import { LearningHubPage } from './pages/student/LearningHubPage.jsx';
import { PortfolioPage } from './pages/student/PortfolioPage.jsx';
import { DocumentsVaultPage } from './pages/student/DocumentsVaultPage.jsx';

// Industry Pages
import { ManageJobsPage } from './pages/industry/ManageJobsPage.jsx';
import { CandidatePipelinePage } from './pages/industry/CandidatePipelinePage.jsx';
import { InternshipManagementPage } from './pages/industry/InternshipManagementPage.jsx';
import { PublishLearningPage } from './pages/industry/PublishLearningPage.jsx';
import { CompanyProfilePage } from './pages/industry/CompanyProfilePage.jsx';

// Academician (Faculty) Pages
import { FacultyOpportunitiesPage } from './pages/academician/FacultyOpportunitiesPage.jsx';
import { FacultyCollabHubPage } from './pages/academician/FacultyCollabHubPage.jsx';
import { FacultyStudentsPage } from './pages/academician/FacultyStudentsPage.jsx';

// Institution Pages
import { InstitutionAnalyticsPage } from './pages/institution/InstitutionAnalyticsPage.jsx';
import { StudentMonitorPage } from './pages/institution/StudentMonitorPage.jsx';
import { VerificationQueuePage } from './pages/institution/VerificationQueuePage.jsx';
import { IndustryPartnersPage } from './pages/institution/IndustryPartnersPage.jsx';
import { DepartmentsImportPage } from './pages/institution/DepartmentsImportPage.jsx';
import { IntegrationsPage } from './pages/institution/IntegrationsPage.jsx';
import { PolicymakerViewPage } from './pages/institution/PolicymakerViewPage.jsx';

// Platform-wide Pages
import { NotificationsPage } from './pages/NotificationsPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboard Shell Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <AppShell>
                  <DashboardPage />
                </AppShell>
              }
            />

            {/* Student Module Routes */}
            <Route
              path="/dashboard/assessment"
              element={
                <AppShell>
                  <AssessmentPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/skill-profile"
              element={
                <AppShell>
                  <SkillProfilePage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/career-guidance"
              element={
                <AppShell>
                  <CareerGuidancePage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/opportunities"
              element={
                <AppShell>
                  <OpportunitiesPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/applications"
              element={
                <AppShell>
                  <ApplicationsPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/my-internship"
              element={
                <AppShell>
                  <InternshipPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/learning"
              element={
                <AppShell>
                  <LearningHubPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/portfolio"
              element={
                <AppShell>
                  <PortfolioPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/vault"
              element={
                <AppShell>
                  <DocumentsVaultPage />
                </AppShell>
              }
            />

            {/* Industry (Recruiter) Module Routes */}
            <Route
              path="/dashboard/manage-jobs"
              element={
                <AppShell>
                  <ManageJobsPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/pipeline"
              element={
                <AppShell>
                  <CandidatePipelinePage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/internship-management"
              element={
                <AppShell>
                  <InternshipManagementPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/learning-programs"
              element={
                <AppShell>
                  <PublishLearningPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/company-profile"
              element={
                <AppShell>
                  <CompanyProfilePage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/skill-search"
              element={
                <AppShell>
                  <PlaceholderModule
                    title="All-India Talent Search & Skill Matrix Matcher"
                    category="Talent Search"
                  />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/joint-projects"
              element={
                <AppShell>
                  <PlaceholderModule
                    title="University Laboratory & Joint R&D Collaborations"
                    category="Joint Projects"
                  />
                </AppShell>
              }
            />

            {/* Academician (Faculty) Module Routes */}
            <Route
              path="/dashboard/faculty-opps"
              element={
                <AppShell>
                  <FacultyOpportunitiesPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/collaboration"
              element={
                <AppShell>
                  <FacultyCollabHubPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/events"
              element={
                <AppShell>
                  <FacultyCollabHubPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/faculty-students"
              element={
                <AppShell>
                  <FacultyStudentsPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/mentorship"
              element={
                <AppShell>
                  <FacultyStudentsPage />
                </AppShell>
              }
            />

            {/* Institution (Placement Cell) Module Routes */}
            <Route
              path="/dashboard/placements"
              element={
                <AppShell>
                  <InstitutionAnalyticsPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/students"
              element={
                <AppShell>
                  <StudentMonitorPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/registry"
              element={
                <AppShell>
                  <StudentMonitorPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/verifications"
              element={
                <AppShell>
                  <VerificationQueuePage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/partners"
              element={
                <AppShell>
                  <IndustryPartnersPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/mous"
              element={
                <AppShell>
                  <IndustryPartnersPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/departments"
              element={
                <AppShell>
                  <DepartmentsImportPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/integrations"
              element={
                <AppShell>
                  <IntegrationsPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/policymaker"
              element={
                <AppShell>
                  <PolicymakerViewPage />
                </AppShell>
              }
            />
            <Route
              path="/dashboard/compliance"
              element={
                <AppShell>
                  <PolicymakerViewPage />
                </AppShell>
              }
            />

            {/* Platform-Wide Routes */}
            <Route
              path="/notifications"
              element={
                <AppShell>
                  <NotificationsPage />
                </AppShell>
              }
            />
            <Route
              path="/settings"
              element={
                <AppShell>
                  <SettingsPage />
                </AppShell>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
