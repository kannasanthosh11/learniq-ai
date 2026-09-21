import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import AdaptivePractice from './pages/AdaptivePractice';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import KnowledgeGapsPage from './pages/KnowledgeGapsPage';
import LearningPathPage from './pages/LearningPathPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

// Teacher Pages
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherStudentDetails from './pages/TeacherStudentDetails';
import TeacherConceptsPage from './pages/TeacherConceptsPage';

// Dedicated AI Engine Page
import AiEnginePage from './pages/AiEnginePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Protected / Core Learning Routes */}
          <Route element={<StudentLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/practice" element={<AdaptivePractice />} />
            <Route path="/graph" element={<KnowledgeGraphPage />} />
            <Route path="/gaps" element={<KnowledgeGapsPage />} />
            <Route path="/learning-path" element={<LearningPathPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/ai-engine" element={<AiEnginePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Teacher Instructor Routes */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="student/:id" element={<TeacherStudentDetails />} />
            <Route path="concepts" element={<TeacherConceptsPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
