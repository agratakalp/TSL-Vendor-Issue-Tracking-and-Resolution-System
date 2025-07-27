import React from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './login';
import Dashboard from './dashboard_resolver';
import DashboardLogger from './dashboard_logger';
import LogIssue from './logIssue';
import ResolveIssue from './resolveIssue';
import UserManagement from './userManagement';
import LoggedIssues from './loggedIssues';
import { AuthProvider, useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/procurement-issue-management/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/procurement-issue-management/dashboard" />;
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
