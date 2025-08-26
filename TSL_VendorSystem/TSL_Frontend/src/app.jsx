import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard_resolver';
import DashboardLogger from './pages/dashboard_logger';
import LogIssue from './pages/logIssue';
import ResolveIssue from './pages/resolveIssue';
import UserManagement from './pages/userManagement';
import LoggedIssues from './pages/loggedIssues';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard_resolver" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard_resolver"
          element={
            <ProtectedRoute roles={["Logger", "Resolver", "Logger+Resolver"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard_logger"
          element={
            <ProtectedRoute roles={["Logger"]}>
              <DashboardLogger />
            </ProtectedRoute>
          }
        />
        <Route
          path="/log-issue"
          element={
            <ProtectedRoute roles={["Logger"]}>
              <LogIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logged-issues"
          element={
            <ProtectedRoute roles={["Logger"]}>
              <LoggedIssues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resolve-issue/:id"
          element={
            <ProtectedRoute roles={["Resolver", "Logger+Resolver"]}>
              <ResolveIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;