import { useState, useEffect, useCallback } from 'react';
import { Trash2, X, Eye, Filter } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, SearchInput, SegmentTabs, Button, ConfirmDialog } from '../components';
import { showToast } from '../../../utils/toast';
import { ADMIN_STATS_REFRESH_EVENT } from '../layout/AdminLayout';
import {
  listTicketsAdmin,
  getTicketAdmin,
  replyToTicketAdmin,
  updateTicketAdmin,
  deleteTicketAdmin,
} from '../../../services/ticket.api';

// Ticket status → StatusBadge colour keyword + display label.
const STATUS_BADGE = {
  open: { status: 'pending', label: 'Open' },
  in_progress: { status: 'negotiation', label: 'In Progress' },
  resolved: { status: 'completed', label: 'Resolved' },
  closed: { status: 'low', label: 'Closed' },
};

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const selectStyle = {
  height: 36, padding: '0 10px', fontSize: 13, color: T.ink, fontWeight: 600,
  background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg,
  fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
};

const fmt = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  catch { return '—'; }
};

const TicketBadge = ({ status }) => {
  const b = STATUS_BADGE[status] || { status: 'low', label: status };
  return <StatusBadge status={b.status} label={b.label} />;
};

// ── Ticket detail / reply modal ─────────────────────────────────────
const TicketModal = ({ ticketId, onClose, onChanged }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTicketAdmin(ticketId);
      setTicket(data);
    } catch {
      showToast('Could not load ticket.', '❌');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { load(); }, [load]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const { data } = await replyToTicketAdmin(ticketId, reply.trim());
      setTicket(data);
      setReply('');
      onChanged?.();
    } catch {
      showToast('Could not send reply.', '❌');
    } finally {
      setSending(false);
    }
  };

  const changeField = async (field, value) => {
    try {
      const { data } = await updateTicketAdmin(ticketId, { [field]: value });
      setTicket(data);
      showToast(`Ticket ${field === 'status' ? 'status' : 'priority'} updated.`);
      onChanged?.();
    } catch {
      showToast('Could not update ticket.', '❌');
    }
  };

  return (
    <div onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(16,16,20,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div onMouseDown={(e) => e.stopPropagation()}
        style={{ width: 640, maxWidth: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: T.surface, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}` }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '18px 22px', borderBottom: `1px solid ${T.lineSoft}` }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>
              {loading ? 'Loading…' : ticket?.subject}
            </div>
            {ticket && (
              <div style={{ fontSize: 12.5, color: T.muted, marginTop: 3 }}>
                {ticket.user?.name || ticket.name || 'User'}
                {ticket.user?.phone ? ` · ${ticket.user.phone}` : ''} · <span style={{ textTransform: 'capitalize' }}>{ticket.category}</span> · {fmt(ticket.createdAt)}
              </div>
            )}
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        {ticket && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderBottom: `1px solid ${T.lineSoft}`, background: T.surfaceAlt, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft }}>Status</span>
            <select style={selectStyle} value={ticket.status} onChange={(e) => changeField('status', e.target.value)}>
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft, marginLeft: 6 }}>Priority</span>
            <select style={selectStyle} value={ticket.priority} onChange={(e) => changeField('priority', e.target.value)}>
              {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        )}

        {/* Thread */}
        <div className="admin-scroll" style={{ flex: 1, overflowY: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: T.faint, fontSize: 13, padding: 30 }}>Loading conversation…</div>
          ) : (
            (ticket?.thread || []).map((m, i) => {
              const isAdmin = m.sender === 'admin';
              return (
                <div key={m.id || i} style={{ alignSelf: isAdmin ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: T.faint, marginBottom: 3, textAlign: isAdmin ? 'right' : 'left' }}>
                    {isAdmin ? (m.senderName || 'Support') : (ticket.user?.name || m.senderName || 'User')} · {fmt(m.createdAt)}
                  </div>
                  <div style={{
                    background: isAdmin ? T.primary : T.surfaceAlt,
                    color: isAdmin ? '#fff' : T.ink,
                    border: isAdmin ? 'none' : `1px solid ${T.line}`,
                    borderRadius: radius.lg, padding: '10px 13px', fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-line',
                  }}>
                    {m.body}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reply box */}
        <div style={{ display: 'flex', gap: 10, padding: '14px 22px', borderTop: `1px solid ${T.lineSoft}`, alignItems: 'flex-end' }}>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply to the user…"
            rows={2}
            style={{ flex: 1, resize: 'none', padding: '10px 12px', fontSize: 13, color: T.ink, fontWeight: 500, background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg, fontFamily: 'inherit', outline: 'none' }}
          />
          <Button variant="primary" icon={sending ? undefined : 'Send'} onClick={sendReply} style={(sending || !reply.trim()) ? { opacity: 0.6, pointerEvents: 'none' } : undefined}>
            {sending ? 'Sending…' : 'Reply'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Support = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ all: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 });
  const [tab, setTab] = useState('all');
  const [category, setCategory] = useState('all');
  const [q, setQ] = useState(() => {
    const saved = sessionStorage.getItem('admin_search_query');
    if (saved) {
      sessionStorage.removeItem('admin_search_query');
      return saved;
    }
    return '';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Listen for real-time global search events
  useEffect(() => {
    const handleGlobalSearch = (e) => {
      if (e.detail !== undefined) setQ(e.detail);
    };
    window.addEventListener('admin:search', handleGlobalSearch);
    return () => window.removeEventListener('admin:search', handleGlobalSearch);
  }, []);

  // Dispatch search query to sync other search inputs (like the topbar)
  const handleLocalSearch = (newVal) => {
    setQ(newVal);
    window.dispatchEvent(new CustomEvent('admin:search', { detail: newVal }));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (tab !== 'all') params.status = tab;
      if (category !== 'all') params.category = category;
      if (q.trim()) params.search = q.trim();
      const { data } = await listTicketsAdmin(params);
      setRows(data.results || []);
      setCounts(data.counts || { all: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, category, q]);

  useEffect(() => {
    const t = setTimeout(fetchData, 250);
    return () => clearTimeout(t);
  }, [fetchData]);

  // Keep the sidebar "open tickets" badge fresh after any change.
  const refreshBadges = () => window.dispatchEvent(new Event(ADMIN_STATS_REFRESH_EVENT));

  const doDelete = async () => {
    if (!confirmDel) return;
    setDeleting(true);
    try {
      await deleteTicketAdmin(confirmDel.id);
      showToast('Ticket deleted.', '🗑️');
      setConfirmDel(null);
      fetchData();
      refreshBadges();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete ticket.', '❌');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'subject', label: 'Ticket', strong: true, render: (t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 280 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</span>
          <span style={{ fontSize: 11, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.message}</span>
        </div>
      ),
    },
    {
      key: 'user', label: 'User', render: (t) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: T.inkSoft }}>{t.user?.name || t.name || '—'}</span>
          <span style={{ fontSize: 11, color: T.muted }}>{t.user?.phone || t.email || ''}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (t) => <span style={{ fontSize: 12, color: T.inkSoft, textTransform: 'capitalize' }}>{t.category}</span> },
    { key: 'priority', label: 'Priority', render: (t) => <StatusBadge status={t.priority} size="sm" /> },
    { key: 'status', label: 'Status', render: (t) => <TicketBadge status={t.status} /> },
    { key: 'lastMessageAt', label: 'Updated', render: (t) => <span style={{ fontSize: 12, color: T.muted }}>{fmt(t.lastMessageAt || t.updatedAt)}</span> },
    {
      key: 'actions', label: '', align: 'right', render: (t) => (
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <button onClick={() => setOpenId(t.id)} className="admin-icon-btn" title="View & reply" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.primary, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={15} />
          </button>
          <button onClick={() => setConfirmDel(t)} className="admin-icon-btn" title="Delete" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Support Tickets"
        subtitle="Review, respond to, and resolve support requests raised by users from the app's Help Center."
      />

      <Panel padded={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: 16, flexWrap: 'wrap', borderBottom: `1px solid ${T.lineSoft}` }}>
          <SegmentTabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'open', label: 'Open', count: counts.open },
              { id: 'in_progress', label: 'In Progress', count: counts.in_progress },
              { id: 'resolved', label: 'Resolved', count: counts.resolved },
              { id: 'closed', label: 'Closed', count: counts.closed },
            ]}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div className="admin-focusable" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 10px 0 12px', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}>
              <Filter size={15} color={T.faint} strokeWidth={2.1} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                title="Filter by topic / category"
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: category === 'all' ? T.inkSoft : T.primary, fontFamily: 'inherit', cursor: 'pointer' }}
              >
                <option value="all">All Topics</option>
                <option value="group">Reported Groups</option>
                <option value="account">Reported Accounts</option>
                <option value="general">General Queries</option>
                <option value="payment">Payments</option>
                <option value="order">Orders</option>
                <option value="other">Others</option>
              </select>
            </div>
            <SearchInput value={q} onChange={handleLocalSearch} placeholder="Search subject, user, email…" />
          </div>
        </div>
        <div style={{ padding: 20 }}>
          {error ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: T.danger, fontSize: 13.5, fontWeight: 600 }}>{error}</div>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              emptyText={loading ? 'Loading tickets…' : 'No tickets found.'}
            />
          )}
        </div>
      </Panel>

      {openId && (
        <TicketModal
          ticketId={openId}
          onClose={() => setOpenId(null)}
          onChanged={() => { fetchData(); refreshBadges(); }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDel}
        title="Delete this ticket?"
        message="This permanently removes the ticket and its entire conversation. This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={doDelete}
        onClose={() => setConfirmDel(null)}
      />
    </>
  );
};

export default Support;
