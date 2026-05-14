import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';
import VendorLayout from '../pages/vendor/layout/VendorLayout';

// Auth & Onboarding
import Onboarding from '../pages/auth/Onboarding';
import Login from '../pages/auth/Login';
import OTP from '../pages/auth/OTP';
import Location from '../pages/auth/Location';

// User Pages
import Home from '../pages/user/home/Home';
import DealConfirm from '../pages/user/group/DealConfirm';
import Groups from '../pages/user/groups/Groups';
import Deals from '../pages/user/deals/Deals';
import GroupDetail from '../pages/user/group/GroupDetail';
import CreateGroup from '../pages/user/group/CreateGroup';
import GroupChat from '../pages/user/group/GroupChat';
import Profile from '../pages/user/profile/Profile';
import Notifications from '../pages/user/notifications/Notifications';
import Categories from '../pages/user/categories/Categories';

// Vendor Pages
import VendorSignup from '../pages/vendor/VendorSignup';
import VendorDashboard from '../pages/vendor/dashboard/VendorDashboard';
import CreateOffer from '../pages/vendor/offers/CreateOffer';

// Admin Pages
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/location" element={<Location />} />
      <Route path="/vendor/signup" element={<VendorSignup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>

        {/* Fullscreen routes (no layout shell) */}
        <Route path="/groups/:groupId/chat" element={<GroupChat />} />
        <Route path="/groups/:groupId/confirm" element={<DealConfirm />} />

        {/* User routes — main Layout (Navbar + BottomNav) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/categories" element={<Categories />} />

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Vendor routes — separate VendorLayout (vendor header + vendor bottom nav) */}
        <Route element={<ProtectedRoute allowedRoles={['vendor', 'admin']} />}>
          <Route element={<VendorLayout />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          </Route>
          {/* CreateOffer is fullscreen (has its own header) */}
          <Route path="/vendor/create-offer" element={<CreateOffer />} />
        </Route>

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
