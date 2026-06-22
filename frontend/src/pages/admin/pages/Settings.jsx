import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Building2, KeyRound, X, ShieldCheck, Lock, Pencil, Trash2, UserPlus, TrendingUp } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, Button, Avatar, StatusBadge, ConfirmDialog } from '../components';
import { showToast } from '../../../utils/toast';
import {
  getSettings,
  updateSettings,
  changePassword,
  listAdmins,
  createAdminMember,
  updateAdminMember,
  deleteAdminMember,
  ADMIN_PERMISSION_OPTIONS,
} from '../../../services/admin.api';

const AVATAR_COLORS = ['#6D5BD0', '#0D9488', '#2C5680', '#D08700', '#D14343', '#0B7A70'];
const colorFor = (id = '') => AVATAR_COLORS[((id.charCodeAt(0) || 0) + id.length) % AVATAR_COLORS.length];

const inputStyle = {
  width: '100%', height: 40, padding: '0 12px', fontSize: 13.5, color: T.ink, fontWeight: 500,
  background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg, fontFamily: 'inherit', outline: 'none',
};
const labelStyle = { fontSize: 12, fontWeight: 700, color: T.inkSoft, marginBottom: 6, display: 'block' };

const Field = ({ label, hint, children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {children}
    {hint && <div style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>{hint}</div>}
  </div>
);

// ── Add / edit admin modal ──────────────────────────────────────────
const AdminMemberModal = ({ initial, onClose, onSaved }) => {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    password: '',
    isSuperAdmin: initial?.isSuperAdmin || false,
    permissions: initial?.permissions || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const togglePerm = (key) =>
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(key) ? f.permissions.filter((p) => p !== key) : [...f.permissions, key],
    }));

  const submit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Name is required.');
    if (!form.email.trim()) return setError('Email is required.');
    if (!isEdit && form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (isEdit && form.password && form.password.length < 8) return setError('New password must be at least 8 characters.');

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || '',
      isSuperAdmin: form.isSuperAdmin,
      permissions: form.isSuperAdmin ? [] : form.permissions,
    };
    if (form.password) payload.password = form.password;

    setSaving(true);
    try {
      if (isEdit) {
        await updateAdminMember(initial.id, payload);
        showToast('Admin updated successfully! 🎉');
      } else {
        await createAdminMember(payload);
        showToast('Admin added successfully! 🎉');
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the admin.');
      setSaving(false);
    }
  };

  return (
    <div onMouseDown={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(16,16,20,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <form onSubmit={submit} onMouseDown={(e) => e.stopPropagation()} className="admin-scroll" style={{ width: 540, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', background: T.surface, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${T.lineSoft}`, position: 'sticky', top: 0, background: T.surface, borderRadius: `${radius['2xl']}px ${radius['2xl']}px 0 0` }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{isEdit ? 'Edit Admin' : 'Add Admin'}</div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>Grant console access and choose what this admin can manage.</div>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Full name"><input style={inputStyle} value={form.name} onChange={set('name')} placeholder="e.g. Neha Kapoor" autoFocus /></Field>
            <Field label="Contact number" hint="Optional"><input style={inputStyle} value={form.phone} onChange={set('phone')} placeholder="98765 43210" /></Field>
          </div>

          <Field label="Email" hint={isEdit ? undefined : 'Used to sign in to the console.'}>
            <input style={inputStyle} type="email" value={form.email} onChange={set('email')} placeholder="admin@buytogether.in" />
          </Field>

          <Field label={isEdit ? 'New password' : 'Password'} hint={isEdit ? 'Leave blank to keep the current password.' : 'Minimum 8 characters.'}>
            <input style={inputStyle} type="password" value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete="new-password" />
          </Field>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg, padding: 12 }}>
            <input type="checkbox" checked={form.isSuperAdmin} onChange={set('isSuperAdmin')} style={{ width: 16, height: 16, accentColor: T.violet, marginTop: 2 }} />
            <span>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.ink, display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={15} color={T.violet} /> Super Admin</span>
              <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.4, display: 'block', marginTop: 2 }}>Full access to everything, including managing admins and platform settings.</span>
            </span>
          </label>

          {!form.isSuperAdmin && (
            <div>
              <label style={labelStyle}>Permissions <span style={{ fontWeight: 500, color: T.faint }}>— sections this admin can access</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {ADMIN_PERMISSION_OPTIONS.map((p) => {
                  const on = form.permissions.includes(p.key);
                  return (
                    <label key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: radius.md, border: `1px solid ${on ? T.primary : T.line}`, background: on ? T.primarySoft : T.surfaceAlt, cursor: 'pointer' }}>
                      <input type="checkbox" checked={on} onChange={() => togglePerm(p.key)} style={{ width: 15, height: 15, accentColor: T.primary }} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: on ? T.primary : T.inkSoft }}>{p.label}</span>
                    </label>
                  );
                })}
              </div>
              <div style={{ fontSize: 11, color: T.faint, marginTop: 6 }}>Dashboard and Settings (own password) are always available.</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 22px', borderTop: `1px solid ${T.lineSoft}`, position: 'sticky', bottom: 0, background: T.surface }}>
          <Button variant="soft" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" style={saving ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Admin'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Settings = () => {
  const me = useSelector((s) => s.auth.user);
  const isSuper = !!me?.isSuperAdmin;

  // General settings
  const [settings, setSettings] = useState(null);
  const [savingGen, setSavingGen] = useState(false);

  // Password
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  // Admin team
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(isSuper);
  const [modal, setModal] = useState(null); // null | 'new' | admin object
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const { data } = await getSettings();
      setSettings(data);
    } catch {
      setSettings({
        platformName: '', supportEmail: '', contactNumber: '', contactNumberAlt: '', supportAddress: '',
        liveStatsActiveGroups: '', liveStatsActiveGroupsTrend: '',
        liveStatsPeopleInterested: '', liveStatsPeopleInterestedTrend: '',
        liveStatsGroupsGrowing: '', liveStatsGroupsGrowingTrend: '',
        liveStatsTopCity: '', liveStatsTopCityTrend: '',
      });
    }
  }, []);

  const loadAdmins = useCallback(async () => {
    if (!isSuper) return;
    setLoadingAdmins(true);
    try {
      const { data } = await listAdmins();
      setAdmins(data || []);
    } catch {
      setAdmins([]);
    } finally {
      setLoadingAdmins(false);
    }
  }, [isSuper]);

  useEffect(() => {
    const t = setTimeout(() => { loadSettings(); loadAdmins(); }, 0);
    return () => clearTimeout(t);
  }, [loadSettings, loadAdmins]);

  const setGen = (key) => (e) => setSettings((s) => ({ ...s, [key]: e.target.value }));

  const saveGeneral = async () => {
    setSavingGen(true);
    try {
      const { data } = await updateSettings({
        platformName: settings.platformName || '',
        supportEmail: settings.supportEmail || '',
        contactNumber: settings.contactNumber || '',
        supportAddress: settings.supportAddress || '',
        contactNumberAlt: settings.contactNumberAlt || '',
        liveStatsActiveGroups: settings.liveStatsActiveGroups || '',
        liveStatsActiveGroupsTrend: settings.liveStatsActiveGroupsTrend || '',
        liveStatsPeopleInterested: settings.liveStatsPeopleInterested || '',
        liveStatsPeopleInterestedTrend: settings.liveStatsPeopleInterestedTrend || '',
        liveStatsGroupsGrowing: settings.liveStatsGroupsGrowing || '',
        liveStatsGroupsGrowingTrend: settings.liveStatsGroupsGrowingTrend || '',
        liveStatsTopCity: settings.liveStatsTopCity || '',
        liveStatsTopCityTrend: settings.liveStatsTopCityTrend || '',
      });
      setSettings(data);
      showToast('Settings saved! 🎉');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save settings.', '❌');
    } finally {
      setSavingGen(false);
    }
  };

  const submitPassword = async () => {
    setPwError('');
    if (pw.newPassword.length < 8) return setPwError('New password must be at least 8 characters.');
    if (pw.newPassword !== pw.confirm) return setPwError('New password and confirmation do not match.');
    setSavingPw(true);
    try {
      await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      showToast('Password updated successfully! 🔐');
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPw(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteAdminMember(confirmTarget.id);
      showToast(`Admin "${confirmTarget.name}" removed.`, '🗑️');
      setConfirmTarget(null);
      loadAdmins();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove admin.', '❌');
    } finally {
      setDeleting(false);
    }
  };

  const permLabel = (a) => {
    if (a.isSuperAdmin) return 'Super Admin · full access';
    if (!a.permissions?.length) return 'No sections assigned';
    return `${a.permissions.length} section${a.permissions.length === 1 ? '' : 's'}`;
  };

  return (
    <>
      <PageHeader eyebrow="System" title="Settings" subtitle="Platform-wide controls, your password, and admin team access." />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 18 }} className="admin-grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* General */}
          <Panel title="General" subtitle={isSuper ? 'Brand & support contact' : 'Read-only — super admin can edit'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, color: T.primary }}>
              <Building2 size={18} /><span style={{ fontSize: 12.5, fontWeight: 600, color: T.muted }}>Brand & contact details</span>
            </div>
            {settings && (
              <div style={{ display: 'grid', gap: 14 }}>
                <Field label="Platform Name"><input style={inputStyle} value={settings.platformName || ''} onChange={setGen('platformName')} disabled={!isSuper} /></Field>
                <Field label="Support Email"><input style={inputStyle} type="email" value={settings.supportEmail || ''} onChange={setGen('supportEmail')} placeholder="support@buytogether.in" disabled={!isSuper} /></Field>
                <Field label="Contact Number"><input style={inputStyle} value={settings.contactNumber || ''} onChange={setGen('contactNumber')} placeholder="1800 000 000" disabled={!isSuper} /></Field>
                {isSuper && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <Button variant="dark" size="sm" icon="Save" onClick={saveGeneral} style={savingGen ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
                      {savingGen ? 'Saving…' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Panel>

          {/* Live Activity Stats */}
          <Panel title="Live Activity Stats" subtitle={isSuper ? 'Controls the stats marquee shown on the user app home page' : 'Read-only — super admin can edit'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, color: T.primary }}>
              <TrendingUp size={18} /><span style={{ fontSize: 12.5, fontWeight: 600, color: T.muted }}>Home page statistics marquee</span>
            </div>
            {settings && (
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Active Groups (Value)"><input style={inputStyle} value={settings.liveStatsActiveGroups || ''} onChange={setGen('liveStatsActiveGroups')} placeholder="e.g. 8,642" disabled={!isSuper} /></Field>
                  <Field label="Active Groups (Trend)"><input style={inputStyle} value={settings.liveStatsActiveGroupsTrend || ''} onChange={setGen('liveStatsActiveGroupsTrend')} placeholder="e.g. +12% today" disabled={!isSuper} /></Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="People Interested (Value)"><input style={inputStyle} value={settings.liveStatsPeopleInterested || ''} onChange={setGen('liveStatsPeopleInterested')} placeholder="e.g. 1,23,876" disabled={!isSuper} /></Field>
                  <Field label="People Interested (Trend)"><input style={inputStyle} value={settings.liveStatsPeopleInterestedTrend || ''} onChange={setGen('liveStatsPeopleInterestedTrend')} placeholder="e.g. +18% today" disabled={!isSuper} /></Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Groups Growing (Value)"><input style={inputStyle} value={settings.liveStatsGroupsGrowing || ''} onChange={setGen('liveStatsGroupsGrowing')} placeholder="e.g. 312" disabled={!isSuper} /></Field>
                  <Field label="Groups Growing (Trend)"><input style={inputStyle} value={settings.liveStatsGroupsGrowingTrend || ''} onChange={setGen('liveStatsGroupsGrowingTrend')} placeholder="e.g. +24% today" disabled={!isSuper} /></Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Top City (Value)"><input style={inputStyle} value={settings.liveStatsTopCity || ''} onChange={setGen('liveStatsTopCity')} placeholder="e.g. Indore" disabled={!isSuper} /></Field>
                  <Field label="Top City (Trend)"><input style={inputStyle} value={settings.liveStatsTopCityTrend || ''} onChange={setGen('liveStatsTopCityTrend')} placeholder="e.g. This Week" disabled={!isSuper} /></Field>
                </div>
                {isSuper && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <Button variant="dark" size="sm" icon="Save" onClick={saveGeneral} style={savingGen ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
                      {savingGen ? 'Saving…' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Panel>
        </div>

        <div>
          {/* Password */}
          <Panel title="Security & Password" subtitle="Update your own console password">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, color: T.primary }}>
              <KeyRound size={18} /><span style={{ fontSize: 12.5, fontWeight: 600, color: T.muted }}>{me?.email}</span>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {pwError && <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{pwError}</div>}
              <Field label="Current Password"><input style={inputStyle} type="password" value={pw.currentPassword} onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))} autoComplete="current-password" /></Field>
              <Field label="New Password"><input style={inputStyle} type="password" value={pw.newPassword} onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))} autoComplete="new-password" /></Field>
              <Field label="Confirm New Password"><input style={inputStyle} type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} autoComplete="new-password" /></Field>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                <Button variant="dark" size="sm" icon="KeyRound" onClick={submitPassword} style={savingPw ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
                  {savingPw ? 'Updating…' : 'Update Password'}
                </Button>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Admin team — super admin only */}
      {isSuper && (
        <div style={{ marginTop: 18 }}>
          <Panel
            title="Admin Team"
            subtitle="People with access to this console and what they can manage"
            action={<Button variant="dark" size="sm" icon="UserPlus" onClick={() => setModal('new')}>Add Admin</Button>}
            padded={false}
          >
            <div style={{ padding: '8px 20px 16px' }}>
              {loadingAdmins ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: T.muted, fontSize: 13 }}>Loading admins…</div>
              ) : admins.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: T.faint, fontSize: 13 }}>No admins yet.</div>
              ) : (
                admins.map((a, i) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', borderBottom: i === admins.length - 1 ? 'none' : `1px solid ${T.lineSoft}` }}>
                    <Avatar name={a.name} color={a.isSuperAdmin ? T.violet : colorFor(a.id)} size={38} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>
                        {a.name}{String(a.id) === String(me?.id) && <span style={{ color: T.faint, fontWeight: 500 }}> (You)</span>}
                      </div>
                      <div style={{ fontSize: 12, color: T.muted }}>{a.email}{a.phone ? ` · ${a.phone}` : ''}</div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: a.isSuperAdmin ? T.violet : T.inkSoft, background: a.isSuperAdmin ? T.violetSoft : T.surfaceAlt, border: `1px solid ${a.isSuperAdmin ? 'transparent' : T.line}`, padding: '4px 11px', borderRadius: 999 }}>
                      {a.isSuperAdmin ? <ShieldCheck size={13} /> : <Lock size={12} />}{permLabel(a)}
                    </span>
                    <StatusBadge status={a.status} size="sm" />
                    <button onClick={() => setModal(a)} className="admin-icon-btn" title="Edit" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setConfirmTarget(a)} disabled={String(a.id) === String(me?.id)} className="admin-icon-btn" title={String(a.id) === String(me?.id) ? 'You cannot remove yourself' : 'Remove'} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: String(a.id) === String(me?.id) ? 'not-allowed' : 'pointer', opacity: String(a.id) === String(me?.id) ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      )}

      {modal && (
        <AdminMemberModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); loadAdmins(); }}
        />
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Remove admin?"
        message={confirmTarget ? `"${confirmTarget.name}" will lose access to the admin console. This cannot be undone.` : ''}
        confirmLabel="Remove"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => !deleting && setConfirmTarget(null)}
      />
    </>
  );
};

export default Settings;
