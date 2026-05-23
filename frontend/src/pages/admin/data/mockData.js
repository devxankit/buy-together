// Buy Together — Admin mock data
// Stand-in data so the console renders fully before the admin APIs are wired.
// Each export maps cleanly to a future endpoint (see services/*.api.js).

/* ── Dashboard KPIs ──────────────────────────────────────────── */
export const kpis = [
  { id: 'users',   label: 'Total Users',     value: 48259, prefix: '',  delta: 12.4, trend: 'up',   spark: [22,28,26,34,38,36,44,48,46,52,58,62], icon: 'Users',     accent: 'primary' },
  { id: 'groups',  label: 'Active Groups',   value: 3142,  prefix: '',  delta: 8.1,  trend: 'up',   spark: [12,14,18,16,22,26,24,30,28,34,38,42], icon: 'Boxes',     accent: 'violet' },
  { id: 'gmv',     label: 'Gross Deal Value', value: 8.42, prefix: '₹', suffix: 'Cr', delta: 18.7, trend: 'up', spark: [4,5,6,5,7,8,9,11,10,13,15,17], icon: 'IndianRupee', accent: 'info' },
  { id: 'pending', label: 'Pending Approvals', value: 27, prefix: '',  delta: 4.0,  trend: 'down', spark: [40,38,34,30,28,26,24,22,20,18,16,14], icon: 'ClockAlert', accent: 'amber' },
];

export const revenueSeries = [
  { m: 'Jun', value: 32 }, { m: 'Jul', value: 41 }, { m: 'Aug', value: 38 },
  { m: 'Sep', value: 54 }, { m: 'Oct', value: 61 }, { m: 'Nov', value: 58 },
  { m: 'Dec', value: 72 }, { m: 'Jan', value: 84 }, { m: 'Feb', value: 79 },
  { m: 'Mar', value: 96 }, { m: 'Apr', value: 108 }, { m: 'May', value: 124 },
];

export const categoryDemand = [
  { label: 'Electronics', value: 38, color: '#0D9488' },
  { label: 'Automobile',  value: 24, color: '#6D5BD0' },
  { label: 'Appliances',  value: 16, color: '#2C5680' },
  { label: 'Fashion',     value: 12, color: '#D08700' },
  { label: 'Grocery',     value: 10, color: '#D14343' },
];

export const activityFeed = [
  { id: 1, type: 'group',   title: 'New group created', detail: '“iPhone 16 Pro — Bulk Buy” by Rahul S.', time: '2m ago', icon: 'Boxes',       accent: 'primary' },
  { id: 2, type: 'vendor',  title: 'Vendor approval requested', detail: 'TechWorld Distributors submitted KYC', time: '14m ago', icon: 'Store',  accent: 'amber' },
  { id: 3, type: 'deal',    title: 'Deal locked',       detail: '“Baleno @ ₹8L” reached 10/10 buyers', time: '38m ago', icon: 'Handshake',  accent: 'violet' },
  { id: 4, type: 'fraud',   title: 'Fraud signal flagged', detail: '6 accounts share device fingerprint', time: '1h ago', icon: 'ShieldAlert', accent: 'danger' },
  { id: 5, type: 'user',    title: '128 new sign-ups',  detail: 'Spike from Indore region', time: '2h ago', icon: 'UserPlus',  accent: 'info' },
  { id: 6, type: 'deal',    title: 'Deal completed',    detail: '“Smart TV bundle” — ₹4.2L disbursed', time: '3h ago', icon: 'CheckCircle2', accent: 'primary' },
];

/* ── Users ───────────────────────────────────────────────────── */
export const users = [
  { id: 'U-10421', name: 'Rahul Sharma',   email: 'rahul.s@gmail.com',   phone: '+91 98765 43210', role: 'buyer',  status: 'active',   groups: 14, intent: 92, location: 'Indore',    joined: '2025-11-02', avatar: '#0D9488' },
  { id: 'U-10422', name: 'Priya Verma',    email: 'priya.v@gmail.com',   phone: '+91 99887 66554', role: 'buyer',  status: 'active',   groups: 9,  intent: 78, location: 'Bhopal',    joined: '2025-12-14', avatar: '#6D5BD0' },
  { id: 'U-10423', name: 'Aman Gupta',     email: 'aman.g@outlook.com',  phone: '+91 91234 55678', role: 'buyer',  status: 'flagged',  groups: 3,  intent: 22, location: 'Indore',    joined: '2026-03-21', avatar: '#D14343' },
  { id: 'U-10424', name: 'Sneha Iyer',     email: 'sneha.iyer@gmail.com',phone: '+91 90909 80808', role: 'buyer',  status: 'active',   groups: 21, intent: 96, location: 'Pune',      joined: '2025-09-08', avatar: '#2C5680' },
  { id: 'U-10425', name: 'TechWorld Dist.',email: 'sales@techworld.in',  phone: '+91 80012 30045', role: 'vendor', status: 'pending',  groups: 2,  intent: 64, location: 'Mumbai',    joined: '2026-05-18', avatar: '#D08700' },
  { id: 'U-10426', name: 'Karan Mehta',    email: 'karan.m@gmail.com',   phone: '+91 97000 11223', role: 'buyer',  status: 'suspended',groups: 1,  intent: 8,  location: 'Delhi',     joined: '2026-04-30', avatar: '#33333B' },
  { id: 'U-10427', name: 'Fatima Khan',    email: 'fatima.k@gmail.com',  phone: '+91 93456 78901', role: 'buyer',  status: 'active',   groups: 17, intent: 88, location: 'Hyderabad', joined: '2025-10-19', avatar: '#0B7A70' },
  { id: 'U-10428', name: 'BulkBazaar LLP', email: 'ops@bulkbazaar.com',  phone: '+91 80456 12390', role: 'vendor', status: 'active',   groups: 38, intent: 71, location: 'Surat',     joined: '2025-08-11', avatar: '#6D5BD0' },
  { id: 'U-10429', name: 'Vivek Nair',     email: 'vivek.n@gmail.com',   phone: '+91 99001 22334', role: 'buyer',  status: 'active',   groups: 6,  intent: 54, location: 'Kochi',     joined: '2026-01-25', avatar: '#2C5680' },
  { id: 'U-10430', name: 'Anita Desai',    email: 'anita.d@gmail.com',   phone: '+91 95555 44332', role: 'buyer',  status: 'flagged',  groups: 2,  intent: 19, location: 'Indore',    joined: '2026-05-09', avatar: '#D14343' },
];

/* ── Groups ──────────────────────────────────────────────────── */
export const groups = [
  { id: 'G-3001', name: 'iPhone 16 Pro — Bulk Buy', category: 'Electronics', type: 'user',   creator: 'Rahul Sharma', target: 50, current: 47, location: 'Indore',  status: 'near',     created: '2026-05-10' },
  { id: 'G-3002', name: 'Baleno @ ₹8L Group',       category: 'Automobile',  type: 'vendor', creator: 'BulkBazaar',   target: 10, current: 10, location: 'Mumbai',  status: 'locked',   created: '2026-05-08' },
  { id: 'G-3003', name: 'Smart TV Bundle Deal',     category: 'Electronics', type: 'vendor', creator: 'TechWorld',    target: 30, current: 30, location: 'Pune',    status: 'completed',created: '2026-04-28' },
  { id: 'G-3004', name: 'Wholesale Rice 25kg',      category: 'Grocery',     type: 'user',   creator: 'Fatima Khan',  target: 100,current: 34, location: 'Hyderabad',status:'active',   created: '2026-05-15' },
  { id: 'G-3005', name: 'Split AC 1.5T Combo',      category: 'Appliances',  type: 'user',   creator: 'Sneha Iyer',   target: 40, current: 12, location: 'Pune',    status: 'active',   created: '2026-05-19' },
  { id: 'G-3006', name: 'Designer Kurti Lot',       category: 'Fashion',     type: 'vendor', creator: 'BulkBazaar',   target: 60, current: 58, location: 'Surat',   status: 'near',     created: '2026-05-12' },
  { id: 'G-3007', name: 'Gaming Laptop Group',      category: 'Electronics', type: 'user',   creator: 'Vivek Nair',   target: 25, current: 3,  location: 'Kochi',   status: 'active',   created: '2026-05-20' },
  { id: 'G-3008', name: 'Refurb iPhone Lot (dup?)', category: 'Electronics', type: 'user',   creator: 'Aman Gupta',   target: 50, current: 5,  location: 'Indore',  status: 'flagged',  created: '2026-05-21' },
];

/* ── Vendors (approval pipeline) ─────────────────────────────── */
export const vendors = [
  { id: 'V-501', name: 'TechWorld Distributors', category: 'Electronics', city: 'Mumbai',  rating: 4.6, deals: 124, gmv: '₹2.1Cr', status: 'pending',  kyc: 'submitted', joined: '2026-05-18' },
  { id: 'V-502', name: 'BulkBazaar LLP',         category: 'Multi',       city: 'Surat',   rating: 4.8, deals: 312, gmv: '₹5.4Cr', status: 'verified', kyc: 'verified',  joined: '2025-08-11' },
  { id: 'V-503', name: 'AutoHub Motors',         category: 'Automobile',  city: 'Delhi',   rating: 4.2, deals: 56,  gmv: '₹3.8Cr', status: 'verified', kyc: 'verified',  joined: '2025-10-02' },
  { id: 'V-504', name: 'CoolBreeze Appliances',  category: 'Appliances',  city: 'Pune',    rating: 3.9, deals: 18,  gmv: '₹62L',   status: 'pending',  kyc: 'submitted', joined: '2026-05-16' },
  { id: 'V-505', name: 'QuickGrocers Wholesale', category: 'Grocery',     city: 'Indore',  rating: 4.4, deals: 89,  gmv: '₹1.2Cr', status: 'verified', kyc: 'verified',  joined: '2025-12-01' },
  { id: 'V-506', name: 'StyleCart Traders',      category: 'Fashion',     city: 'Jaipur',  rating: 2.8, deals: 4,   gmv: '₹8L',    status: 'rejected', kyc: 'failed',    joined: '2026-04-22' },
];

/* ── Deals ───────────────────────────────────────────────────── */
export const deals = [
  { id: 'D-9001', group: 'Baleno @ ₹8L Group',   vendor: 'AutoHub Motors',  value: '₹80,00,000', buyers: 10, stage: 'confirmation', commission: '₹2.4L', date: '2026-05-20' },
  { id: 'D-9002', group: 'Smart TV Bundle Deal',  vendor: 'TechWorld',       value: '₹4,20,000',  buyers: 30, stage: 'completed',    commission: '₹12.6K',date: '2026-04-30' },
  { id: 'D-9003', group: 'Split AC 1.5T Combo',   vendor: 'CoolBreeze',      value: '₹6,80,000',  buyers: 17, stage: 'negotiation',  commission: '—',     date: '2026-05-19' },
  { id: 'D-9004', group: 'Wholesale Rice 25kg',   vendor: 'QuickGrocers',    value: '₹1,15,000',  buyers: 34, stage: 'confirmation', commission: '₹3.4K', date: '2026-05-18' },
  { id: 'D-9005', group: 'Designer Kurti Lot',    vendor: 'StyleCart',       value: '₹2,90,000',  buyers: 58, stage: 'disputed',     commission: '—',     date: '2026-05-12' },
];

/* ── Fraud signals ───────────────────────────────────────────── */
export const fraudSignals = [
  { id: 'F-201', type: 'Device cluster',   severity: 'high',   detail: '6 accounts sharing one device fingerprint', entity: 'U-10423 +5', score: 91, time: '1h ago' },
  { id: 'F-202', type: 'Duplicate group',  severity: 'medium', detail: '“Refurb iPhone Lot” mirrors G-3001 (94% match)', entity: 'G-3008', score: 67, time: '4h ago' },
  { id: 'F-203', type: 'Velocity anomaly', severity: 'high',   detail: '40 joins in 90s from single IP block', entity: '103.21.x.x', score: 88, time: '6h ago' },
  { id: 'F-204', type: 'Vendor mismatch',  severity: 'low',    detail: 'KYC name differs from bank account holder', entity: 'V-506', score: 41, time: '1d ago' },
  { id: 'F-205', type: 'Low intent ring',  severity: 'medium', detail: '12 accounts: join → never engage pattern', entity: 'Cluster #14', score: 58, time: '1d ago' },
];

/* ── Demand heatmap (region × category intensity 0-100) ──────── */
export const heatmapRegions = ['Indore', 'Mumbai', 'Pune', 'Delhi', 'Hyderabad', 'Surat'];
export const heatmapCategories = ['Electronics', 'Auto', 'Appliances', 'Fashion', 'Grocery'];
export const heatmap = [
  [92, 40, 70, 55, 30],
  [78, 88, 64, 72, 45],
  [85, 35, 80, 50, 38],
  [60, 76, 55, 68, 42],
  [88, 30, 60, 44, 70],
  [50, 28, 48, 90, 80],
];

export const topContributors = [
  { rank: 1, name: 'Sneha Iyer',   points: 4820, groups: 21, badge: 'Legend' },
  { rank: 2, name: 'Fatima Khan',  points: 4110, groups: 17, badge: 'Champion' },
  { rank: 3, name: 'Rahul Sharma', points: 3640, groups: 14, badge: 'Pro' },
  { rank: 4, name: 'Vivek Nair',   points: 1920, groups: 6,  badge: 'Rising' },
];

/* ── Notifications (topbar) ──────────────────────────────────── */
export const notifications = [
  { id: 1, title: 'New vendor KYC awaiting review', time: '12m ago', accent: 'amber',  unread: true },
  { id: 2, title: 'High-severity fraud signal F-201', time: '1h ago', accent: 'danger', unread: true },
  { id: 3, title: 'Deal D-9001 entered confirmation', time: '2h ago', accent: 'violet', unread: true },
  { id: 4, title: 'Weekly demand report is ready', time: '5h ago', accent: 'primary', unread: false },
];
