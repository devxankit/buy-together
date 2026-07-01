// Sidebar navigation map. `icon` keys resolve against lucide-react.
// Grouped into sections; `badge` keys read live counts from the badges arg.

export const navSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard',   icon: 'LayoutDashboard', path: '/admin' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users',       icon: 'Users',     path: '/admin/users', permission: 'users' },
      { label: 'Groups',      icon: 'Boxes',     path: '/admin/groups', permission: 'groups' },
      { label: 'Categories',  icon: 'Tags',      path: '/admin/categories', permission: 'categories' },
      { label: 'Banners',     icon: 'Image',     path: '/admin/banners', permission: 'banners' },
      { label: 'Home Sections', icon: 'LayoutTemplate', path: '/admin/home-sections', permission: 'homeSections' },
      { label: 'Vendors',     icon: 'Store',     path: '/admin/vendors', badge: 'vendors', permission: 'vendors' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'Fraud & Risk', icon: 'ShieldAlert', path: '/admin/fraud', permission: 'fraud' },
      { label: 'Revenue',      icon: 'IndianRupee', path: '/admin/revenue', permission: 'revenue' },
    ],
  },
  {
    title: 'Support & Content',
    items: [
      { label: 'Support Tickets', icon: 'LifeBuoy', path: '/admin/support', permission: 'support' },
      { label: 'Content Pages',   icon: 'FileText', path: '/admin/content-pages', permission: 'content' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Notifications', icon: 'Bell', path: '/admin/notifications' },
      { label: 'Push Notifications', icon: 'BellRing', path: '/admin/push-notifications', permission: 'pushNotifications' },
      { label: 'Settings',     icon: 'Settings',    path: '/admin/settings' },
    ],
  },
];

// Whether the given admin may see a nav item. Items without a `permission`
// (Dashboard, Settings) are always visible. Super admins see everything.
export const canAccess = (user, item) => {
  if (!item.permission) return true; // Dashboard, Settings — always visible
  if (!user) return false;
  if (user.isSuperAdmin) return true;
  // Backwards-compat: a session created before permissions existed (neither
  // field present) is treated as a legacy full-access admin so nobody is locked
  // out before they re-login. New admins always carry a permissions array.
  if (user.isSuperAdmin === undefined && user.permissions === undefined) return true;
  return Array.isArray(user.permissions) && user.permissions.includes(item.permission);
};

// Nav sections filtered to what the admin can access (empty sections dropped).
export const getVisibleSections = (user) =>
  navSections
    .map((sec) => ({ ...sec, items: sec.items.filter((it) => canAccess(user, it)) }))
    .filter((sec) => sec.items.length > 0);

// Flat lookup for breadcrumbs / page titles.
export const routeMeta = {
  '/admin':           { title: 'Dashboard',     section: 'Overview' },
  '/admin/users':     { title: 'Users',         section: 'Management' },
  '/admin/groups':    { title: 'Groups',        section: 'Management' },
  '/admin/categories':{ title: 'Categories',    section: 'Management' },
  '/admin/banners':   { title: 'Banners',       section: 'Management' },
  '/admin/home-sections': { title: 'Home Sections', section: 'Management' },
  '/admin/vendors':   { title: 'Vendors',       section: 'Management' },
  '/admin/fraud':     { title: 'Fraud & Risk',  section: 'Intelligence' },
  '/admin/revenue':   { title: 'Revenue',       section: 'Intelligence' },
  '/admin/support':   { title: 'Support Tickets', section: 'Support & Content' },
  '/admin/content-pages': { title: 'Content Pages', section: 'Support & Content' },
  '/admin/push-notifications': { title: 'Push Notifications', section: 'System' },
  '/admin/notifications': { title: 'Notifications', section: 'System' },
  '/admin/settings':  { title: 'Settings',      section: 'System' },
};
