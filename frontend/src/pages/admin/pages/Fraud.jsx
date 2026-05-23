import { useState, useMemo } from 'react';
import { ShieldAlert, Fingerprint, Copy, Gauge, UserX, ShieldX, Search } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, StatusBadge, SegmentTabs, Button } from '../components';
import { fraudSignals } from '../data/mockData';

const TYPE_ICON = {
  'Device cluster': Fingerprint,
  'Duplicate group': Copy,
  'Velocity anomaly': Gauge,
  'Vendor mismatch': ShieldX,
  'Low intent ring': UserX,
};

const Ring = ({ score }) => {
  const color = score >= 80 ? T.danger : score >= 55 ? T.amber : T.muted;
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
  const [tab, setTab] = useState('all');

  const counts = useMemo(() => ({
    all: fraudSignals.length,
    high: fraudSignals.filter(f => f.severity === 'high').length,
    medium: fraudSignals.filter(f => f.severity === 'medium').length,
    low: fraudSignals.filter(f => f.severity === 'low').length,
  }), []);

  const filtered = useMemo(() => fraudSignals.filter(f => tab === 'all' || f.severity === tab), [tab]);

  const summary = [
    { label: 'Open Signals',    value: fraudSignals.length, color: T.danger, icon: ShieldAlert },
    { label: 'High Severity',   value: counts.high, color: T.danger, icon: Gauge },
    { label: 'Accounts Frozen', value: 14, color: T.amber, icon: UserX },
    { label: 'Cleared (7d)',    value: 38, color: T.success, icon: ShieldX },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Fraud & Risk"
        subtitle="Automated detection of fake users, duplicate groups, and velocity anomalies — with one-click enforcement."
      >
        <Button variant="soft" icon="Settings2">Rules</Button>
        <Button variant="dark" icon="Play">Run Scan</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 18 }}>
        {summary.map((s, i) => (
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
                    <span className="font-mono-num" style={{ fontSize: 11.5, color: T.faint }}>{f.id} · {f.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>{f.detail}</div>
                  <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 4, fontWeight: 600 }}>Entity: <span className="font-mono-num">{f.entity}</span></div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Button variant="soft" size="sm" icon="Search">Investigate</Button>
                  <Button variant="danger" size="sm" icon="Ban">Enforce</Button>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
};

export default Fraud;
