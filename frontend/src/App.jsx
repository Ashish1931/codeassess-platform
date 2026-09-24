import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ExamProvider } from './context/ExamContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyProfile from './pages/student/MyProfile';
import SubjectPage from './pages/student/SubjectPage';
import MockTestPage from './pages/student/MockTestPage';
import ExamPage from './pages/student/ExamPage';
import ResultPage from './pages/student/ResultPage';
import PerformanceReport from './pages/student/PerformanceReport';
import DownloadReports from './pages/student/DownloadReports';
import BookmarksPage from './pages/student/BookmarksPage';
import LeaderboardPage from './pages/student/LeaderboardPage';
import DailyChallengePage from './pages/student/DailyChallengePage';
import SubscriptionPage from './pages/student/SubscriptionPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminSubjects from './pages/admin/AdminSubjects';
import AdminTests from './pages/admin/AdminTests';
import AdminQuestions from './pages/admin/AdminQuestions';

// Static Info Pages
import PrivacyPolicy from './pages/info/PrivacyPolicy';
import TermsOfService from './pages/info/TermsOfService';
import SupportPage from './pages/info/SupportPage';
import DocumentationPage from './pages/info/DocumentationPage';

const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hide Navbar/Sidebar on Exam page or Auth pages
  const isExamPage = location.pathname.startsWith('/student/exam/');
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  if (isExamPage) {
    return (
      <Routes>
        <Route path="/student/exam/:testId" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Routes>
    );
  }

  if (isAuthPage || !user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex pt-0">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 md:ml-[var(--sidebar-width)] p-4 sm:p-6 md:p-8 w-full min-w-0 transition-all">
          <Routes>
            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<MyProfile />} />
              <Route path="/student/subjects" element={<SubjectPage />} />
              <Route path="/student/mock-test/:subjectId" element={<MockTestPage />} />
              <Route path="/student/mock-tests" element={<MockTestPage />} />
              <Route path="/student/result/:attemptId" element={<ResultPage />} />
              <Route path="/student/performance" element={<PerformanceReport />} />
              <Route path="/student/reports" element={<DownloadReports />} />
              <Route path="/student/bookmarks" element={<BookmarksPage />} />
              <Route path="/student/wrong-answers" element={<BookmarksPage />} />
              <Route path="/student/leaderboard" element={<LeaderboardPage />} />
              <Route path="/student/daily-challenge" element={<DailyChallengePage />} />
              <Route path="/student/subscription" element={<SubscriptionPage />} />
            </Route>

            {/* Static Info Routes */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/subjects" element={<AdminSubjects />} />
              <Route path="/admin/tests" element={<AdminTests />} />
              <Route path="/admin/questions" element={<AdminQuestions />} />
            </Route>

            <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExamProvider>
          <AppLayout />
        </ExamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
