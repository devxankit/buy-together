import { useState, useMemo } from 'react';
import { Handshake, MessageSquare, CheckCircle2, AlertTriangle } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, SearchInput, SegmentTabs, Button } from '../components';
import { deals } from '../data/mockData';

const pipeline = [
  { id: 'negotiation',  label: 'Negotiation',  icon: MessageSquare, color: T.info },
  { id: 'confirmation', label: 'Confirmation',  icon: Handshake,     color: T.violet },
  { id: 'completed',    label: 'Completed',     icon: CheckCircle2,  color: T.success },
  { id: 'disputed',     label: 'Disputed',      icon: AlertTriangle, color: T.danger },
];

const Deals = () => {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');

  const stageCounts = useMemo(() => pipeline.reduce((acc, p) => {
    acc[p.id] = deals.filter(d => d.stage === p.id).length; return acc;
  }, {}), []);

  const filtered = useMemo(() => deals.filter(d => {
    const okTab = tab === 'all' || d.stage === tab;
    const okQ = !q || `${d.group} ${d.vendor} ${d.id}`.toLowerCase().includes(q.toLowerCase());
    return okTab && okQ;
  }), [tab, q]);

  const columns = [
    { key: 'id', label: 'Deal', mono: true, strong: true, render: (d) => (
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{d.id}</div>
        <div style={{ fontSize: 11.5, color: T.muted, fontFamily: T.font }}>{d.date}</div>
      </div>
    )},
    { key: 'group', label: 'Group', render: (d) => <span style={{ fontWeight: 600, color: T.inkSoft }}>{d.group}</span> },
    { key: 'vendor', label: 'Vendor', render: (d) => <span style={{ color: T.muted }}>{d.vendor}</span> },
    { key: 'buyers', label: 'Buyers', align: 'center', mono: true, render: (d) => <span style={{ fontWeight: 700, color: T.ink }}>{d.buyers}</span> },
    { key: 'value', label: 'Deal Value', mono: true, render: (d) => <span style={{ fontWeight: 700, color: T.ink }}>{d.value}</span> },
    { key: 'commission', label: 'Commission', mono: true, render: (d) => <span style={{ fontWeight: 700, color: d.commission === '—' ? T.faint : T.success }}>{d.commission}</span> },
    { key: 'stage', label: 'Stage', render: (d) => <StatusBadge status={d.stage} /> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Deals"
        subtitle="Track every locked deal from negotiation to disbursement, with commission visibility."
      >
        <Button variant="soft" icon="Download">Export Ledger</Button>
      </PageHeader>

      {/* Pipeline summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 18 }}>
        {pipeline.map(p => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => setTab(p.id)}
              className="admin-btn admin-card-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: 13, padding: 16, textAlign: 'left', cursor: 'pointer',
                background: T.surface, border: `1px solid ${tab === p.id ? p.color : T.line}`,
                borderRadius: radius.xl, boxShadow: T.shadowXs, fontFamily: 'inherit',
              }}
            >
              <span style={{ width: 42, height: 42, borderRadius: radius.md, background: `${p.color}14`, color: p.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} strokeWidth={2.1} />
              </span>
              <div>
                <div className="font-mono-num" style={{ fontSize: 22, fontWeight: 800, color: T.ink, lineHeight: 1 }}>{stageCounts[p.id] || 0}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginTop: 3 }}>{p.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      <Panel padded={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: 16, flexWrap: 'wrap', borderBottom: `1px solid ${T.lineSoft}` }}>
          <SegmentTabs
            value={tab}
            onChange={setTab}
            tabs={[{ id: 'all', label: 'All', count: deals.length }, ...pipeline.map(p => ({ id: p.id, label: p.label, count: stageCounts[p.id] }))]}
          />
          <SearchInput value={q} onChange={setQ} placeholder="Search deals…" />
        </div>
        <div style={{ padding: 20 }}>
          <DataTable columns={columns} rows={filtered} onRowAction={() => {}} emptyText="No deals match your filters." />
        </div>
      </Panel>
    </>
  );
};

export default Deals;
