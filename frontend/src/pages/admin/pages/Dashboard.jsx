import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { TrendingUp, MapPin, Activity, Users } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { StatCard, Panel, PageHeader, BarChart, DonutChart, Button, Avatar, Sparkline } from '../components';
import {
  kpis, revenueSeries, categoryDemand, activityFeed, vendors, topContributors,
  heatmap, heatmapRegions, heatmapCategories,
} from '../data/mockData';

const ACCENT = { primary: T.primary, violet: T.violet, info: T.info, amber: T.amber, danger: T.danger };

const quickActions = [
  { label: 'Approve Vendors', icon: 'Store',       to: '/admin/vendors', accent: 'amber' },
  { label: 'Review Fraud',    icon: 'ShieldAlert', to: '/admin/fraud',   accent: 'danger' },
  { label: 'View Revenue',    icon: 'IndianRupee', to: '/admin/revenue', accent: 'info' },
];

// ── Demand-intelligence widgets (merged in from the former Analytics page) ──
const heatColor = (v) => {
  const a = 0.08 + (v / 100) * 0.92;
  return `rgba(13,148,136,${a.toFixed(2)})`;
};

const demandMetrics = [
  { label: 'Demand Index',   value: '142.6', delta: '+9.2%', spark: [20,28,24,34,40,38,52,60], icon: Activity,    color: T.primary },
  { label: 'Conversion',     value: '38.4%', delta: '+3.1%', spark: [30,32,31,35,34,37,38,40], icon: TrendingUp,  color: T.violet },
  { label: 'Avg Group Fill', value: '71%',   delta: '+5.0%', spark: [50,55,58,60,64,66,69,71], icon: Users,       color: T.info },
  { label: 'Active Regions', value: '24',    delta: '+2',    spark: [18,19,20,20,21,22,23,24], icon: MapPin,      color: T.amber },
];

const topRegions = [
  { region: 'Indore',    demand: 92, growth: '+14%' },
  { region: 'Mumbai',    demand: 88, growth: '+9%' },
  { region: 'Pune',      demand: 85, growth: '+11%' },
  { region: 'Surat',     demand: 80, growth: '+18%' },
  { region: 'Hyderabad', demand: 70, growth: '+6%' },
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

      {/* Demand intelligence — mini metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 18 }}>
        {demandMetrics.map((m, i) => (
          <div key={i} className="admin-card-hover" style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius['2xl'], padding: 18, boxShadow: T.shadowSm }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: `${m.color}14`, color: m.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon size={18} strokeWidth={2.2} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.success }}>{m.delta}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 }}>
              <div>
                <div className="font-mono-num" style={{ fontSize: 24, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em' }}>{m.value}</div>
                <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginTop: 2 }}>{m.label}</div>
              </div>
              <div style={{ width: 70 }}><Sparkline data={m.spark} color={m.color} height={30} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Demand heatmap + top regions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 18, marginBottom: 18 }} className="admin-grid-2">
        <Panel title="Demand Heatmap" subtitle="Region × category intent intensity">
          <div style={{ overflowX: 'auto' }} className="admin-scroll">
            <div style={{ minWidth: 460 }}>
              <div style={{ display: 'grid', gridTemplateColumns: `90px repeat(${heatmapCategories.length}, 1fr)`, gap: 6, marginBottom: 6 }}>
                <div />
                {heatmapCategories.map(c => (
                  <div key={c} style={{ fontSize: 11, fontWeight: 700, color: T.muted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{c}</div>
                ))}
              </div>
              {heatmap.map((row, ri) => (
                <div key={ri} style={{ display: 'grid', gridTemplateColumns: `90px repeat(${heatmapCategories.length}, 1fr)`, gap: 6, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft, display: 'flex', alignItems: 'center' }}>{heatmapRegions[ri]}</div>
                  {row.map((v, ci) => (
                    <div
                      key={ci}
                      title={`${heatmapRegions[ri]} · ${heatmapCategories[ci]} — ${v}`}
                      className="font-mono-num"
                      style={{
                        height: 42, borderRadius: 9, background: heatColor(v),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: v > 55 ? '#fff' : T.inkSoft,
                        cursor: 'default', transition: 'transform 0.12s ease',
                      }}
                    >{v}</div>
                  ))}
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 11, color: T.faint, fontWeight: 600 }}>Low</span>
                <div style={{ width: 120, height: 8, borderRadius: 99, background: `linear-gradient(90deg, ${heatColor(5)}, ${heatColor(100)})` }} />
                <span style={{ fontSize: 11, color: T.faint, fontWeight: 600 }}>High</span>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Top Regions" subtitle="By demand index">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {topRegions.map((r, i) => (
              <div key={r.region}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={14} color={T.primary} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{r.region}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: T.success }}>{r.growth}</span>
                    <span className="font-mono-num" style={{ fontSize: 13, fontWeight: 700, color: T.ink, width: 26, textAlign: 'right' }}>{r.demand}</span>
                  </div>
                </div>
                <div style={{ height: 7, borderRadius: 99, background: T.lineSoft, overflow: 'hidden' }}>
                  <div style={{ width: `${r.demand}%`, height: '100%', background: `linear-gradient(90deg, ${T.primaryDeep}, ${T.primary})`, borderRadius: 99, animation: `admin-bar-grow 0.6s ease ${i * 60}ms both`, transformOrigin: 'left' }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Activity + side rail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)', gap: 18 }} className="admin-grid-2">
        <Panel
          title="Recent Activity"
          subtitle="Real-time platform events"
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
