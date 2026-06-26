import { useState, useEffect, useCallback } from 'react';
import {
  Star, Check, X, ShieldCheck, Pencil, Trash2,
  Building2, User as UserIcon, Phone, Mail, MapPin, Globe, FileText, IndianRupee,
} from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, Avatar, SearchInput, SegmentTabs, Button } from '../components';
import { showToast } from '../../../utils/toast';
import {
  listVendorsAdmin,
  createVendorAdmin,
  updateVendorAdmin,
  deleteVendorAdmin,
  approveVendorAdmin,
  rejectVendorAdmin,
} from '../../../services/vendor.api';
import { ADMIN_STATS_REFRESH_EVENT } from '../layout/AdminLayout';

const dispatchStatsRefresh = () =>
  window.dispatchEvent(new Event(ADMIN_STATS_REFRESH_EVENT));

const STATUSES = ['pending', 'verified', 'rejected'];
const KYC_VALUES = ['submitted', 'verified', 'failed'];
const BUSINESS_TYPES = ['Individual', 'Shop', 'Company'];
const CATEGORIES = ['Electronics', 'Automobile', 'Appliances', 'Fashion', 'Grocery', 'Home Decor', 'Furniture', 'Multi'];

const EMPTY_FORM = {
  businessName: '',
  ownerName: '',
  phone: '',
  email: '',
  category: 'Electronics',
  businessType: 'Individual',
  gstNumber: '',
  description: '',
  city: '',
  address: '',
  pincode: '',
  website: '',
  status: 'pending',
  kyc: 'submitted',
};

const formatPhone = (p = '') => {
  const d = String(p).replace(/\D/g, '').slice(-10);
  return d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : p;
};

const formatGmv = (n) => {
  const v = Number(n) || 0;
  if (v >= 10_000_000) return `₹${(v / 10_000_000).toFixed(1)}Cr`;
  if (v >= 100_000) return `₹${(v / 100_000).toFixed(1)}L`;
  if (v >= 1_000) return `₹${(v / 1_000).toFixed(1)}K`;
  return `₹${v}`;
};

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

const Field = ({ label, hint, required, children }) => (
  <div>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: T.danger, marginLeft: 3 }}>*</span>}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>{hint}</div>}
  </div>
);

const IconInput = ({ icon: Icon, ...props }) => (
  <div className="admin-focusable" style={{ display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}>
    {Icon && <Icon size={16} color={T.faint} strokeWidth={2.1} />}
    <input className="admin-input" {...props} style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: T.ink, fontWeight: 500 }} />
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, marginBottom: 2 }}>
    <div style={{ width: 30, height: 30, borderRadius: 9, background: T.primarySoft, color: T.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={16} strokeWidth={2.2} />
    </div>
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11.5, color: T.muted }}>{subtitle}</div>}
    </div>
  </div>
);

const Rating = ({ value }) => {
  const v = Number(value) || 0;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <Star size={14} color={T.amber} fill={v > 0 ? T.amber : 'transparent'} strokeWidth={1.6} />
      <span className="font-mono-num" style={{ fontSize: 13, fontWeight: 700, color: v >= 4 ? T.ink : v >= 3 ? T.amber : v > 0 ? T.danger : T.faint }}>
        {v > 0 ? v.toFixed(1) : '—'}
      </span>
    </div>
  );
};

const VendorModal = ({ initial, onClose, onSaved }) => {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY_FORM;
    return { ...EMPTY_FORM, ...initial, gstNumber: initial.gstNumber || '' };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!form.businessName.trim()) return setError('Business name is required.');
    const phoneDigits = String(form.phone).replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      return setError('Enter a valid 10-digit Indian mobile number.');
    }
    if (!form.category.trim()) return setError('Category is required.');
    if (!form.city.trim()) return setError('City is required.');
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      return setError('Pincode must be 6 digits.');
    }
    if (form.gstNumber && !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(form.gstNumber.trim().toUpperCase())) {
      return setError('Enter a valid 15-character GSTIN or leave it blank.');
    }

    const payload = {
      businessName: form.businessName.trim(),
      ownerName: form.ownerName?.trim() || '',
      phone: phoneDigits,
      email: form.email?.trim() || '',
      category: form.category.trim(),
      businessType: form.businessType,
      gstNumber: form.gstNumber?.trim().toUpperCase() || '',
      description: form.description?.trim() || '',
      city: form.city.trim(),
      address: form.address?.trim() || '',
      pincode: form.pincode?.trim() || '',
      website: form.website?.trim() || '',
      status: form.status,
      kyc: form.kyc,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateVendorAdmin(initial.id, payload);
        showToast('Vendor updated successfully! 🎉');
      } else {
        await createVendorAdmin(payload);
        showToast('Vendor onboarded successfully! 🎉');
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the vendor.');
      setSaving(false);
    }
  };

  return (
    <div
      onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(16,16,20,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ width: 680, maxWidth: '100%', maxHeight: '92vh', overflowY: 'auto', background: T.surface, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}` }}
        className="admin-scroll"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${T.lineSoft}`, position: 'sticky', top: 0, background: T.surface, borderRadius: `${radius['2xl']}px ${radius['2xl']}px 0 0`, zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>
              {isEdit ? 'Edit Vendor' : 'Onboard New Vendor'}
            </div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>
              {isEdit ? 'Update business profile, KYC, and approval status.' : 'Add a vendor account. They land as pending until KYC is verified.'}
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && (
            <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{error}</div>
          )}

          {/* ── Business identity ───────────────────────────── */}
          <SectionHeader icon={Building2} title="Business identity" subtitle="Brand, ownership, and what they sell." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Business name" required>
              <IconInput icon={Building2} value={form.businessName} onChange={set('businessName')} placeholder="e.g. TechWorld Distributors" autoFocus />
            </Field>
            <Field label="Owner / contact name">
              <IconInput icon={UserIcon} value={form.ownerName} onChange={set('ownerName')} placeholder="Full legal name" />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Category" required>
              <select style={inputStyle} value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Business type">
              <select style={inputStyle} value={form.businessType} onChange={set('businessType')}>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <Field label="GST number" hint="15-character GSTIN (optional, leave blank if not registered).">
            <IconInput icon={FileText} value={form.gstNumber} onChange={(e) => setForm((f) => ({ ...f, gstNumber: e.target.value.toUpperCase() }))} placeholder="22AAAAA0000A1Z5" maxLength={15} />
          </Field>

          <Field label="What do they sell?" hint="A short description shown to buyers (optional).">
            <textarea
              style={{ ...inputStyle, height: 'auto', minHeight: 64, padding: '10px 12px', resize: 'vertical' }}
              value={form.description}
              onChange={set('description')}
              placeholder="Refurbished electronics and accessories at wholesale rates."
              maxLength={500}
            />
          </Field>

          {/* ── Contact ─────────────────────────────────────── */}
          <SectionHeader icon={Phone} title="Contact" subtitle="Mobile is the OTP-login key and cannot be changed later." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Mobile number" required hint="10-digit Indian mobile.">
              <IconInput
                icon={Phone}
                value={form.phone}
                onChange={set('phone')}
                placeholder="98765 43210"
                inputMode="numeric"
                maxLength={13}
                disabled={isEdit}
              />
            </Field>
            <Field label="Email" hint="Optional business email.">
              <IconInput icon={Mail} type="email" value={form.email} onChange={set('email')} placeholder="sales@business.com" />
            </Field>
          </div>
          <Field label="Website" hint="Optional.">
            <IconInput icon={Globe} value={form.website} onChange={set('website')} placeholder="https://example.com" />
          </Field>

          {/* ── Location ────────────────────────────────────── */}
          <SectionHeader icon={MapPin} title="Location" subtitle="Where they ship from / can be reached." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="City" required>
              <IconInput icon={MapPin} value={form.city} onChange={set('city')} placeholder="e.g. Mumbai" />
            </Field>
            <Field label="Pincode">
              <IconInput value={form.pincode} onChange={set('pincode')} placeholder="400001" inputMode="numeric" maxLength={6} />
            </Field>
          </div>
          <Field label="Address">
            <input style={inputStyle} value={form.address} onChange={set('address')} placeholder="Building, Street, Landmark" />
          </Field>

          {/* ── Pipeline ────────────────────────────────────── */}
          <SectionHeader icon={ShieldCheck} title="Approval & KYC" subtitle="Set where this vendor sits in the onboarding pipeline." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Status">
              <select style={inputStyle} value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </Field>
            <Field label="KYC">
              <select style={inputStyle} value={form.kyc} onChange={set('kyc')}>
                {KYC_VALUES.map((k) => (
                  <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 22px', borderTop: `1px solid ${T.lineSoft}`, position: 'sticky', bottom: 0, background: T.surface }}>
          <Button variant="soft" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={saving ? undefined : 'Check'} type="submit" style={saving ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Onboard Vendor'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Vendors = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, verified: 0, rejected: 0 });
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState(() => {
    const saved = sessionStorage.getItem('admin_search_query');
    if (saved) {
      sessionStorage.removeItem('admin_search_query');
      return saved;
    }
    return '';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Listen for real-time global search events
  useEffect(() => {
    const handleGlobalSearch = (e) => {
      if (e.detail !== undefined) setQ(e.detail);
    };
    window.addEventListener('admin:search', handleGlobalSearch);
    return () => window.removeEventListener('admin:search', handleGlobalSearch);
  }, []);

  // Dispatch search query to sync other search inputs (like the topbar)
  const handleLocalSearch = (newVal) => {
    setQ(newVal);
    window.dispatchEvent(new CustomEvent('admin:search', { detail: newVal }));
  };
  const [modal, setModal] = useState(null); // null | 'new' | vendor object

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 100 };
      if (tab !== 'all') params.status = tab;
      if (q.trim()) params.search = q.trim();
      const { data } = await listVendorsAdmin(params);
      setRows(data.results || []);
      setCounts({ all: 0, pending: 0, verified: 0, rejected: 0, ...(data.counts || {}) });
      dispatchStatsRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vendors.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, q]);

  useEffect(() => {
    const t = setTimeout(fetchData, 250);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleDelete = async (v) => {
    if (!window.confirm(`Delete vendor "${v.businessName}"? This cannot be undone.`)) return;
    try {
      await deleteVendorAdmin(v.id);
      showToast(`Vendor "${v.businessName}" deleted!`, '🗑️');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete vendor.', '❌');
    }
  };

  const handleApprove = async (v) => {
    try {
      await approveVendorAdmin(v.id);
      showToast(`Vendor "${v.businessName}" approved!`, '✅');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve vendor.', '❌');
    }
  };

  const handleReject = async (v) => {
    const reason = window.prompt(`Reject "${v.businessName}"? Optional reason:`, '');
    if (reason === null) return;
    try {
      await rejectVendorAdmin(v.id, reason);
      showToast(`Vendor "${v.businessName}" rejected.`, '⚠️');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject vendor.', '❌');
    }
  };

  const columns = [
    {
      key: 'businessName', label: 'Vendor', strong: true, render: (v) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 240 }}>
          <Avatar name={v.businessName} color={v.status === 'verified' ? T.primary : v.status === 'pending' ? T.amber : T.danger} size={36} square />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5, fontWeight: 600, color: T.ink }}>
              {v.businessName}
              {v.status === 'verified' && <ShieldCheck size={14} color={T.primary} />}
            </div>
            <div className="font-mono-num" style={{ fontSize: 11.5, color: T.muted }}>{formatPhone(v.phone)} · {v.category}</div>
          </div>
        </div>
      ),
    },
    { key: 'city', label: 'City', render: (v) => <span style={{ color: v.city ? T.inkSoft : T.faint }}>{v.city || '—'}</span> },
    { key: 'rating', label: 'Rating', render: (v) => <Rating value={v.rating} /> },
    { key: 'dealsCount', label: 'Deals', align: 'center', mono: true, render: (v) => <span style={{ fontWeight: 700, color: v.dealsCount ? T.ink : T.faint }}>{v.dealsCount || 0}</span> },
    {
      key: 'gmv', label: 'GMV', mono: true, render: (v) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 700, color: v.gmv ? T.ink : T.faint }}>
          {v.gmv ? formatGmv(v.gmv) : <><IndianRupee size={11} strokeWidth={2.4} />0</>}
        </span>
      ),
    },
    { key: 'kyc', label: 'KYC', render: (v) => <StatusBadge status={v.kyc} size="sm" /> },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v.status} /> },
    {
      key: 'actions', label: '', align: 'right', render: (v) => (
        <div style={{ display: 'inline-flex', gap: 6 }}>
          {v.status === 'pending' && (
            <>
              <button onClick={() => handleApprove(v)} className="admin-btn" title="Approve" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.successSoft, color: T.success, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Check size={15} strokeWidth={2.6} />
              </button>
              <button onClick={() => handleReject(v)} className="admin-btn" title="Reject" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.dangerSoft, color: T.danger, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={15} strokeWidth={2.6} />
              </button>
            </>
          )}
          <button onClick={() => setModal(v)} className="admin-icon-btn" title="Edit" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(v)} className="admin-icon-btn" title="Delete" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Vendors"
        subtitle="Onboard sellers, verify KYC, and monitor vendor performance & ratings."
      >
        <Button variant="dark" icon="Store" onClick={() => setModal('new')}>Onboard Vendor</Button>
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
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#7A5410' }}>
              {counts.pending} vendor{counts.pending === 1 ? '' : 's'} awaiting approval
            </div>
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
          <SearchInput value={q} onChange={handleLocalSearch} placeholder="Search by name, phone, city, GST…" />
        </div>
        <div style={{ padding: 20 }}>
          {error ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: T.danger, fontSize: 13.5, fontWeight: 600 }}>{error}</div>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              emptyText={loading ? 'Loading vendors…' : 'No vendors match your filters — onboard one to get started.'}
            />
          )}
        </div>
      </Panel>

      {modal && (
        <VendorModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchData(); }}
        />
      )}
    </>
  );
};

export default Vendors;
