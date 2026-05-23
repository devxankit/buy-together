import { useState, useMemo } from 'react';
import { T } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, SearchInput, SegmentTabs, Button } from '../components';
import { groups } from '../data/mockData';

const Progress = ({ current, target, status }) => {
  const pct = Math.min(100, Math.round((current / target) * 100));
  const color = status === 'completed' || status === 'locked' ? T.success : status === 'near' ? T.info : status === 'flagged' ? T.danger : T.primary;
  return (
    <div style={{ minWidth: 150 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span className="font-mono-num" style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{current}/{target}</span>
        <span className="font-mono-num" style={{ fontSize: 11.5, fontWeight: 600, color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: T.lineSoft, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
};

const Groups = () => {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');

  const counts = useMemo(() => ({
    all: groups.length,
    active: groups.filter(g => g.status === 'active').length,
    near: groups.filter(g => g.status === 'near').length,
    locked: groups.filter(g => ['locked', 'completed'].includes(g.status)).length,
    flagged: groups.filter(g => g.status === 'flagged').length,
  }), []);

  const filtered = useMemo(() => groups.filter(g => {
    const okTab = tab === 'all'
      || (tab === 'locked' ? ['locked', 'completed'].includes(g.status) : g.status === tab);
    const okQ = !q || `${g.name} ${g.id} ${g.creator} ${g.category} ${g.location}`.toLowerCase().includes(q.toLowerCase());
    return okTab && okQ;
  }), [tab, q]);

  const columns = [
    { key: 'name', label: 'Group', strong: true, render: (g) => (
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{g.name}</div>
        <div style={{ fontSize: 11.5, color: T.muted }}>{g.id} · by {g.creator}</div>
      </div>
    )},
    { key: 'category', label: 'Category', render: (g) => (
      <span style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft, background: T.surfaceAlt, border: `1px solid ${T.line}`, padding: '3px 9px', borderRadius: 999 }}>{g.category}</span>
    )},
    { key: 'type', label: 'Type', render: (g) => <StatusBadge status={g.type} dot={false} size="sm" /> },
    { key: 'progress', label: 'Progress', render: (g) => <Progress current={g.current} target={g.target} status={g.status} /> },
    { key: 'location', label: 'Location', render: (g) => <span style={{ color: T.muted }}>{g.location}</span> },
    { key: 'status', label: 'Status', render: (g) => <StatusBadge status={g.status} /> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Groups"
        subtitle="Monitor demand groups in real time — track progress toward targets, lock deals, merge duplicates."
      >
        <Button variant="soft" icon="GitMerge">Merge Duplicates</Button>
        <Button variant="dark" icon="Plus">Create Group</Button>
      </PageHeader>

      <Panel padded={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: 16, flexWrap: 'wrap', borderBottom: `1px solid ${T.lineSoft}` }}>
          <SegmentTabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'active', label: 'Active', count: counts.active },
              { id: 'near', label: 'Near target', count: counts.near },
              { id: 'locked', label: 'Locked', count: counts.locked },
              { id: 'flagged', label: 'Flagged', count: counts.flagged },
            ]}
          />
          <SearchInput value={q} onChange={setQ} placeholder="Search groups…" />
        </div>
        <div style={{ padding: 20 }}>
          <DataTable columns={columns} rows={filtered} onRowAction={() => {}} emptyText="No groups match your filters." />
        </div>
      </Panel>
    </>
  );
};

export default Groups;
