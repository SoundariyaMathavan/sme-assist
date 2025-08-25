import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeSampleData } from './utils/sampleData';

// Auth Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Layout
import Layout from './components/Layout/Layout';

// Dashboard Components
import SMEDashboard from './components/Dashboard/SMEDashboard';
import CADashboard from './components/Dashboard/CADashboard';

// Module Components
import Calendar from './components/Modules/Calendar';
import Documents from './components/Modules/Documents';
import Notifications from './components/Modules/Notifications';
import FilingGuides from './components/Modules/FilingGuides';
import RegulatoryFeed from './components/Modules/RegulatoryFeed';
import Chat from './components/Modules/Chat';
import Clients from './components/Modules/Clients';

// Initialize sample data on app start
initializeSampleData();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Role-based Route Component
const RoleRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles: string[]; 
}> = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(currentUser?.role || '')) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Root redirect component
const RootRedirect: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser?.role === 'SME') {
    return <Navigate to="/sme-dashboard" replace />;
  } else if (currentUser?.role === 'CA') {
    return <Navigate to="/ca-dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes with Layout */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<RootRedirect />} />
        
        {/* SME Routes */}
        <Route 
          path="sme-dashboard" 
          element={
            <RoleRoute allowedRoles={['SME']}>
              <SMEDashboard />
            </RoleRoute>
          } 
        />
        
        {/* CA Routes */}
        <Route 
          path="ca-dashboard" 
          element={
            <RoleRoute allowedRoles={['CA']}>
              <CADashboard />
            </RoleRoute>
          } 
        />
        
        <Route 
          path="clients" 
          element={
            <RoleRoute allowedRoles={['CA']}>
              <Clients />
            </RoleRoute>
          } 
        />
        
        {/* Shared Routes */}
        <Route path="calendar" element={<Calendar />} />
        <Route path="documents" element={<Documents />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="chat" element={<Chat />} />
        
        {/* SME-only Routes */}
        <Route 
          path="filing-guides" 
          element={
            <RoleRoute allowedRoles={['SME']}>
              <FilingGuides />
            </RoleRoute>
          } 
        />
        
        <Route 
          path="regulatory-feed" 
          element={
            <RoleRoute allowedRoles={['SME']}>
              <RegulatoryFeed />
            </RoleRoute>
          } 
        />
      </Route>
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;