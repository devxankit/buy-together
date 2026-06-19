import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, X, Phone, User as UserIcon, MapPin, MessageSquare, Search, MessagesSquare, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, Avatar, SearchInput, SegmentTabs, Button, ChatTranscript, StatCard } from '../components';
import { showToast } from '../../../utils/toast';
import {
  listUsersAdmin,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  getUserStatsAdmin,
} from '../../../services/user.api';
import { getUserConversationsAdmin, getUserDmMessagesAdmin } from '../../../services/admin.api';

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
      if (isEdit) {
        await updateUserAdmin(initial.id, payload);
        showToast('Buyer updated successfully! 🎉');
      } else {
        await createUserAdmin(payload);
        showToast('Buyer created successfully! 🎉');
      }
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

// ── One-to-one chat viewer (read-only) ──────────────────────────────
// Left pane: the people this user DMs with. Right pane: the selected transcript.
const UserChatModal = ({ user, onClose }) => {
  const [convos, setConvos] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [convoError, setConvoError] = useState('');
  const [q, setQ] = useState('');

  const [selected, setSelected] = useState(null); // the contact (other user) object
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [msgError, setMsgError] = useState('');

  // Load the user's conversation list.
  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingConvos(true);
      setConvoError('');
      try {
        const { data } = await getUserConversationsAdmin(user.id);
        if (active) setConvos(data || []);
      } catch (err) {
        if (active) setConvoError(err.response?.data?.message || 'Failed to load conversations.');
      } finally {
        if (active) setLoadingConvos(false);
      }
    })();
    return () => { active = false; };
  }, [user.id]);

  // Load the transcript for the selected contact.
  useEffect(() => {
    if (!selected) return;
    let active = true;
    (async () => {
      setLoadingMsgs(true);
      setMsgError('');
      setMessages([]);
      try {
        const { data } = await getUserDmMessagesAdmin(user.id, selected.id, 500);
        if (active) setMessages(data || []);
      } catch (err) {
        if (active) setMsgError(err.response?.data?.message || 'Failed to load messages.');
      } finally {
        if (active) setLoadingMsgs(false);
      }
    })();
    return () => { active = false; };
  }, [selected, user.id]);

  const filtered = convos.filter((c) => c.name?.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div
      onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(16,16,20,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{ width: 880, maxWidth: '100%', height: '82vh', display: 'flex', flexDirection: 'column', background: T.surface, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}`, overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 18px', borderBottom: `1px solid ${T.line}` }}>
          <Avatar name={user.name} color={colorFor(user.id || user.phone || user.name)} size={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}'s chats</div>
            <div style={{ fontSize: 11.5, color: T.muted }}>One-to-one conversations · read-only</div>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* Conversation list */}
          <div style={{ width: 280, borderRight: `1px solid ${T.line}`, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.surfaceAlt }}>
            <div style={{ padding: 10, borderBottom: `1px solid ${T.line}` }}>
              <div className="admin-focusable" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 10px', background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius.lg }}>
                <Search size={15} color={T.faint} />
                <input className="admin-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search contacts…" style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: T.ink, fontWeight: 500 }} />
              </div>
            </div>
            <div className="admin-scroll" style={{ flex: 1, overflowY: 'auto' }}>
              {loadingConvos ? (
                <div style={{ padding: 24, textAlign: 'center', color: T.muted, fontSize: 12.5 }}>Loading…</div>
              ) : convoError ? (
                <div style={{ padding: 20, textAlign: 'center', color: T.danger, fontSize: 12.5, fontWeight: 600 }}>{convoError}</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: T.faint, fontSize: 12.5 }}>
                  {convos.length === 0 ? 'This user has no one-to-one chats yet.' : 'No contacts match your search.'}
                </div>
              ) : (
                filtered.map((c) => {
                  const isActive = selected?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: 'none', borderBottom: `1px solid ${T.lineSoft}`, background: isActive ? T.primarySoft : 'transparent', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <Avatar name={c.name} src={c.avatar} color={colorFor(c.id)} size={34} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? T.primary : T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                        <div style={{ fontSize: 11.5, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMessage || '—'}</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Transcript */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.surfaceAlt }}>
            {!selected ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: T.faint }}>
                <MessagesSquare size={30} />
                <div style={{ fontSize: 13, fontWeight: 600 }}>Select a conversation to read it</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: `1px solid ${T.line}`, background: T.surface }}>
                  <Avatar name={selected.name} src={selected.avatar} color={colorFor(selected.id)} size={30} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{selected.name}</div>
                    <div className="font-mono-num" style={{ fontSize: 11, color: T.muted }}>{formatPhone(selected.phone)}</div>
                  </div>
                </div>
                <div className="admin-scroll" style={{ flex: 1, overflowY: 'auto' }}>
                  <ChatTranscript
                    messages={messages}
                    meId={user.id}
                    loading={loadingMsgs}
                    error={msgError}
                    emptyText="No messages in this conversation."
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// A titled grid of StatCards.
const StatSection = ({ title, subtitle, items }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{subtitle}</div>}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
      {items.map((s, i) => (
        <StatCard key={s.label} index={i} label={s.label} value={s.value} icon={s.icon} accent={s.accent} />
      ))}
    </div>
  </div>
);

const Users = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, pending: 0, flagged: 0, suspended: 0 });
  const [activityCounts, setActivityCounts] = useState({ all: 0, ingroup: 0, nogroup: 0, chatting: 0 });
  const [tab, setTab] = useState('all');
  const [activity, setActivity] = useState('all'); // all | ingroup | nogroup | chatting
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | 'new' | user object
  const [chatOf, setChatOf] = useState(null); // null | user object
  const [stats, setStats] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false); // expanded detailed stats sheet

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await getUserStatsAdmin();
      setStats(data);
    } catch {
      // Non-fatal — the table still works without the stats strip.
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { role: 'user', limit: 100 };
      if (tab !== 'all') params.status = tab;
      if (activity !== 'all') params.activity = activity;
      if (q.trim()) params.search = q.trim();
      const { data } = await listUsersAdmin(params);
      setRows(data.results || []);
      setCounts({ all: 0, active: 0, pending: 0, flagged: 0, suspended: 0, ...(data.counts || {}) });
      setActivityCounts({ all: 0, ingroup: 0, nogroup: 0, chatting: 0, ...(data.activityCounts || {}) });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, activity, q]);

  useEffect(() => {
    const t = setTimeout(fetchData, 250);
    return () => clearTimeout(t);
  }, [fetchData]);

  useEffect(() => {
    const t = setTimeout(fetchStats, 0);
    return () => clearTimeout(t);
  }, [fetchStats]);

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete buyer "${u.name}"? This cannot be undone.`)) return;
    try {
      await deleteUserAdmin(u.id);
      showToast(`Buyer "${u.name}" deleted!`, '🗑️');
      fetchData();
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user.', '❌');
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
          <button onClick={() => setChatOf(u)} className="admin-icon-btn" title="View chats" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.info, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} />
          </button>
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

  // Stat strip values fall back to 0 until the stats endpoint resolves.
  const s = stats || {};
  // Top 4 always-visible summary cards.
  const summaryStats = [
    { label: 'Total Buyers', value: s.total ?? counts.all, icon: 'Users', accent: 'primary' },
    { label: 'Active', value: s.active ?? counts.active, icon: 'UserCheck', accent: 'info' },
    { label: 'Flagged', value: s.flagged ?? counts.flagged, icon: 'Flag', accent: 'amber' },
    { label: 'Suspended', value: s.suspended ?? counts.suspended, icon: 'Ban', accent: 'danger' },
  ];
  const activityStats = [
    { label: 'Daily Active', value: s.dau ?? 0, icon: 'Activity', accent: 'primary' },
    { label: 'Weekly Active', value: s.wau ?? 0, icon: 'CalendarDays', accent: 'info' },
    { label: 'Monthly Active', value: s.mau ?? 0, icon: 'CalendarRange', accent: 'violet' },
    { label: 'New Today', value: s.newToday ?? 0, icon: 'UserPlus', accent: 'info' },
    { label: 'New This Month', value: s.newThisMonth ?? 0, icon: 'TrendingUp', accent: 'primary' },
  ];
  const engagementStats = [
    { label: 'In a Group', value: s.inGroup ?? activityCounts.ingroup, icon: 'Users', accent: 'info' },
    { label: 'Not in any Group', value: s.noGroup ?? activityCounts.nogroup, icon: 'UserX', accent: 'amber' },
    { label: 'Actively Chatting', value: s.chatting ?? activityCounts.chatting, icon: 'MessageSquare', accent: 'violet' },
    { label: 'Highly Active', value: s.highlyActive ?? 0, icon: 'Flame', accent: 'danger' },
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

      {/* Summary cards + expandable detailed statistics */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
          {summaryStats.map((st, i) => (
            <StatCard key={st.label} index={i} label={st.label} value={st.value} icon={st.icon} accent={st.accent} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <button
            onClick={() => setStatsOpen((o) => !o)}
            className="admin-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 16px', borderRadius: 999, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, cursor: 'pointer', fontSize: 12.5, fontWeight: 700, boxShadow: T.shadowXs }}
          >
            {statsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            {statsOpen ? 'Show less' : 'See more statistics'}
          </button>
        </div>

        {statsOpen && (
          <div className="admin-fade-up" style={{ marginTop: 14, padding: '20px 20px 8px', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.xl }}>
            <StatSection title="Activity" subtitle="Active buyers by their most recent login." items={activityStats} />
            <StatSection title="Engagement" subtitle="Group membership and one-to-one chat activity." items={engagementStats} />
            <div style={{ fontSize: 11.5, color: T.faint, paddingBottom: 4 }}>
              “Highly Active” = buyers who are both in a group and actively chatting. Activity is based on last login.
            </div>
          </div>
        )}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="admin-focusable" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 10px 0 12px', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}>
                <Filter size={15} color={T.faint} strokeWidth={2.1} />
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  title="Filter by group membership & chat activity"
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: activity === 'all' ? T.inkSoft : T.primary, fontFamily: 'inherit', cursor: 'pointer' }}
                >
                  <option value="all">All users ({activityCounts.all})</option>
                  <option value="ingroup">In a group ({activityCounts.ingroup})</option>
                  <option value="nogroup">Not in any group ({activityCounts.nogroup})</option>
                  <option value="chatting">Actively chatting ({activityCounts.chatting})</option>
                </select>
              </div>
              <SearchInput value={q} onChange={setQ} placeholder="Search by name, phone, location…" />
            </div>
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
          onSaved={() => { setModal(null); fetchData(); fetchStats(); }}
        />
      )}

      {chatOf && (
        <UserChatModal user={chatOf} onClose={() => setChatOf(null)} />
      )}
    </>
  );
};

export default Users;
