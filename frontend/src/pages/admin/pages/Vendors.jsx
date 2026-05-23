import { useState, useMemo } from 'react';
import { Star, Check, X, ShieldCheck } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, Avatar, SearchInput, SegmentTabs, Button } from '../components';
import { vendors } from '../data/mockData';

const Rating = ({ value }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
    <Star size={14} color={T.amber} fill={T.amber} strokeWidth={0} />
    <span className="font-mono-num" style={{ fontSize: 13, fontWeight: 700, color: value >= 4 ? T.ink : value >= 3 ? T.amber : T.danger }}>{value.toFixed(1)}</span>
  </div>
);

const Vendors = () => {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');

  const counts = useMemo(() => ({
    all: vendors.length,
    pending: vendors.filter(v => v.status === 'pending').length,
    verified: vendors.filter(v => v.status === 'verified').length,
    rejected: vendors.filter(v => v.status === 'rejected').length,
  }), []);

  const filtered = useMemo(() => vendors.filter(v => {
    const okTab = tab === 'all' || v.status === tab;
    const okQ = !q || `${v.name} ${v.id} ${v.category} ${v.city}`.toLowerCase().includes(q.toLowerCase());
    return okTab && okQ;
  }), [tab, q]);

  const columns = [
    { key: 'name', label: 'Vendor', strong: true, render: (v) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <Avatar name={v.name} color={v.status === 'verified' ? T.primary : v.status === 'pending' ? T.amber : T.danger} size={36} square />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5, fontWeight: 600, color: T.ink }}>
            {v.name}
            {v.status === 'verified' && <ShieldCheck size={14} color={T.primary} />}
          </div>
          <div style={{ fontSize: 11.5, color: T.muted }}>{v.id} · {v.category}</div>
        </div>
      </div>
    )},
    { key: 'city', label: 'City', render: (v) => <span style={{ color: T.muted }}>{v.city}</span> },
    { key: 'rating', label: 'Rating', render: (v) => <Rating value={v.rating} /> },
    { key: 'deals', label: 'Deals', align: 'center', mono: true, render: (v) => <span style={{ fontWeight: 700, color: T.ink }}>{v.deals}</span> },
    { key: 'gmv', label: 'GMV', mono: true, render: (v) => <span style={{ fontWeight: 700, color: T.ink }}>{v.gmv}</span> },
    { key: 'kyc', label: 'KYC', render: (v) => <StatusBadge status={v.kyc} size="sm" /> },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v.status} /> },
    { key: 'actions', label: '', align: 'right', render: (v) => v.status === 'pending' ? (
      <div style={{ display: 'inline-flex', gap: 6 }}>
        <button className="admin-btn" title="Approve" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: T.successSoft, color: T.success, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Check size={16} strokeWidth={2.6} /></button>
        <button className="admin-btn" title="Reject" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: T.dangerSoft, color: T.danger, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} strokeWidth={2.6} /></button>
      </div>
    ) : <span style={{ fontSize: 12, color: T.faint }}>—</span> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Vendors"
        subtitle="Approve onboarding requests, verify KYC, and monitor vendor performance & ratings."
      >
        <Button variant="soft" icon="FileCheck">KYC Policy</Button>
        <Button variant="dark" icon="Store">Onboard Vendor</Button>
      </PageHeader>

      {counts.pending > 0 && (
        <div className="admin-fade-up" style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', marginBottom: 18,
          background: T.amberSoft, border: `1px solid ${T.amber}33`, borderRadius: radius.xl,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', color: T.amber, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={19} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#7A5410' }}>{counts.pending} vendors awaiting approval</div>
            <div style={{ fontSize: 12, color: '#9A7321' }}>Review KYC documents to unlock their offer-creation access.</div>
          </div>
          <Button variant="soft" size="sm" onClick={() => setTab('pending')}>Review now</Button>
        </div>
      )}

      <Panel padded={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: 16, flexWrap: 'wrap', borderBottom: `1px solid ${T.lineSoft}` }}>
          <SegmentTabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'pending', label: 'Pending', count: counts.pending },
              { id: 'verified', label: 'Verified', count: counts.verified },
              { id: 'rejected', label: 'Rejected', count: counts.rejected },
            ]}
          />
          <SearchInput value={q} onChange={setQ} placeholder="Search vendors…" />
        </div>
        <div style={{ padding: 20 }}>
          <DataTable columns={columns} rows={filtered} emptyText="No vendors match your filters." />
        </div>
      </Panel>
    </>
  );
};

export default Vendors;
