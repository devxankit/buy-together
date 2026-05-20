import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../pages/userMain/components/layout/UserMainLayout';
import VendorLayout from '../pages/vendor/layout/VendorLayout';

// Auth & Onboarding
import Onboarding from '../pages/auth/Onboarding';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import OTP from '../pages/auth/OTP';

// User Pages (Consolidated inside userMain)
import {
  Home,
  GroupsList as Groups,
  GroupDetails as GroupDetail,
  CreateGroup,
  Deals,
  Profile,
  Notifications,
  Categories,
  GroupChat,
  DealConfirm,
  Wishlist,
  SavedAddresses,
  PersonalInfo,
  ChangePassword,
  NotificationPreferences,
  Language,
  PrivacySettings,
  HelpCenter,
  TermsConditions,
  PrivacyPolicy,
  CommunityGuidelines,
  AboutUs
} from '../pages/userMain/pages';

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
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OTP />} />
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
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/addresses" element={<SavedAddresses />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/notification-preferences" element={<NotificationPreferences />} />
          <Route path="/language" element={<Language />} />
          <Route path="/privacy-settings" element={<PrivacySettings />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
          <Route path="/about" element={<AboutUs />} />

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
