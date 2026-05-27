import { useState, useEffect, useCallback, useRef } from 'react';
import { Pencil, Trash2, ImageOff, X, UploadCloud, Loader2, RefreshCw } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, SearchInput, SegmentTabs, Button } from '../components';
import {
  listCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../services/category.api';
import { uploadImage } from '../../../services/upload.api';

const MAX_UPLOAD_MB = 5;

const EMPTY_FORM = {
  name: '',
  image: '',
  description: '',
  icon: '',
  color: '',
  displayOrder: 0,
  isActive: true,
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
      <div style={{ width: 44, height: 44, borderRadius: radius.md, background: T.surfaceAlt, border: `1px solid ${T.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: T.faint }}>
        <ImageOff size={18} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setBroken(true)}
      style={{ width: 44, height: 44, borderRadius: radius.md, objectFit: 'cover', border: `1px solid ${T.line}`, display: 'block' }}
    />
  );
};

/**
 * Image upload with live preview. Stores the resulting Cloudinary URL via
 * onChange. Also accepts a pasted URL as a fallback.
 */
const ImageUploader = ({ value, onChange }) => {
  const fileRef = useRef(null);
  const previewRef = useRef(null);
  const [localPreview, setLocalPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [pct, setPct] = useState(0);
  const [err, setErr] = useState('');

  const previewSrc = localPreview || value;

  const clearLocal = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = '';
    }
    setLocalPreview('');
  };

  useEffect(() => () => clearLocal(), []); // revoke object URL on unmount

  const handleFile = async (file) => {
    if (!file) return;
    setErr('');
    if (!file.type.startsWith('image/')) return setErr('Please choose an image file.');
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return setErr(`Image must be ${MAX_UPLOAD_MB}MB or smaller.`);

    clearLocal();
    const obj = URL.createObjectURL(file);
    previewRef.current = obj;
    setLocalPreview(obj);
    setUploading(true);
    setPct(0);
    try {
      const { data } = await uploadImage(file, { folder: 'categories', onProgress: setPct });
      onChange(data.url);
    } catch (e) {
      setErr(e.response?.data?.message || 'Upload failed. Check Cloudinary setup and try again.');
      clearLocal();
    } finally {
      setUploading(false);
    }
  };

  const onInput = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = ''; // allow re-selecting the same file
  };

  const remove = () => {
    clearLocal();
    onChange('');
    setErr('');
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" onChange={onInput} style={{ display: 'none' }} />

      {previewSrc ? (
        <div style={{ position: 'relative', width: '100%', height: 168, borderRadius: radius.xl, overflow: 'hidden', border: `1px solid ${T.line}`, background: T.surfaceAlt }}>
          <img src={previewSrc} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {uploading && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(16,16,20,0.55)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Loader2 size={22} className="admin-spin" />
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Uploading… {pct}%</span>
              <div style={{ width: '60%', height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#fff', transition: 'width 0.2s ease' }} />
              </div>
            </div>
          )}
          {!uploading && (
            <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
              <button type="button" onClick={() => fileRef.current?.click()} title="Replace" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(16,16,20,0.6)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={15} />
              </button>
              <button type="button" onClick={remove} title="Remove" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(209,67,67,0.92)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{ width: '100%', height: 168, borderRadius: radius.xl, border: `1.5px dashed ${T.line}`, background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}
        >
          <UploadCloud size={26} color={T.primary} />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>Click to upload a cover image</span>
          <span style={{ fontSize: 11.5, color: T.faint }}>PNG, JPG, WebP — up to {MAX_UPLOAD_MB}MB</span>
        </button>
      )}

      {err && <div style={{ fontSize: 11.5, color: T.danger, fontWeight: 600, marginTop: 6 }}>{err}</div>}

      <input
        style={{ ...inputStyle, marginTop: 8, height: 36, fontSize: 12.5 }}
        value={value || ''}
        onChange={(e) => { clearLocal(); onChange(e.target.value); }}
        placeholder="…or paste an image URL"
      />
    </div>
  );
};

const CategoryModal = ({ initial, onClose, onSaved }) => {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async () => {
    setError('');
    if (!form.name.trim()) return setError('Category name is required.');
    if (!form.image.trim()) return setError('A cover image URL is required.');

    const payload = {
      name: form.name.trim(),
      image: form.image.trim(),
      description: form.description?.trim() || '',
      icon: form.icon?.trim() || '',
      color: form.color?.trim() || '',
      displayOrder: Number(form.displayOrder) || 0,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (isEdit) await updateCategory(initial._id, payload);
      else await createCategory(payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the category.');
      setSaving(false);
    }
  };

  return (
    <div
      onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(16,16,20,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{ width: 540, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', background: T.surface, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}` }}
        className="admin-scroll"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${T.lineSoft}`, position: 'sticky', top: 0, background: T.surface, borderRadius: `${radius['2xl']}px ${radius['2xl']}px 0 0` }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{isEdit ? 'Edit Category' : 'New Category'}</div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{isEdit ? 'Update the details for this group category.' : 'Create a category that groups can be filed under.'}</div>
          </div>
          <button onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{error}</div>
          )}

          <Field label="Category name">
            <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="e.g. Smartphones" />
          </Field>

          <Field label="Cover image" hint="Shown in the category carousel and cards.">
            <ImageUploader value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
          </Field>

          <Field label="Description" hint="Optional — a short line describing the category.">
            <textarea
              style={{ ...inputStyle, height: 'auto', minHeight: 64, padding: '10px 12px', resize: 'vertical' }}
              value={form.description}
              onChange={set('description')}
              placeholder="Best group deals on phones and accessories."
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <Field label="Icon" hint="lucide name (optional)">
              <input style={inputStyle} value={form.icon} onChange={set('icon')} placeholder="Smartphone" />
            </Field>
            <Field label="Accent color" hint="hex (optional)">
              <input style={inputStyle} value={form.color} onChange={set('color')} placeholder="#0D9488" />
            </Field>
            <Field label="Display order" hint="lower = first">
              <input type="number" min={0} style={inputStyle} value={form.displayOrder} onChange={set('displayOrder')} />
            </Field>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} style={{ width: 16, height: 16, accentColor: T.primary }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Active</span>
            <span style={{ fontSize: 12, color: T.muted }}>— visible to users in the app</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 22px', borderTop: `1px solid ${T.lineSoft}`, position: 'sticky', bottom: 0, background: T.surface }}>
          <Button variant="soft" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={saving ? undefined : 'Check'} onClick={submit} style={saving ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Categories = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, hidden: 0 });
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | 'new' | category object

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (tab !== 'all') params.status = tab;
      if (q.trim()) params.search = q.trim();
      const { data } = await listCategoriesAdmin(params);
      setRows(data.results || []);
      setCounts(data.counts || { all: 0, active: 0, hidden: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, q]);

  useEffect(() => {
    const t = setTimeout(fetchData, 250); // debounce search/tab changes
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    try {
      await deleteCategory(cat._id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const columns = [
    {
      key: 'name', label: 'Category', strong: true, render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220 }}>
          <Thumb src={c.image} name={c.name} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{c.name}</div>
            <div className="font-mono-num" style={{ fontSize: 11.5, color: T.muted }}>{c.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'description', label: 'Description', render: (c) => (
        <div style={{ maxWidth: 280, fontSize: 12.5, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {c.description || <span style={{ color: T.faint }}>—</span>}
        </div>
      ),
    },
    {
      key: 'groupCount', label: 'Groups', align: 'center', mono: true, render: (c) => (
        <span style={{ fontSize: 13, fontWeight: 700, color: c.groupCount ? T.ink : T.faint }}>{c.groupCount}</span>
      ),
    },
    { key: 'displayOrder', label: 'Order', align: 'center', mono: true },
    { key: 'status', label: 'Status', render: (c) => <StatusBadge status={c.isActive ? 'active' : 'low'} label={c.isActive ? 'Active' : 'Hidden'} /> },
    {
      key: 'actions', label: '', align: 'right', render: (c) => (
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <button onClick={() => setModal(c)} className="admin-icon-btn" title="Edit" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(c)} className="admin-icon-btn" title="Delete" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
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
        title="Categories"
        subtitle="Create and manage the categories that demand groups are organised under."
      >
        <Button variant="dark" icon="Plus" onClick={() => setModal('new')}>New Category</Button>
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
          <SearchInput value={q} onChange={setQ} placeholder="Search categories…" />
        </div>
        <div style={{ padding: 20 }}>
          {error ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: T.danger, fontSize: 13.5, fontWeight: 600 }}>{error}</div>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              emptyText={loading ? 'Loading categories…' : 'No categories yet — create your first one.'}
            />
          )}
        </div>
      </Panel>

      {modal && (
        <CategoryModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchData(); }}
        />
      )}
    </>
  );
};

export default Categories;
