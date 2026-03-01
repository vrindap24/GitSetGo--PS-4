import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HQDashboard from './pages/HQDashboard';
import BranchDashboard from './pages/BranchDashboard';
import StaffDashboard from './pages/StaffDashboard';
import QRIntake from './pages/QRIntake';
import Login from './pages/Login';
import NetworkMap from './pages/hq/NetworkMap';
import GlobalStaff from './pages/hq/GlobalStaff';
import StaffManagement from './pages/branch/StaffManagement';
import Settings from './pages/Settings';
import Help from './pages/Help';
import ReviewsPage from './pages/ReviewsPage';
import ServiceHistory from './pages/staff/ServiceHistory';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/qr" element={<QRIntake />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          user ? (
            <Layout user={user} onLogout={() => setUser(null)} />
          ) : (
            <Navigate to="/login" replace />
          )
        }>
          {/* HQ Routes */}
          {user?.role === 'HQ' && (
            <>
              <Route index element={<HQDashboard />} />
              <Route path="branch" element={<NetworkMap />} />
              <Route path="staff" element={<GlobalStaff />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reviews" element={<ReviewsPage role="HQ" />} />
            </>
          )}

          {/* Branch Manager Routes */}
          {user?.role === 'BRANCH' && (
            <>
              <Route index element={<BranchDashboard />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reviews" element={<ReviewsPage role="BRANCH" />} />
            </>
          )}

          {/* Staff Routes */}
          {user?.role === 'STAFF' && (
            <>
              <Route index element={<StaffDashboard user={user} />} />
              <Route path="help" element={<Help />} />
              <Route path="history" element={<ServiceHistory />} />
            </>
          )}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
