import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, X, Phone, User as UserIcon, MapPin } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, Avatar, SearchInput, SegmentTabs, Button } from '../components';
import {
  listUsersAdmin,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
} from '../../../services/user.api';

// Admin Users page — buyers only. Vendors are managed in /admin/vendors.
// Login is OTP-only (no email), so the table and form key on `phone`.

const STATUSES = ['active', 'pending', 'flagged', 'suspended'];

const EMPTY_FORM = {
  name: '',
  phone: '',
  location: '',
  status: 'active',
  isPhoneVerified: true,
};

const AVATAR_COLORS = ['#0D9488', '#6D5BD0', '#2C5680', '#D08700', '#D14343', '#0B7A70'];
const colorFor = (id = '') => AVATAR_COLORS[(id.charCodeAt(0) + id.length) % AVATAR_COLORS.length];

const formatPhone = (p = '') => {
  const d = String(p).replace(/\D/g, '').slice(-10);
  return d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : p;
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toISOString().slice(0, 10);
};

const inputStyle = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  fontSize: 13.5,
  color: T.ink,
  fontWeight: 500,
  background: T.surfaceAlt,
  border: `1px solid ${T.line}`,
  borderRadius: radius.lg,
  fontFamily: 'inherit',
  outline: 'none',
};

const labelStyle = { fontSize: 12, fontWeight: 700, color: T.inkSoft, marginBottom: 6, display: 'block' };

const Field = ({ label, hint, required, children }) => (
  <div>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: T.danger, marginLeft: 3 }}>*</span>}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>{hint}</div>}
  </div>
);

const IconInput = ({ icon: Icon, ...props }) => (
  <div className="admin-focusable" style={{ display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}>
    {Icon && <Icon size={16} color={T.faint} strokeWidth={2.1} />}
    <input className="admin-input" {...props} style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: T.ink, fontWeight: 500 }} />
  </div>
);

const UserModal = ({ initial, onClose, onSaved }) => {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY_FORM;
    return {
      name: initial.name || '',
      phone: initial.phone || '',
      location: initial.location || '',
      status: initial.status || 'active',
      isPhoneVerified: initial.isPhoneVerified ?? true,
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Full name is required.');
    const phoneDigits = String(form.phone).replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      return setError('Enter a valid 10-digit Indian mobile number.');
    }

    const payload = {
      name: form.name.trim(),
      phone: phoneDigits,
      location: form.location?.trim() || '',
      status: form.status,
      isPhoneVerified: !!form.isPhoneVerified,
    };
    if (!isEdit) payload.role = 'user';

    setSaving(true);
    try {
      if (isEdit) await updateUserAdmin(initial.id, payload);
      else await createUserAdmin(payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the user.');
      setSaving(false);
    }
  };

  return (
    <div
      onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(16,16,20,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ width: 540, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', background: T.surface, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}` }}
        className="admin-scroll"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${T.lineSoft}`, position: 'sticky', top: 0, background: T.surface, borderRadius: `${radius['2xl']}px ${radius['2xl']}px 0 0`, zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{isEdit ? 'Edit Buyer' : 'New Buyer'}</div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>
              {isEdit ? 'Update profile and moderation status.' : 'Add a buyer account. They can sign in on the mobile app with their mobile number via OTP.'}
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{error}</div>
          )}

          <Field label="Full name" required>
            <IconInput icon={UserIcon} value={form.name} onChange={set('name')} placeholder="e.g. Rahul Sharma" autoFocus />
          </Field>

          <Field label="Mobile number" required hint="10-digit Indian mobile. Used to sign in via OTP — no email required.">
            <IconInput
              icon={Phone}
              value={form.phone}
              onChange={set('phone')}
              placeholder="98765 43210"
              inputMode="numeric"
              maxLength={13}
              disabled={isEdit}
            />
            {isEdit && <div style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>Mobile number cannot be changed after creation.</div>}
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Location" hint="City or region (optional).">
              <IconInput icon={MapPin} value={form.location} onChange={set('location')} placeholder="Indore" />
            </Field>
            <Field label="Account status">
              <select style={inputStyle} value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </Field>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg, padding: 12 }}>
            <input type="checkbox" checked={form.isPhoneVerified} onChange={set('isPhoneVerified')} style={{ width: 16, height: 16, accentColor: T.primary, marginTop: 2 }} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Pre-verify mobile number</span>
              <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.4 }}>
                Recommended. The buyer can sign in on the mobile app with this number immediately — they'll receive an OTP at login.
              </span>
            </span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 22px', borderTop: `1px solid ${T.lineSoft}`, position: 'sticky', bottom: 0, background: T.surface }}>
          <Button variant="soft" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={saving ? undefined : 'Check'} type="submit" style={saving ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Buyer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Users = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, pending: 0, flagged: 0, suspended: 0 });
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | 'new' | user object

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { role: 'user', limit: 100 };
      if (tab !== 'all') params.status = tab;
      if (q.trim()) params.search = q.trim();
      const { data } = await listUsersAdmin(params);
      setRows(data.results || []);
      setCounts({ all: 0, active: 0, pending: 0, flagged: 0, suspended: 0, ...(data.counts || {}) });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, q]);

  useEffect(() => {
    const t = setTimeout(fetchData, 250);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete buyer "${u.name}"? This cannot be undone.`)) return;
    try {
      await deleteUserAdmin(u.id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const columns = [
    {
      key: 'name', label: 'Buyer', strong: true,
      render: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 220 }}>
          <Avatar name={u.name} color={colorFor(u.id || u.phone || u.name)} size={36} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{u.name}</div>
            <div className="font-mono-num" style={{ fontSize: 11.5, color: T.muted }}>{formatPhone(u.phone)}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'verified', label: 'Login', render: (u) => (
        <StatusBadge
          status={u.isPhoneVerified ? 'verified' : 'pending'}
          label={u.isPhoneVerified ? 'OTP ready' : 'Unverified'}
          dot
          size="sm"
        />
      ),
    },
    {
      key: 'location', label: 'Location', render: (u) => (
        <span style={{ color: u.location ? T.inkSoft : T.faint }}>{u.location || '—'}</span>
      ),
    },
    { key: 'status', label: 'Status', render: (u) => <StatusBadge status={u.status} /> },
    { key: 'createdAt', label: 'Joined', mono: true, render: (u) => <span style={{ color: T.muted }}>{formatDate(u.createdAt)}</span> },
    {
      key: 'actions', label: '', align: 'right', render: (u) => (
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <button onClick={() => setModal(u)} className="admin-icon-btn" title="Edit" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(u)} className="admin-icon-btn" title="Delete" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const summary = [
    { label: 'Total Buyers', value: counts.all, sub: 'all statuses', color: T.primary },
    { label: 'Active', value: counts.active, sub: 'can sign in', color: T.info },
    { label: 'Flagged', value: counts.flagged, sub: 'needs review', color: T.amber },
    { label: 'Suspended', value: counts.suspended, sub: 'enforced', color: T.danger },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Users"
        subtitle="Buyer accounts — sign-in is via mobile OTP. Add, edit, or remove buyers below."
      >
        <Button variant="dark" icon="UserPlus" onClick={() => setModal('new')}>Add Buyer</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 18 }}>
        {summary.map((s, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius.xl, padding: 16, boxShadow: T.shadowXs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: s.color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>{s.label}</span>
            </div>
            <div className="font-mono-num" style={{ fontSize: 23, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 11.5, color: T.faint, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <Panel padded={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: 16, flexWrap: 'wrap', borderBottom: `1px solid ${T.lineSoft}` }}>
          <SegmentTabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'active', label: 'Active', count: counts.active },
              { id: 'pending', label: 'Pending', count: counts.pending },
              { id: 'flagged', label: 'Flagged', count: counts.flagged },
              { id: 'suspended', label: 'Suspended', count: counts.suspended },
            ]}
          />
          <SearchInput value={q} onChange={setQ} placeholder="Search by name, phone, location…" />
        </div>
        <div style={{ padding: 20 }}>
          {error ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: T.danger, fontSize: 13.5, fontWeight: 600 }}>{error}</div>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              emptyText={loading ? 'Loading buyers…' : 'No buyers match your filters — add one to get started.'}
            />
          )}
        </div>
      </Panel>

      {modal && (
        <UserModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchData(); }}
        />
      )}
    </>
  );
};

export default Users;
