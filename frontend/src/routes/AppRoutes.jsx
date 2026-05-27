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
  // SavedAddresses,
  PersonalInfo,
  ChangePassword,
  NotificationPreferences,
  Language,
  PrivacySettings,
  HelpCenter,
  TermsConditions,
  PrivacyPolicy,
  CommunityGuidelines,
  AboutUs,
  PersonalChatList,
  PersonalChat
} from '../pages/userMain/pages';

// Vendor Pages
import VendorSignup from '../pages/vendor/VendorSignup';
import VendorDashboard from '../pages/vendor/dashboard/VendorDashboard';
import CreateOffer from '../pages/vendor/offers/CreateOffer';

// Admin Console (full-screen desktop dashboard — own layout, separate from the 430px app shell)
import {
  AdminLayout,
  AdminLogin,
  Dashboard as AdminDashboard,
  Users as AdminUsers,
  Groups as AdminGroups,
  Vendors as AdminVendors,
  Deals as AdminDeals,
  Analytics as AdminAnalytics,
  Fraud as AdminFraud,
  Revenue as AdminRevenue,
  Settings as AdminSettings,
} from '../pages/admin';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/vendor/signup" element={<VendorSignup />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>

        {/* Fullscreen routes (no layout shell) */}
        <Route path="/groups/:groupId/chat" element={<GroupChat />} />
        <Route path="/groups/:groupId/confirm" element={<DealConfirm />} />
        <Route path="/messages/:chatId" element={<PersonalChat />} />

        {/* User routes — main Layout (Navbar + BottomNav) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<PersonalChatList />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/wishlist" element={<Wishlist />} />
          {/* <Route path="/addresses" element={<SavedAddresses />} /> */}
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

      {/* Admin Console — top-level, self-guarded (own redirect to /admin/login).
          Kept outside the user ProtectedRoute so unauthenticated admins land on
          the admin sign-in, not the mobile /login. Full-screen desktop layout. */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" unauthorizedTo="/admin/login" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/groups" element={<AdminGroups />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/deals" element={<AdminDeals />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/fraud" element={<AdminFraud />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
