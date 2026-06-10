import api from './api';

// ── Admin: console-wide counters (requires admin JWT) ───────────────
// Returns: { totalUsers, vendors, pendingVendors, admins, suspended, flagged, pending }
// `pendingVendors` feeds the sidebar badge next to "Vendors".
export const getAdminStats = () => api.get('/admin/stats');
