import { useState } from 'react';
import { Building2, ShieldCheck, Bell, Users2, KeyRound } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, Button, Avatar, StatusBadge } from '../components';

const Toggle = ({ on, onChange }) => (
  <button
    onClick={() => onChange(!on)}
    className="admin-btn"
    role="switch" aria-checked={on}
    style={{
      width: 42, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? T.primary : T.line, position: 'relative', transition: 'background 0.2s ease',
    }}
  >
    <span style={{
      position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: 999,
      background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left 0.2s cubic-bezier(0.4,0,0.2,1)',
    }} />
  </button>
);

const Row = ({ title, desc, children, last }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '15px 0', borderBottom: last ? 'none' : `1px solid ${T.lineSoft}` }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{title}</div>
      {desc && <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{desc}</div>}
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <label style={{ display: 'block' }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: T.muted, display: 'block', marginBottom: 6 }}>{label}</span>
    <div className="admin-focusable" style={{ height: 40, padding: '0 13px', display: 'flex', alignItems: 'center', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}>
      <input className="admin-input" defaultValue={value} style={{ flex: 1, fontSize: 13.5, color: T.ink, fontWeight: 500 }} />
    </div>
  </label>
);

const team = [
  { name: 'Ankit (You)',  email: 'ankit13king@gmail.com', role: 'verified', label: 'Super Admin', color: T.violet },
  { name: 'Neha Kapoor',  email: 'neha.k@buytogether.in', role: 'active',   label: 'Moderator',   color: T.primary },
  { name: 'Rohan Das',    email: 'rohan.d@buytogether.in',role: 'active',   label: 'Analyst',     color: T.info },
];

const Settings = () => {
  const [toggles, setToggles] = useState({
    fakeDetection: true, autoMerge: true, msgLimit: true, vendorAuto: false,
    fraudAlerts: true, weeklyReport: true, dealAlerts: false, twoFactor: true,
  });
  const set = (k) => (v) => setToggles(t => ({ ...t, [k]: v }));

  return (
    <>
      <PageHeader
        eyebrow="System"
        title="Settings"
        subtitle="Platform-wide controls, automation rules, notifications, and admin team access."
      >
        <Button variant="soft">Discard</Button>
        <Button variant="dark" icon="Save">Save Changes</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 18 }} className="admin-grid-2">
        {/* General */}
        <Panel title="General">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, color: T.primary }}>
            <Building2 size={18} /><span style={{ fontSize: 12.5, fontWeight: 600, color: T.muted }}>Brand & locale</span>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Platform Name" value="Buy Together" />
            <Field label="Support Email" value="support@buytogether.in" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Default Currency" value="INR (₹)" />
              <Field label="Timezone" value="Asia/Kolkata" />
            </div>
          </div>
        </Panel>

        {/* Platform controls */}
        <Panel title="Platform Controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, color: T.primary }}>
            <ShieldCheck size={18} /><span style={{ fontSize: 12.5, fontWeight: 600, color: T.muted }}>Trust & safety automation</span>
          </div>
          <Row title="Fake user detection" desc="Auto-flag accounts by device & velocity signals">
            <Toggle on={toggles.fakeDetection} onChange={set('fakeDetection')} />
          </Row>
          <Row title="Auto-merge duplicate groups" desc="Suggest merges above 90% similarity">
            <Toggle on={toggles.autoMerge} onChange={set('autoMerge')} />
          </Row>
          <Row title="Chat message limits" desc="Throttle spam in open group chats">
            <Toggle on={toggles.msgLimit} onChange={set('msgLimit')} />
          </Row>
          <Row title="Auto-approve vendors" desc="Skip manual KYC review (not recommended)" last>
            <Toggle on={toggles.vendorAuto} onChange={set('vendorAuto')} />
          </Row>
        </Panel>

        {/* Notifications */}
        <Panel title="Notifications">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, color: T.primary }}>
            <Bell size={18} /><span style={{ fontSize: 12.5, fontWeight: 600, color: T.muted }}>Admin alerts</span>
          </div>
          <Row title="High-severity fraud alerts" desc="Instant push for risk score ≥ 80">
            <Toggle on={toggles.fraudAlerts} onChange={set('fraudAlerts')} />
          </Row>
          <Row title="Weekly demand report" desc="Emailed every Monday 9:00 AM IST">
            <Toggle on={toggles.weeklyReport} onChange={set('weeklyReport')} />
          </Row>
          <Row title="Deal stage changes" desc="Notify on every lock & disbursement" last>
            <Toggle on={toggles.dealAlerts} onChange={set('dealAlerts')} />
          </Row>
        </Panel>

        {/* Security */}
        <Panel title="Security">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, color: T.primary }}>
            <KeyRound size={18} /><span style={{ fontSize: 12.5, fontWeight: 600, color: T.muted }}>Access control</span>
          </div>
          <Row title="Two-factor authentication" desc="Require 2FA for all admin sign-ins">
            <Toggle on={toggles.twoFactor} onChange={set('twoFactor')} />
          </Row>
          <Row title="Session timeout" desc="Auto sign-out after inactivity">
            <span style={{ fontSize: 13, fontWeight: 600, color: T.inkSoft, background: T.surfaceAlt, border: `1px solid ${T.line}`, padding: '6px 12px', borderRadius: 8 }}>30 min</span>
          </Row>
          <Row title="API access keys" desc="2 active keys · last rotated 12 days ago" last>
            <Button variant="soft" size="sm" icon="RotateCw">Rotate</Button>
          </Row>
        </Panel>
      </div>

      {/* Team */}
      <div style={{ marginTop: 18 }}>
        <Panel
          title="Admin Team"
          subtitle="People with access to this console"
          action={<Button variant="dark" size="sm" icon="UserPlus">Add Member</Button>}
          padded={false}
        >
          <div style={{ padding: '8px 20px 16px' }}>
            {team.map((m, i) => (
              <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', borderBottom: i === team.length - 1 ? 'none' : `1px solid ${T.lineSoft}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <Users2 size={0} style={{ display: 'none' }} />
                  <Avatar name={m.name} color={m.color} size={38} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{m.email}</div>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: T.inkSoft, background: T.surfaceAlt, border: `1px solid ${T.line}`, padding: '4px 11px', borderRadius: 999 }}>{m.label}</span>
                <StatusBadge status={m.role} size="sm" />
                <Button variant="ghost" size="sm" icon="Settings2" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
};

export default Settings;
