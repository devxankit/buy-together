import { useState, useEffect, useCallback } from 'react';
import { Globe, Smartphone, Users, ImageOff, Link2, Bell } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, SegmentTabs, Button, ImageUploader } from '../components';
import { showToast } from '../../../utils/toast';
import {
  sendPushWeb,
  sendPushMobile,
  sendPushAll,
  getPushCoverage,
  listPushCampaigns,
} from '../../../services/fcm.api';

const inputStyle = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  fontSize: 13.5,
  color: T.ink,
  fontWeight: 500,
  background: T.surfaceAlt,
  border: `1px solid ${T.line}`,
  borderRadius: radius.lg,
  fontFamily: 'inherit',
  outline: 'none',
};

const labelStyle = { fontSize: 12, fontWeight: 700, color: T.inkSoft, marginBottom: 6, display: 'block' };

const Field = ({ label, hint, children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {children}
    {hint && <div style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>{hint}</div>}
  </div>
);

const StatTile = ({ icon, label, value, tint }) => (
  <div style={{ flex: 1, minWidth: 150, display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius.xl }}>
    <div style={{ width: 40, height: 40, borderRadius: 12, background: tint || T.primarySoft, color: T.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 21, fontWeight: 800, color: T.ink, lineHeight: 1.1 }} className="font-mono-num">{value}</div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: T.muted }}>{label}</div>
    </div>
  </div>
);

const PLATFORM_TABS = [
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile App' },
  { id: 'all', label: 'Both' },
];

const PushNotifications = () => {
  const [platform, setPlatform] = useState('all');
  const [form, setForm] = useState({ title: '', body: '', image: '', link: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const [coverage, setCoverage] = useState({ webUsers: 0, mobileUsers: 0, totalUsers: 0 });
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [cov, camp] = await Promise.all([getPushCoverage(), listPushCampaigns({ limit: 20 })]);
      setCoverage(cov.data || {});
      setCampaigns(camp.data?.results || []);
    } catch (err) {
      console.error('Failed to load push data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(refresh, 0);
    return () => clearTimeout(t);
  }, [refresh]);

  const submit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Notification title is required.');
    if (!form.body.trim()) return setError('Notification message is required.');

    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      image: form.image?.trim() || '',
      link: form.link?.trim() || '',
    };

    const sender = platform === 'web' ? sendPushWeb : platform === 'mobile' ? sendPushMobile : sendPushAll;

    setSending(true);
    try {
      const { data } = await sender(payload);
      const s = data?.campaign?.stats || {};
      showToast(`Sent to ${s.success ?? 0}/${s.recipients ?? 0} devices 🔔`);
      setForm({ title: '', body: '', image: '', link: '' });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification.');
    } finally {
      setSending(false);
    }
  };

  const targetCount = platform === 'web' ? coverage.webUsers : platform === 'mobile' ? coverage.mobileUsers : coverage.totalUsers;

  const columns = [
    {
      key: 'title', label: 'Notification', strong: true, render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {c.image ? (
            <img src={c.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: `1px solid ${T.line}`, flexShrink: 0 }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 8, background: T.surfaceAlt, border: `1px solid ${T.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: T.faint, flexShrink: 0 }}>
              <Bell size={16} />
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 240 }}>{c.title}</div>
            <div style={{ fontSize: 11.5, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 240 }}>{c.body}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'platform', label: 'Platform', render: (c) => {
        const map = { web: 'Web', mobile: 'Mobile', all: 'Both' };
        return <span style={{ fontSize: 11, fontWeight: 700, color: T.primary, background: T.primarySoft, padding: '3px 10px', borderRadius: 999 }}>{map[c.platform] || c.platform}</span>;
      },
    },
    {
      key: 'delivery', label: 'Delivery', align: 'center', render: (c) => {
        const s = c.stats || {};
        return (
          <span style={{ fontSize: 12.5, fontWeight: 600, color: T.inkSoft }} className="font-mono-num">
            <span style={{ color: T.success || T.primary }}>{s.success ?? 0}</span>
            {' / '}{s.recipients ?? 0}
            {s.failure ? <span style={{ color: T.danger, marginLeft: 6 }}>({s.failure} failed)</span> : null}
          </span>
        );
      },
    },
    { key: 'sentByName', label: 'Sent by', render: (c) => <span style={{ fontSize: 12.5, color: T.muted }}>{c.sentByName || '—'}</span> },
    {
      key: 'createdAt', label: 'When', align: 'right', render: (c) => (
        <span style={{ fontSize: 12, color: T.muted }}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}</span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="System"
        title="Push Notifications"
        subtitle="Send Firebase push notifications to your users — broadcast promos, with images and deep links, to web and mobile separately or together."
      />

      {/* Coverage */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
        <StatTile icon={<Globe size={20} />} label="Users reachable on Web" value={coverage.webUsers ?? 0} />
        <StatTile icon={<Smartphone size={20} />} label="Users reachable on Mobile" value={coverage.mobileUsers ?? 0} tint={T.infoSoft} />
        <StatTile icon={<Users size={20} />} label="Total Users" value={coverage.totalUsers ?? 0} tint={T.surfaceAlt} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
        {/* Compose */}
        <Panel>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>Compose notification</div>

            {error && (
              <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{error}</div>
            )}

            <Field label="Target platform" hint={`Will be delivered to ~${targetCount ?? 0} user${targetCount === 1 ? '' : 's'} with a registered token.`}>
              <SegmentTabs
                value={platform}
                onChange={setPlatform}
                tabs={PLATFORM_TABS.map((t) => ({ id: t.id, label: t.label }))}
              />
            </Field>

            <Field label="Title" hint="Shown in bold as the notification heading.">
              <input style={inputStyle} value={form.title} onChange={set('title')} placeholder="e.g. Flash Sale 🔥 40% off today" maxLength={120} autoFocus />
            </Field>

            <Field label="Message" hint="The notification body text.">
              <textarea
                style={{ ...inputStyle, height: 90, padding: '10px 12px', resize: 'vertical', lineHeight: 1.4 }}
                value={form.body}
                onChange={set('body')}
                placeholder="Write your promotional message…"
                maxLength={500}
              />
            </Field>

            <Field label="Image (optional)" hint="A rich image shown inside the notification. Landscape works best.">
              <ImageUploader value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} folder="push" />
            </Field>

            <Field label="Deep link (optional)" hint="Where users land on tap, e.g. /groups or /deals or an https:// URL.">
              <div style={{ position: 'relative' }}>
                <Link2 size={15} color={T.faint} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input style={{ ...inputStyle, paddingLeft: 34 }} value={form.link} onChange={set('link')} placeholder="/groups" maxLength={500} />
              </div>
            </Field>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" icon={sending ? undefined : 'Send'} type="submit" style={sending ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
                {sending ? 'Sending…' : 'Send Notification'}
              </Button>
            </div>
          </form>
        </Panel>

        {/* Live preview */}
        <Panel>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 14 }}>Preview</div>
          <div style={{ background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.xl, padding: 14, display: 'flex', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.primary, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800 }}>
              <Bell size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, wordBreak: 'break-word' }}>{form.title || 'Notification title'}</div>
              <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2, wordBreak: 'break-word' }}>{form.body || 'Your message preview appears here.'}</div>
              {form.image ? (
                <img src={form.image} alt="" style={{ marginTop: 10, width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 10, border: `1px solid ${T.line}` }} />
              ) : (
                <div style={{ marginTop: 10, height: 80, borderRadius: 10, border: `1px dashed ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.faint, fontSize: 12 }}>
                  <ImageOff size={16} style={{ marginRight: 6 }} /> No image
                </div>
              )}
              <div style={{ fontSize: 10.5, color: T.faint, marginTop: 8 }}>Buy Together · now</div>
            </div>
          </div>
        </Panel>
      </div>

      {/* History */}
      <div style={{ marginTop: 20 }}>
        <Panel padded={false}>
          <div style={{ padding: 16, borderBottom: `1px solid ${T.lineSoft}`, fontSize: 14.5, fontWeight: 700, color: T.ink }}>Recent broadcasts</div>
          <div style={{ padding: 20 }}>
            <DataTable
              columns={columns}
              rows={campaigns}
              emptyText={loading ? 'Loading…' : 'No notifications sent yet.'}
            />
          </div>
        </Panel>
      </div>
    </>
  );
};

export default PushNotifications;
