import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
// The user app shell stays eager so the chrome paints instantly; the page
// content inside it is code-split and streamed in under <Suspense>.
import Layout from '../pages/userMain/components/layout/UserMainLayout';

// ── Lazy route chunks ────────────────────────────────────────────────
// Each import() becomes its own bundle, so a visitor only downloads the code
// for the screen they actually open (e.g. a normal user never loads the admin
// console or vendor dashboard).

// Auth & Onboarding
const Onboarding = lazy(() => import('../pages/auth/Onboarding'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const OTP = lazy(() => import('../pages/auth/OTP'));

// User pages
const Home = lazy(() => import('../pages/userMain/pages/home/Home'));
const Groups = lazy(() => import('../pages/userMain/pages/groups/GroupsList'));
const GroupDetail = lazy(() => import('../pages/userMain/pages/groups/GroupDetails'));
const CreateGroup = lazy(() => import('../pages/userMain/pages/groups/CreateGroup'));
const Deals = lazy(() => import('../pages/userMain/pages/deals/Deals'));
const Profile = lazy(() => import('../pages/userMain/pages/profile/Profile'));
const Notifications = lazy(() => import('../pages/userMain/pages/notifications/Notifications'));
const Categories = lazy(() => import('../pages/userMain/pages/categories/Categories'));
const GroupChat = lazy(() => import('../pages/userMain/pages/chat/GroupChat'));
const DealConfirm = lazy(() => import('../pages/userMain/pages/groups/DealConfirm'));
const Wishlist = lazy(() => import('../pages/userMain/pages/wishlist/Wishlist'));
const PersonalInfo = lazy(() => import('../pages/userMain/pages/profile/PersonalInfo'));
const ChangePassword = lazy(() => import('../pages/userMain/pages/profile/ChangePassword'));
const NotificationPreferences = lazy(() => import('../pages/userMain/pages/profile/NotificationPreferences'));
const PrivacySettings = lazy(() => import('../pages/userMain/pages/profile/PrivacySettings'));
const HelpCenter = lazy(() => import('../pages/userMain/pages/profile/HelpCenter'));
const TermsConditions = lazy(() => import('../pages/userMain/pages/profile/TermsConditions'));
const PrivacyPolicy = lazy(() => import('../pages/userMain/pages/profile/PrivacyPolicy'));
const CommunityGuidelines = lazy(() => import('../pages/userMain/pages/profile/CommunityGuidelines'));
const AboutUs = lazy(() => import('../pages/userMain/pages/profile/AboutUs'));
const PersonalChatList = lazy(() => import('../pages/userMain/pages/chat/PersonalChatList'));
const PersonalChat = lazy(() => import('../pages/userMain/pages/chat/PersonalChat'));

// Vendor pages
const VendorLayout = lazy(() => import('../pages/vendor/layout/VendorLayout'));
const VendorSignup = lazy(() => import('../pages/vendor/VendorSignup'));
const VendorDashboard = lazy(() => import('../pages/vendor/dashboard/VendorDashboard'));
const CreateOffer = lazy(() => import('../pages/vendor/offers/CreateOffer'));

// Admin console (heaviest area — its own chunk graph, never loaded for users)
const AdminLayout = lazy(() => import('../pages/admin/layout/AdminLayout'));
const AdminLogin = lazy(() => import('../pages/admin/auth/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/pages/Dashboard'));
const AdminUsers = lazy(() => import('../pages/admin/pages/Users'));
const AdminGroups = lazy(() => import('../pages/admin/pages/Groups'));
const AdminCategories = lazy(() => import('../pages/admin/pages/Categories'));
const AdminVendors = lazy(() => import('../pages/admin/pages/Vendors'));
const AdminFraud = lazy(() => import('../pages/admin/pages/Fraud'));
const AdminRevenue = lazy(() => import('../pages/admin/pages/Revenue'));
const AdminSettings = lazy(() => import('../pages/admin/pages/Settings'));
const AdminBanners = lazy(() => import('../pages/admin/pages/Banners'));
const AdminHomeSections = lazy(() => import('../pages/admin/pages/HomeSections'));
const AdminPushNotifications = lazy(() => import('../pages/admin/pages/PushNotifications'));
const AdminSupport = lazy(() => import('../pages/admin/pages/Support'));
const AdminContentPages = lazy(() => import('../pages/admin/pages/ContentPages'));

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh] w-full">
    <div className="w-7 h-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/vendor/signup" element={<VendorSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          {/* Fullscreen routes (no layout shell) */}
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/groups/:groupId/chat" element={<GroupChat />} />
          <Route path="/groups/:groupId/confirm" element={<DealConfirm />} />
          <Route path="/messages/:chatId" element={<PersonalChat />} />

          {/* User routes — main Layout (Navbar + BottomNav) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/create" element={<CreateGroup />} />
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
            <Route path="/privacy-settings" element={<PrivacySettings />} />
            <Route path="/help-center" element={<HelpCenter />} />
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
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/home-sections" element={<AdminHomeSections />} />
            <Route path="/admin/push-notifications" element={<AdminPushNotifications />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/fraud" element={<AdminFraud />} />
            <Route path="/admin/revenue" element={<AdminRevenue />} />
            <Route path="/admin/support" element={<AdminSupport />} />
            <Route path="/admin/content-pages" element={<AdminContentPages />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
