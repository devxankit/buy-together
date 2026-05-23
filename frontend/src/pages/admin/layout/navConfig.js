// Sidebar navigation map. `icon` keys resolve against lucide-react.
// Grouped into sections; `badge` keys read live counts from the badges arg.

export const navSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard',   icon: 'LayoutDashboard', path: '/admin' },
      { label: 'Analytics',   icon: 'ChartColumnBig',  path: '/admin/analytics' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users',       icon: 'Users',     path: '/admin/users' },
      { label: 'Groups',      icon: 'Boxes',     path: '/admin/groups' },
      { label: 'Vendors',     icon: 'Store',     path: '/admin/vendors', badge: 'vendors' },
      { label: 'Deals',       icon: 'Handshake', path: '/admin/deals' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'Fraud & Risk', icon: 'ShieldAlert', path: '/admin/fraud', badge: 'fraud' },
      { label: 'Revenue',      icon: 'IndianRupee', path: '/admin/revenue' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings',     icon: 'Settings',    path: '/admin/settings' },
    ],
  },
];

// Flat lookup for breadcrumbs / page titles.
export const routeMeta = {
  '/admin':           { title: 'Dashboard',     section: 'Overview' },
  '/admin/analytics': { title: 'Analytics',     section: 'Overview' },
  '/admin/users':     { title: 'Users',         section: 'Management' },
  '/admin/groups':    { title: 'Groups',        section: 'Management' },
  '/admin/vendors':   { title: 'Vendors',       section: 'Management' },
  '/admin/deals':     { title: 'Deals',         section: 'Management' },
  '/admin/fraud':     { title: 'Fraud & Risk',  section: 'Intelligence' },
  '/admin/revenue':   { title: 'Revenue',       section: 'Intelligence' },
  '/admin/settings':  { title: 'Settings',      section: 'System' },
};
