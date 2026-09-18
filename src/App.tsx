import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/layout/Layout';

// Public Pages
import { HomePage } from './pages/public/HomePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ScholarshipsPage } from './pages/student/ScholarshipsPage';
import { SchemeDetailPage } from './pages/student/SchemeDetailPage';
import { ApplyPage } from './pages/student/ApplyPage';
import { DocumentsPage } from './pages/student/DocumentsPage';
import { ApplicationsPage } from './pages/student/ApplicationsPage';
import { ApplicationDetailPage } from './pages/student/ApplicationDetailPage';
import { NotificationsPage } from './pages/student/NotificationsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminVerificationPage } from './pages/admin/AdminVerificationPage';
import { CoverageIntelligencePage } from './pages/admin/CoverageIntelligencePage';
import { AdminActivityPage } from './pages/admin/AdminActivityPage';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Authenticated Layout Shell */}
              <Route element={<Layout />}>
                {/* Student Routes */}
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/scholarships" element={<ScholarshipsPage />} />
                <Route path="/student/scholarships/:schemeId" element={<SchemeDetailPage />} />
                <Route path="/student/apply/:schemeId" element={<ApplyPage />} />
                <Route path="/student/documents" element={<DocumentsPage />} />
                <Route path="/student/applications" element={<ApplicationsPage />} />
                <Route path="/student/applications/:appId" element={<ApplicationDetailPage />} />
                <Route path="/student/notifications" element={<NotificationsPage />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/applications" element={<AdminApplicationsPage />} />
                <Route path="/admin/verification" element={<AdminVerificationPage />} />
                <Route path="/admin/coverage" element={<CoverageIntelligencePage />} />
                <Route path="/admin/activity" element={<AdminActivityPage />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
