import { useState } from 'react';
import { c } from '../../../design/tokens';
import Icon from '../../../components/ui/Icon';

const TABS = ['All', 'Groups', 'Deals', 'System'];

const TODAY = [
  { title: 'iPhone 16 Pro group is locked.', sub: 'Target reached · vendor confirms in 2 hours', time: 'Just now', unread: true, icon: 'lock', iconColor: c.primary, iconBg: c.primarySoft },
  { title: 'New deal in your area', sub: 'Maruti Baleno · ₹8L for 10 buyers · 1.2 km', time: '12 min', unread: true, icon: 'tag', iconColor: c.info, iconBg: c.infoSoft },
  { title: 'You saved ₹8,400 this month.', sub: '4 deals confirmed · keep going', time: '2 hrs', icon: 'rupee', iconColor: c.primary, iconBg: c.primarySoft },
  { title: 'Vote: MacBook Air or Pro?', sub: 'New poll in MacBook M4 group', time: '5 hrs', icon: 'poll', iconColor: c.muted, iconBg: c.surfaceDeep },
  { title: 'Priya joined PS5 group.', sub: "You've been invited to join too", time: 'Yesterday', icon: 'users', iconColor: c.muted, iconBg: c.surfaceDeep },
];

const EARLIER = [
  { title: 'You earned the Bulk-Buyer badge.', sub: '5 successful group deals in a month', time: '3 days ago', icon: 'award', iconColor: c.primary, iconBg: c.primarySoft },
];

const NotifCard = ({ n }) => (
  <div style={{
    background: '#fff', borderRadius: 16, padding: 14,
    border: `1px solid ${c.line}`,
    display: 'flex', gap: 12, position: 'relative',
  }}>
    <div style={{
      width: 42, height: 42, borderRadius: 12, background: n.iconBg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon name={n.icon} size={18} color={n.iconColor} stroke={1.8} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: c.ink, letterSpacing: -0.2, lineHeight: 1.3 }}>{n.title}</div>
      <div style={{ fontSize: 12, fontWeight: 400, color: c.muted, marginTop: 3, lineHeight: 1.4 }}>{n.sub}</div>
      <div style={{ fontSize: 10.5, fontWeight: 500, color: c.faint, marginTop: 6 }}>{n.time}</div>
    </div>
    {n.unread && (
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.primary, alignSelf: 'flex-start', marginTop: 6, flexShrink: 0 }} />
    )}
  </div>
);

const Notifications = () => {
  const [tab, setTab] = useState('All');

  return (
    <div style={{ background: c.surfaceAlt, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 500, color: c.ink, letterSpacing: -0.4 }}>Notifications</div>
          <div style={{ fontSize: 11.5, fontWeight: 400, color: c.faint, marginTop: 1 }}>3 unread</div>
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 500, color: c.muted, letterSpacing: 1.4, textTransform: 'uppercase', cursor: 'pointer' }}>
          Mark all
        </span>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 20 }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontSize: 13, fontWeight: tab === t ? 500 : 400, paddingBottom: 8,
              color: tab === t ? c.ink : c.muted,
              borderBottom: tab === t ? `1.5px solid ${c.primary}` : '1.5px solid transparent',
              background: 'none', border: 'none',
              borderBottom: tab === t ? `1.5px solid ${c.primary}` : '1.5px solid transparent',
              cursor: 'pointer',
            }}
          >{t}</button>
        ))}
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: c.muted, letterSpacing: 1.8, padding: '0 2px' }}>TODAY</div>
        {TODAY.map((n, i) => <NotifCard key={i} n={n} />)}

        <div style={{ fontSize: 10, fontWeight: 500, color: c.muted, letterSpacing: 1.8, padding: '10px 2px 0' }}>EARLIER</div>
        {EARLIER.map((n, i) => <NotifCard key={i} n={n} />)}
      </div>
    </div>
  );
};

export default Notifications;
