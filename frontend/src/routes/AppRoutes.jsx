import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';

// Pages
import Login from '../pages/auth/Login';
import OTP from '../pages/auth/OTP';
import Home from '../pages/user/home/Home';
import GroupDetail from '../pages/user/group/GroupDetail';
import CreateGroup from '../pages/user/group/CreateGroup';
import GroupChat from '../pages/user/group/GroupChat';
import VendorDashboard from '../pages/vendor/dashboard/VendorDashboard';
import CreateOffer from '../pages/vendor/offers/CreateOffer';
import Profile from '../pages/user/profile/Profile';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import VendorSignup from '../pages/vendor/VendorSignup';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/vendor/signup" element={<VendorSignup />} />

      {/* Main App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Group Routes */}
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/:groupId/chat" element={<GroupChat />} />

          {/* Vendor Specific (Still within Main Layout) */}
          <Route element={<ProtectedRoute allowedRoles={['vendor', 'admin']} />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/create-offer" element={<CreateOffer />} />
          </Route>

          {/* Admin Specific */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
