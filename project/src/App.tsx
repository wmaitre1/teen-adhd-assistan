import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/auth/AuthGuard';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { ParentLogin } from './pages/auth/ParentLogin';
import { StudentLogin } from './pages/auth/StudentLogin';
import { Dashboard } from './pages/Dashboard';
import { TaskManager } from './pages/TaskManager';
import { HomeworkProgress } from './pages/HomeworkProgress';
import { Journal } from './pages/Journal';
import { Mindfulness } from './pages/Mindfulness';
import { Settings } from './pages/Settings';
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentTasks } from './pages/parent/ParentTasks';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/parent" element={<ParentLogin />} />
        <Route path="/auth/student" element={<StudentLogin />} />

        {/* Protected Parent Routes */}
        <Route
          path="/parent/*"
          element={
            <AuthGuard>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<ParentDashboard />} />
                  <Route path="tasks" element={<ParentTasks />} />
                  <Route path="homework" element={<HomeworkProgress />} />
                  <Route path="mindfulness" element={<Mindfulness />} />
                  <Route path="journal" element={<Journal />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/parent/dashboard" replace />} />
                </Routes>
              </Layout>
            </AuthGuard>
          }
        />

        {/* Protected Student Routes */}
        <Route
          path="/*"
          element={
            <AuthGuard>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="tasks" element={<TaskManager />} />
                  <Route path="homework" element={<HomeworkProgress />} />
                  <Route path="mindfulness" element={<Mindfulness />} />
                  <Route path="journal" element={<Journal />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}