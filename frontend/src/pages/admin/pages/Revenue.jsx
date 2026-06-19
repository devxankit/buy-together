import { IndianRupee, Percent, Crown, Star, Database, Info, Lock } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, BarChart, DonutChart, DataTable } from '../components';

// ── Placeholder data (all zero) ─────────────────────────────────────
// Payments are not integrated yet, so there is no real revenue to show. The
// page renders a faithful PREVIEW of the future UI with every figure at ₹0 so
// an admin can never mistake it for live data.
const streams = [
  { label: 'Commission',    value: '₹0', share: 0, icon: Percent,  color: T.primary, note: 'Per locked deal' },
  { label: 'Subscriptions', value: '₹0', share: 0, icon: Crown,    color: T.violet,  note: 'Vendor plans' },
  { label: 'Featured',      value: '₹0', share: 0, icon: Star,     color: T.amber,   note: 'Promoted groups' },
  { label: 'Data Insights', value: '₹0', share: 0, icon: Database, color: T.info,    note: 'Demand reports' },
];

const breakdown = [
  { label: 'Commission',    value: 0, color: T.primary },
  { label: 'Subscriptions', value: 0, color: T.violet },
  { label: 'Featured',      value: 0, color: T.amber },
  { label: 'Data Insights', value: 0, color: T.info },
];

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const revenueSeries = MONTHS.map((m) => ({ label: m, value: 0 }));

// Small "Preview" tag used on panels/cards so the non-live nature is obvious everywhere.
const PreviewTag = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: T.amber, background: `${T.amber}1A`, border: `1px solid ${T.amber}40`, padding: '2px 8px', borderRadius: 999 }}>
    <Lock size={11} /> Preview
  </span>
);

const Revenue = () => {
  const txnCols = [
    { key: 'id', label: 'Deal', mono: true, strong: true },
    { key: 'group', label: 'Source' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'value', label: 'Deal Value', mono: true },
    { key: 'commission', label: 'Revenue', align: 'right', mono: true },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Revenue"
        subtitle="Monetization across commission, subscriptions, featured placements, and data products."
      >
        <PreviewTag />
      </PageHeader>

      {/* Not-available notice — makes it unmistakable this is a preview, not live data */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: `${T.amber}12`, border: `1px solid ${T.amber}40`, borderRadius: radius.xl, padding: '14px 16px', marginBottom: 18 }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: `${T.amber}22`, color: T.amber, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Info size={18} strokeWidth={2.2} />
        </span>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>Payments are not available yet — this page is a preview.</div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 3, lineHeight: 1.5 }}>
            Payment processing and deal settlement aren’t integrated, so there is no revenue to report.
            Every figure below is a <strong>placeholder showing ₹0</strong> — it is <strong>not real data</strong>.
            This layout shows how the Revenue dashboard will look once payments go live.
          </div>
        </div>
      </div>

      {/* Hero total + streams */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 18, marginBottom: 18 }} className="admin-grid-2">
        <div style={{ background: `linear-gradient(140deg, ${T.ink} 0%, #1A1A20 100%)`, borderRadius: radius['2xl'], padding: 24, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 999, background: `radial-gradient(circle, ${T.primary}33, transparent 70%)` }} />
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#FCD34D', background: 'rgba(252,211,77,0.15)', border: '1px solid rgba(252,211,77,0.3)', padding: '2px 8px', borderRadius: 999 }}>
              <Lock size={11} /> Preview
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, position: 'relative' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={18} />
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Total Revenue · FYTD</span>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="font-mono-num" style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>₹0</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)', padding: '4px 9px', borderRadius: 999 }}>
              Awaiting payments integration
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {streams.map((s, i) => (
            <div key={i} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius.xl, padding: 16, boxShadow: T.shadowXs }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}14`, color: s.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={18} strokeWidth={2.2} />
                </span>
                <span className="font-mono-num" style={{ fontSize: 12, fontWeight: 700, color: T.faint, background: T.surfaceAlt, padding: '2px 8px', borderRadius: 999 }}>{s.share}%</span>
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
        <Panel title="Revenue Trend" subtitle="Monthly net revenue in ₹ lakhs" action={<PreviewTag />}>
          <BarChart data={revenueSeries} color={T.primary} height={236} unit="₹" />
        </Panel>
        <Panel title="Revenue Mix" subtitle="Share by stream" action={<PreviewTag />}>
          <DonutChart data={breakdown} />
        </Panel>
      </div>

      <Panel title="Recent Revenue Events" subtitle="Commission captured per deal" action={<PreviewTag />} padded={false}>
        <div style={{ padding: 20 }}>
          <DataTable columns={txnCols} rows={[]} emptyText="No revenue events — payments are not available yet." />
        </div>
      </Panel>
    </>
  );
};

export default Revenue;
