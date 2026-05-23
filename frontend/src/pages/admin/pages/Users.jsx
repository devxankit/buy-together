import { useState, useMemo } from 'react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, Avatar, SearchInput, SegmentTabs, Button } from '../components';
import { users } from '../data/mockData';

const IntentBar = ({ score }) => {
  const color = score >= 70 ? T.success : score >= 40 ? T.amber : T.danger;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 110 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 99, background: T.lineSoft, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
      <span className="font-mono-num" style={{ fontSize: 12, fontWeight: 700, color, width: 26 }}>{score}</span>
    </div>
  );
};

const Users = () => {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');

  const counts = useMemo(() => ({
    all: users.length,
    active: users.filter(u => u.status === 'active').length,
    flagged: users.filter(u => u.status === 'flagged').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  }), []);

  const filtered = useMemo(() => users.filter(u => {
    const okTab = tab === 'all' || u.status === tab;
    const okQ = !q || `${u.name} ${u.email} ${u.id} ${u.location}`.toLowerCase().includes(q.toLowerCase());
    return okTab && okQ;
  }), [tab, q]);

  const columns = [
    {
      key: 'name', label: 'User', strong: true,
      render: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Avatar name={u.name} color={u.avatar} size={36} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{u.name}</div>
            <div style={{ fontSize: 11.5, color: T.muted }}>{u.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'id', label: 'ID', mono: true, render: (u) => <span style={{ color: T.muted }}>{u.id}</span> },
    { key: 'role', label: 'Role', render: (u) => <StatusBadge status={u.role} dot={false} size="sm" /> },
    { key: 'intent', label: 'Intent Score', render: (u) => <IntentBar score={u.intent} /> },
    { key: 'groups', label: 'Groups', align: 'center', mono: true, render: (u) => <span style={{ fontWeight: 700, color: T.ink }}>{u.groups}</span> },
    { key: 'location', label: 'Location', render: (u) => <span style={{ color: T.muted }}>{u.location}</span> },
    { key: 'status', label: 'Status', render: (u) => <StatusBadge status={u.status} /> },
    { key: 'joined', label: 'Joined', mono: true, render: (u) => <span style={{ color: T.muted }}>{u.joined}</span> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Users"
        subtitle="Every buyer and vendor account, with intent scores and moderation controls."
      >
        <Button variant="soft" icon="SlidersHorizontal">Filters</Button>
        <Button variant="dark" icon="UserPlus">Invite Admin</Button>
      </PageHeader>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 18 }}>
        {[
          { label: 'Total Users', value: '48,259', sub: '+1,204 this week', color: T.primary },
          { label: 'Active Today', value: '12,847', sub: '26.6% of base', color: T.info },
          { label: 'Flagged', value: counts.flagged, sub: 'needs review', color: T.amber },
          { label: 'Suspended', value: counts.suspended, sub: 'enforced', color: T.danger },
        ].map((s, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius.xl, padding: 16, boxShadow: T.shadowXs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: s.color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>{s.label}</span>
            </div>
            <div className="font-mono-num" style={{ fontSize: 23, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 11.5, color: T.faint, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <Panel padded={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: 16, flexWrap: 'wrap', borderBottom: `1px solid ${T.lineSoft}` }}>
          <SegmentTabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'active', label: 'Active', count: counts.active },
              { id: 'flagged', label: 'Flagged', count: counts.flagged },
              { id: 'suspended', label: 'Suspended', count: counts.suspended },
            ]}
          />
          <SearchInput value={q} onChange={setQ} placeholder="Search users…" />
        </div>
        <div style={{ padding: 20 }}>
          <DataTable columns={columns} rows={filtered} onRowAction={() => {}} emptyText="No users match your filters." />
        </div>
      </Panel>
    </>
  );
};

export default Users;
