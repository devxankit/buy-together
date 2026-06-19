import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, Fingerprint, Copy, Gauge, UserX, ShieldX, Users as UsersIcon, Loader2, ShieldCheck, Zap,
} from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, StatusBadge, SegmentTabs, Button } from '../components';
import { showToast } from '../../../utils/toast';
import { getFraudSignals } from '../../../services/admin.api';
import { updateGroupAdmin } from '../../../services/group.api';
import { updateUserAdmin } from '../../../services/user.api';

const TYPE_ICON = {
  'Duplicate group': Copy,
  'Signup velocity': Gauge,
  'Unverified members': ShieldX,
  'Low-intent ring': UserX,
  'Duplicate identity': Fingerprint,
  'Flagged member active': ShieldAlert,
  'Aggressive joining': Zap,
};

const fmtTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const diff = Date.now() - d.getTime();
  const day = 86400000;
  if (diff < day) return 'today';
  if (diff < 2 * day) return 'yesterday';
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

const Ring = ({ score }) => {
  const color = score >= 75 ? T.danger : score >= 45 ? T.amber : T.muted;
  const C = 2 * Math.PI * 20;
  return (
    <div style={{ position: 'relative', width: 50, height: 50, flexShrink: 0 }}>
      <svg width={50} height={50} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={25} cy={25} r={20} fill="none" stroke={T.lineSoft} strokeWidth={5} />
        <circle cx={25} cy={25} r={20} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${(score / 100) * C} ${C}`} />
      </svg>
      <span className="font-mono-num" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color }}>{score}</span>
    </div>
  );
};

const Fraud = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [signals, setSignals] = useState([]);
  const [summary, setSummary] = useState({ open: 0, high: 0, medium: 0, low: 0, groupsAffected: 0, accountsAtRisk: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getFraudSignals();
      setSignals(data.signals || []);
      setSummary({ open: 0, high: 0, medium: 0, low: 0, groupsAffected: 0, accountsAtRisk: 0, ...(data.summary || {}) });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load risk signals.');
      setSignals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchData, 0);
    return () => clearTimeout(t);
  }, [fetchData]);

  const counts = {
    all: signals.length,
    high: signals.filter((f) => f.severity === 'high').length,
    medium: signals.filter((f) => f.severity === 'medium').length,
    low: signals.filter((f) => f.severity === 'low').length,
  };

  const filtered = signals.filter((f) => tab === 'all' || f.severity === tab);

  const investigate = (f) => {
    if (f.entityType === 'group') navigate('/admin/groups');
    else if (f.entityType === 'user') navigate('/admin/users');
    else showToast('No single entity to open for this signal.', 'ℹ️');
  };

  const enforce = async (f) => {
    if (f.entityType === 'group') {
      if (!window.confirm(`Flag the group "${f.entity}" for review?`)) return;
      setBusyId(f.id);
      try {
        await updateGroupAdmin(f.entityId, { status: 'flagged' });
        showToast(`Group "${f.entity}" flagged.`, '🚩');
        fetchData();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to flag the group.', '❌');
      } finally {
        setBusyId(null);
      }
    } else if (f.entityType === 'user') {
      if (!window.confirm(`Suspend the account "${f.entity}"? They will be blocked from the app.`)) return;
      setBusyId(f.id);
      try {
        await updateUserAdmin(f.entityId, { status: 'suspended' });
        showToast(`Account "${f.entity}" suspended.`, '🔒');
        fetchData();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to suspend the account.', '❌');
      } finally {
        setBusyId(null);
      }
    } else {
      showToast('This signal has no single account/group to enforce against — investigate manually.', 'ℹ️');
    }
  };

  const summaryCards = [
    { label: 'Open Signals', value: summary.open, color: T.danger, icon: ShieldAlert },
    { label: 'High Severity', value: summary.high, color: T.danger, icon: Gauge },
    { label: 'Groups Affected', value: summary.groupsAffected, color: T.amber, icon: UsersIcon },
    { label: 'Accounts at Risk', value: summary.accountsAtRisk, color: T.violet, icon: UserX },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Fraud & Risk"
        subtitle="Risk signals computed from real users, groups and membership — duplicate groups, sign-up bursts, unverified or padded membership, and flagged accounts in live deals."
      >
        <Button variant="dark" icon={loading ? undefined : 'RefreshCw'} onClick={fetchData} style={loading ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
          {loading ? 'Scanning…' : 'Run Scan'}
        </Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 18 }}>
        {summaryCards.map((s, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius.xl, padding: 16, boxShadow: T.shadowXs, display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ width: 42, height: 42, borderRadius: radius.md, background: `${s.color}14`, color: s.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={20} strokeWidth={2.1} />
            </span>
            <div>
              <div className="font-mono-num" style={{ fontSize: 23, fontWeight: 800, color: T.ink, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <Panel
        title="Active Signals"
        subtitle="Ranked by risk score"
        action={<SegmentTabs value={tab} onChange={setTab} tabs={[
          { id: 'all', label: 'All', count: counts.all },
          { id: 'high', label: 'High', count: counts.high },
          { id: 'medium', label: 'Medium', count: counts.medium },
          { id: 'low', label: 'Low', count: counts.low },
        ]} />}
      >
        {error ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: T.danger, fontSize: 13.5, fontWeight: 600 }}>{error}</div>
        ) : loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 40, color: T.muted, fontSize: 13 }}>
            <Loader2 size={16} className="admin-spin" /> Scanning for risk signals…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 48, color: T.success }}>
            <ShieldCheck size={30} />
            <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>No risk signals{tab !== 'all' ? ` at ${tab} severity` : ''}.</div>
            <div style={{ fontSize: 12.5, color: T.muted }}>Everything looks clean right now.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((f) => {
              const Icon = TYPE_ICON[f.type] || ShieldAlert;
              const sev = f.severity === 'high' ? T.danger : f.severity === 'medium' ? T.amber : T.muted;
              return (
                <div key={f.id} className="admin-card-hover" style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: 16,
                  border: `1px solid ${T.line}`, borderLeft: `3px solid ${sev}`, borderRadius: radius.xl, background: T.surface,
                }}>
                  <Ring score={f.score} />
                  <div style={{ width: 38, height: 38, borderRadius: radius.md, background: `${sev}14`, color: sev, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={19} strokeWidth={2.1} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{f.type}</span>
                      <StatusBadge status={f.severity} size="sm" />
                      <span className="font-mono-num" style={{ fontSize: 11.5, color: T.faint }}>{fmtTime(f.createdAt)}</span>
                    </div>
                    <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>{f.detail}</div>
                    <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 4, fontWeight: 600 }}>
                      {f.entityType === 'group' ? 'Group: ' : f.entityType === 'user' ? 'Account: ' : 'Scope: '}
                      <span className="font-mono-num">{f.entity}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <Button variant="soft" size="sm" icon="Search" onClick={() => investigate(f)}>Investigate</Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon="Ban"
                      onClick={() => enforce(f)}
                      style={(busyId === f.id || f.entityType === 'none') ? { opacity: 0.55, pointerEvents: busyId === f.id ? 'none' : 'auto' } : undefined}
                    >
                      {f.entityType === 'group' ? 'Flag' : f.entityType === 'user' ? 'Suspend' : 'Enforce'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </>
  );
};

export default Fraud;
