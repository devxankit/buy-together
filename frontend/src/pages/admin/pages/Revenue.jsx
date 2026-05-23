import { IndianRupee, Percent, Crown, Star, Database, ArrowUpRight } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, BarChart, DonutChart, Button, DataTable } from '../components';
import { revenueSeries, deals } from '../data/mockData';

const streams = [
  { label: 'Commission',   value: '₹62.4L', share: 58, icon: Percent,  color: T.primary, note: 'Per locked deal' },
  { label: 'Subscriptions',value: '₹18.2L', share: 17, icon: Crown,    color: T.violet,  note: 'Vendor plans' },
  { label: 'Featured',     value: '₹14.8L', share: 14, icon: Star,     color: T.amber,   note: 'Promoted groups' },
  { label: 'Data Insights',value: '₹11.6L', share: 11, icon: Database, color: T.info,    note: 'Demand reports' },
];

const breakdown = [
  { label: 'Commission',    value: 58, color: T.primary },
  { label: 'Subscriptions', value: 17, color: T.violet },
  { label: 'Featured',      value: 14, color: T.amber },
  { label: 'Data Insights', value: 11, color: T.info },
];

const Revenue = () => {
  const txnCols = [
    { key: 'id', label: 'Deal', mono: true, strong: true, render: (d) => <span style={{ fontWeight: 700, color: T.ink }}>{d.id}</span> },
    { key: 'group', label: 'Source', render: (d) => <span style={{ fontWeight: 600, color: T.inkSoft }}>{d.group}</span> },
    { key: 'vendor', label: 'Vendor', render: (d) => <span style={{ color: T.muted }}>{d.vendor}</span> },
    { key: 'value', label: 'Deal Value', mono: true, render: (d) => <span style={{ color: T.muted }}>{d.value}</span> },
    { key: 'commission', label: 'Revenue', align: 'right', mono: true, render: (d) => <span style={{ fontWeight: 800, color: d.commission === '—' ? T.faint : T.success }}>{d.commission}</span> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Revenue"
        subtitle="Monetization across commission, subscriptions, featured placements, and data products."
      >
        <Button variant="soft" icon="Calendar">FY 2025–26</Button>
        <Button variant="dark" icon="Download">Financial Report</Button>
      </PageHeader>

      {/* Hero total + streams */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 18, marginBottom: 18 }} className="admin-grid-2">
        <div style={{ background: `linear-gradient(140deg, ${T.ink} 0%, #1A1A20 100%)`, borderRadius: radius['2xl'], padding: 24, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 999, background: `radial-gradient(circle, ${T.primary}55, transparent 70%)` }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, position: 'relative' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={18} />
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Total Revenue · FYTD</span>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="font-mono-num" style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>₹1.07Cr</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 13, fontWeight: 700, color: '#5EEAD4', background: 'rgba(94,234,212,0.12)', padding: '4px 9px', borderRadius: 999 }}>
              <ArrowUpRight size={15} />+22.4% vs last year
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {streams.map((s, i) => (
            <div key={i} className="admin-card-hover" style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius.xl, padding: 16, boxShadow: T.shadowXs }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}14`, color: s.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={18} strokeWidth={2.2} />
                </span>
                <span className="font-mono-num" style={{ fontSize: 12, fontWeight: 700, color: s.color, background: `${s.color}12`, padding: '2px 8px', borderRadius: 999 }}>{s.share}%</span>
              </div>
              <div className="font-mono-num" style={{ fontSize: 21, fontWeight: 800, color: T.ink, marginTop: 14, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: T.inkSoft, marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11.5, color: T.faint, marginTop: 1 }}>{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart + breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)', gap: 18, marginBottom: 18 }} className="admin-grid-2">
        <Panel title="Revenue Trend" subtitle="Monthly net revenue in ₹ lakhs">
          <BarChart data={revenueSeries} color={T.primary} height={236} unit="₹" />
        </Panel>
        <Panel title="Revenue Mix" subtitle="Share by stream">
          <DonutChart data={breakdown} />
        </Panel>
      </div>

      <Panel title="Recent Revenue Events" subtitle="Commission captured per deal" padded={false}>
        <div style={{ padding: 20 }}>
          <DataTable columns={txnCols} rows={deals} emptyText="No revenue events yet." />
        </div>
      </Panel>
    </>
  );
};

export default Revenue;
