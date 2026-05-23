import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { StatCard, Panel, PageHeader, BarChart, DonutChart, Button, Avatar } from '../components';
import { kpis, revenueSeries, categoryDemand, activityFeed, vendors, topContributors } from '../data/mockData';

const ACCENT = { primary: T.primary, violet: T.violet, info: T.info, amber: T.amber, danger: T.danger };

const quickActions = [
  { label: 'Approve Vendors', icon: 'Store',       to: '/admin/vendors', accent: 'amber' },
  { label: 'Review Fraud',    icon: 'ShieldAlert', to: '/admin/fraud',   accent: 'danger' },
  { label: 'Track Deals',     icon: 'Handshake',   to: '/admin/deals',   accent: 'violet' },
  { label: 'View Analytics',  icon: 'ChartColumnBig', to: '/admin/analytics', accent: 'info' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const pendingVendors = vendors.filter(v => v.status === 'pending');

  return (
    <>
      <PageHeader
        eyebrow="Control Center"
        title="Platform Overview"
        subtitle="Live pulse of demand, groups, deals and revenue across Buy Together."
      >
        <Button variant="soft" icon="Download">Export</Button>
        <Button variant="dark" icon="Plus" onClick={() => navigate('/admin/groups')}>New Campaign</Button>
      </PageHeader>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 18 }}>
        {kpis.map((k, i) => <StatCard key={k.id} {...k} index={i} />)}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)', gap: 18, marginBottom: 18 }} className="admin-grid-2">
        <Panel
          title="Gross Deal Value"
          subtitle="Monthly GMV in ₹ lakhs · last 12 months"
          action={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 700, color: T.success, background: T.successSoft, padding: '5px 10px', borderRadius: 999 }}><TrendingUp size={14} />+18.7%</span>}
        >
          <BarChart data={revenueSeries} color={T.primary} height={236} unit="₹" />
        </Panel>

        <Panel title="Category Demand" subtitle="Share of active group interest">
          <DonutChart data={categoryDemand} />
        </Panel>
      </div>

      {/* Activity + side rail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)', gap: 18 }} className="admin-grid-2">
        <Panel
          title="Recent Activity"
          subtitle="Real-time platform events"
          action={<Button variant="ghost" size="sm" iconRight="ArrowRight" onClick={() => navigate('/admin/analytics')}>View all</Button>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activityFeed.map((a) => {
              const Icon = Icons[a.icon] || Icons.Circle;
              const color = ACCENT[a.accent] || T.muted;
              return (
                <div key={a.id} className="admin-row" style={{ display: 'flex', gap: 13, padding: '12px 10px', borderRadius: radius.lg }}>
                  <div style={{ width: 38, height: 38, borderRadius: radius.md, flexShrink: 0, background: `${color}14`, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} strokeWidth={2.1} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{a.title}</div>
                    <div style={{ fontSize: 12.5, color: T.muted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.detail}</div>
                  </div>
                  <span style={{ fontSize: 11.5, color: T.faint, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>{a.time}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Quick actions */}
          <Panel title="Quick Actions" padded>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {quickActions.map((q) => {
                const Icon = Icons[q.icon] || Icons.Circle;
                const color = ACCENT[q.accent];
                return (
                  <button
                    key={q.label}
                    onClick={() => navigate(q.to)}
                    className="admin-btn admin-card-hover"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: radius.xl, border: `1px solid ${T.line}`, background: T.surfaceAlt, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                  >
                    <span style={{ width: 34, height: 34, borderRadius: radius.md, background: `${color}16`, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={17} strokeWidth={2.2} />
                    </span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>{q.label}</span>
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* Approval queue */}
          <Panel
            title="Approval Queue"
            subtitle={`${pendingVendors.length} vendors awaiting review`}
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/admin/vendors')}>Open</Button>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingVendors.map(v => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <Avatar name={v.name} color={T.amber} size={34} square />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                    <div style={{ fontSize: 11.5, color: T.muted }}>{v.category} · {v.city}</div>
                  </div>
                  <button className="admin-btn" style={{ height: 30, padding: '0 11px', borderRadius: 8, border: 'none', background: T.primary, color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>Review</button>
                </div>
              ))}
            </div>
          </Panel>

          {/* Top contributors */}
          <Panel title="Top Contributors" subtitle="By intent score this month">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {topContributors.map(c => (
                <div key={c.rank} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <span className="font-mono-num" style={{ width: 22, fontSize: 13, fontWeight: 800, color: c.rank === 1 ? T.amber : T.faint, textAlign: 'center' }}>#{c.rank}</span>
                  <Avatar name={c.name} color={[T.amber, T.violet, T.info, T.primary][c.rank - 1]} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: T.muted }}>{c.groups} groups · {c.badge}</div>
                  </div>
                  <span className="font-mono-num" style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{c.points.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
