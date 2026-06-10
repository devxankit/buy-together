import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, ImageOff, X } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, SearchInput, SegmentTabs, Button, ImageUploader } from '../components';
import { showToast } from '../../../utils/toast';
import {
  listBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../../../services/banner.api';

const EMPTY_FORM = {
  badge: '',
  titleLine1: '',
  titleHighlight: '',
  description: '',
  image: '',
  activeBuyers: '1.5K+',
  link: '',
  isActive: true,
  displayOrder: 0,
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

const Field = ({ label, hint, children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {children}
    {hint && <div style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>{hint}</div>}
  </div>
);

const Thumb = ({ src, name }) => {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div style={{ width: 64, height: 44, borderRadius: radius.md, background: T.surfaceAlt, border: `1px solid ${T.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: T.faint }}>
        <ImageOff size={18} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setBroken(true)}
      style={{ width: 64, height: 44, borderRadius: radius.md, objectFit: 'cover', border: `1px solid ${T.line}`, display: 'block' }}
    />
  );
};

const BannerModal = ({ initial, onClose, onSaved }) => {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!form.badge.trim()) return setError('Badge is required.');
    if (!form.titleLine1.trim()) return setError('Title Line 1 is required.');
    if (!form.titleHighlight.trim()) return setError('Title Highlight is required.');
    if (!form.description.trim()) return setError('Description is required.');
    if (!form.image.trim()) return setError('Banner image URL is required.');

    const payload = {
      badge: form.badge.trim(),
      titleLine1: form.titleLine1.trim(),
      titleHighlight: form.titleHighlight.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      activeBuyers: form.activeBuyers?.trim() || '1.5K+',
      link: form.link?.trim() || '',
      displayOrder: Number(form.displayOrder) || 0,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateBanner(initial.id, payload);
        showToast('Banner updated successfully! 🎉');
      } else {
        await createBanner(payload);
        showToast('Banner created successfully! 🎉');
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the banner.');
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
        style={{ width: 560, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', background: T.surface, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}` }}
        className="admin-scroll"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${T.lineSoft}`, position: 'sticky', top: 0, background: T.surface, borderRadius: `${radius['2xl']}px ${radius['2xl']}px 0 0`, zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{isEdit ? 'Edit Banner' : 'New Promo Banner'}</div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{isEdit ? 'Update details for this user app homepage banner.' : 'Create a promo banner to display on the user app slider.'}</div>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{error}</div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Badge capsule text">
              <input style={inputStyle} value={form.badge} onChange={set('badge')} placeholder="e.g. Smarter Together" required />
            </Field>
            <Field label="Active Buyers stat">
              <input style={inputStyle} value={form.activeBuyers} onChange={set('activeBuyers')} placeholder="e.g. 2.4K+" />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Title Line 1">
              <input style={inputStyle} value={form.titleLine1} onChange={set('titleLine1')} placeholder="e.g. Buy more." required />
            </Field>
            <Field label="Title Highlight (Line 2)">
              <input style={inputStyle} value={form.titleHighlight} onChange={set('titleHighlight')} placeholder="e.g. Save more." required />
            </Field>
          </div>

          <Field label="Description text">
            <textarea
              style={{ ...inputStyle, height: 'auto', minHeight: 64, padding: '10px 12px', resize: 'vertical' }}
              value={form.description}
              onChange={set('description')}
              placeholder="e.g. Join with other buyers, unlock bulk discounts and save big!"
              required
            />
          </Field>

          <Field label="Banner Image" hint="Square or rectangle graphic for the right collage side.">
            <ImageUploader value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
            <Field label="Redirect Link (Route Path)" hint="App page or external link (optional)">
              <input style={inputStyle} value={form.link} onChange={set('link')} placeholder="e.g. /groups/g-h1" />
            </Field>
            <Field label="Display Order">
              <input type="number" min={0} style={inputStyle} value={form.displayOrder} onChange={set('displayOrder')} />
            </Field>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}>
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} style={{ width: 16, height: 16, accentColor: T.primary }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Active</span>
            <span style={{ fontSize: 12, color: T.muted }}>— visible in user app slider</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 22px', borderTop: `1px solid ${T.lineSoft}`, position: 'sticky', bottom: 0, background: T.surface }}>
          <Button variant="soft" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={saving ? undefined : 'Check'} type="submit" style={saving ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Banner'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Banners = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, hidden: 0 });
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | 'new' | banner object

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (tab !== 'all') params.status = tab;
      if (q.trim()) params.search = q.trim();
      const { data } = await listBannersAdmin(params);
      setRows(data.results || []);
      setCounts(data.counts || { all: 0, active: 0, hidden: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load banners.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, q]);

  useEffect(() => {
    const t = setTimeout(fetchData, 250);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleDelete = async (banner) => {
    if (!window.confirm(`Delete banner with badge "${banner.badge}"? This cannot be undone.`)) return;
    try {
      await deleteBanner(banner.id);
      showToast(`Banner "${banner.badge}" deleted successfully!`, '🗑️');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete banner.', '❌');
    }
  };

  const columns = [
    {
      key: 'image', label: 'Preview', render: (b) => (
        <Thumb src={b.image} name={b.badge} />
      ),
    },
    {
      key: 'badge', label: 'Badge', strong: true, render: (b) => (
        <div style={{ display: 'inline-flex' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.primary, background: T.primarySoft, padding: '3px 8px', borderRadius: 999 }}>
            {b.badge}
          </span>
        </div>
      ),
    },
    {
      key: 'title', label: 'Title text', render: (b) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{b.titleLine1}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.primary }}>{b.titleHighlight}</div>
        </div>
      ),
    },
    {
      key: 'description', label: 'Description', render: (b) => (
        <div style={{ maxWidth: 220, fontSize: 12.5, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {b.description}
        </div>
      ),
    },
    { key: 'activeBuyers', label: 'Stat', align: 'center', mono: true },
    { key: 'displayOrder', label: 'Order', align: 'center', mono: true },
    { key: 'status', label: 'Status', render: (b) => <StatusBadge status={b.isActive ? 'active' : 'low'} label={b.isActive ? 'Active' : 'Hidden'} /> },
    {
      key: 'actions', label: '', align: 'right', render: (b) => (
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <button onClick={() => setModal(b)} className="admin-icon-btn" title="Edit" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(b)} className="admin-icon-btn" title="Delete" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
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
        title="Banners"
        subtitle="Manage the sliding promotional banners shown at the top of the user dashboard home page."
      >
        <Button variant="dark" icon="Plus" onClick={() => setModal('new')}>New Banner</Button>
      </PageHeader>

      <Panel padded={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: 16, flexWrap: 'wrap', borderBottom: `1px solid ${T.lineSoft}` }}>
          <SegmentTabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'active', label: 'Active', count: counts.active },
              { id: 'hidden', label: 'Hidden', count: counts.hidden },
            ]}
          />
          <SearchInput value={q} onChange={setQ} placeholder="Search banners…" />
        </div>
        <div style={{ padding: 20 }}>
          {error ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: T.danger, fontSize: 13.5, fontWeight: 600 }}>{error}</div>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              emptyText={loading ? 'Loading banners…' : 'No banners created yet. Create one to replace the hardcoded ones.'}
            />
          )}
        </div>
      </Panel>

      {modal && (
        <BannerModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchData(); }}
        />
      )}
    </>
  );
};

export default Banners;
