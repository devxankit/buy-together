import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, ImageOff, X, Check, Layers, FolderTree } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, SearchInput, SegmentTabs, Button, ImageUploader, ConfirmDialog } from '../components';
import { showToast } from '../../../utils/toast';
import { isValidHex } from '../../../utils/validators';
import {
  listCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../services/category.api';

const MAX_UPLOAD_MB = 5;

const EMPTY_FORM = {
  name: '',
  image: '',
  description: '',
  icon: '',
  color: '',
  displayOrder: 0,
  isActive: true,
  subCategories: [],
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

const CategoryModal = ({ initial, onClose, onSaved }) => {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [subQ, setSubQ] = useState('');

  const set = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const addSubCategory = () => {
    const text = subQ.trim();
    if (!text) return;
    if (form.subCategories?.includes(text)) {
      setError('Sub-category already added.');
      return;
    }
    setForm((f) => ({ ...f, subCategories: [...(f.subCategories || []), text] }));
    setSubQ('');
    setError('');
  };

  const submit = async () => {
    setError('');
    if (!form.name.trim()) return setError('Category name is required.');
    if (!form.image.trim()) return setError('A cover image URL is required.');
    if (form.color.trim() && !isValidHex(form.color)) {
      return setError('Enter a valid hex colour code (e.g. #0D9488).');
    }

    const payload = {
      name: form.name.trim(),
      image: form.image.trim(),
      description: form.description?.trim() || '',
      icon: form.icon?.trim() || '',
      color: form.color?.trim() || '',
      displayOrder: Number(form.displayOrder) || 0,
      isActive: form.isActive,
      subCategories: form.subCategories || [],
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateCategory(initial._id, payload);
        showToast('Category updated successfully! 🎉');
      } else {
        await createCategory(payload);
        showToast('Category created successfully! 🎉');
      }
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

          <Field label="Sub-categories" hint="Add sub-categories that belong to this category.">
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={subQ}
                onChange={(e) => setSubQ(e.target.value)}
                placeholder="e.g. iPhone"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubCategory();
                  }
                }}
              />
              <Button type="button" variant="soft" onClick={addSubCategory}>Add</Button>
            </div>
            
            {form.subCategories && form.subCategories.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {form.subCategories.map((sub) => (
                  <span
                    key={sub}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 600,
                      color: T.inkSoft,
                      background: T.surfaceAlt,
                      border: `1px solid ${T.line}`,
                      padding: '4px 10px',
                      borderRadius: 99,
                    }}
                  >
                    {sub}
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, subCategories: (f.subCategories || []).filter(s => s !== sub) }))}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: T.muted,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

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

/**
 * Inline sub-category manager shown in a category's expanded row.
 * Lets the admin view, add, rename and delete the sub-categories that belong to
 * a category. Every change is persisted immediately via updateCategory and the
 * parent list is refreshed so counts stay in sync.
 */
const SubCategoryPanel = ({ category, onSaved }) => {
  const [list, setList] = useState(category.subCategories || []);
  const [adding, setAdding] = useState('');
  const [editIdx, setEditIdx] = useState(-1);
  const [editVal, setEditVal] = useState('');
  const [busy, setBusy] = useState(false);

  const persist = async (next, successMsg, emoji) => {
    setBusy(true);
    try {
      await updateCategory(category._id, { subCategories: next });
      setList(next);
      showToast(successMsg, emoji);
      onSaved?.();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update sub-categories.', '❌');
    } finally {
      setBusy(false);
    }
  };

  const add = () => {
    const v = adding.trim();
    if (!v) return;
    if (list.some((s) => s.toLowerCase() === v.toLowerCase())) {
      showToast('That sub-category already exists.', '⚠️');
      return;
    }
    setAdding('');
    persist([...list, v], `Sub-category "${v}" added.`, '✅');
  };

  const saveEdit = () => {
    const v = editVal.trim();
    if (!v) return;
    if (list.some((s, i) => i !== editIdx && s.toLowerCase() === v.toLowerCase())) {
      showToast('That sub-category already exists.', '⚠️');
      return;
    }
    const next = list.map((s, i) => (i === editIdx ? v : s));
    setEditIdx(-1);
    setEditVal('');
    persist(next, 'Sub-category renamed.', '✏️');
  };

  const remove = (idx) => {
    persist(list.filter((_, i) => i !== idx), 'Sub-category removed.', '🗑️');
  };

  const chipBtn = (color) => ({
    background: 'none', border: 'none', color, cursor: busy ? 'default' : 'pointer',
    padding: 2, display: 'inline-flex', alignItems: 'center', opacity: busy ? 0.5 : 1,
  });

  return (
    <div style={{ padding: '16px 20px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: T.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <FolderTree size={14} />
        Sub-categories of {category.name}
        <span style={{ color: T.faint, fontWeight: 600 }}>({list.length})</span>
      </div>

      {list.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {list.map((sub, idx) => (
            editIdx === idx ? (
              <span key={sub} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: T.surface, border: `1px solid ${T.primary}`, borderRadius: 99, padding: '2px 4px 2px 10px' }}>
                <input
                  autoFocus
                  value={editVal}
                  onChange={(e) => setEditVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { setEditIdx(-1); setEditVal(''); } }}
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontWeight: 600, color: T.ink, width: Math.max(60, editVal.length * 8), fontFamily: 'inherit' }}
                />
                <button type="button" onClick={saveEdit} title="Save" style={chipBtn(T.primary)}><Check size={14} /></button>
                <button type="button" onClick={() => { setEditIdx(-1); setEditVal(''); }} title="Cancel" style={chipBtn(T.muted)}><X size={13} /></button>
              </span>
            ) : (
              <span key={sub} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: T.inkSoft, background: T.surface, border: `1px solid ${T.line}`, padding: '5px 8px 5px 12px', borderRadius: 99 }}>
                {sub}
                <button type="button" disabled={busy} onClick={() => { setEditIdx(idx); setEditVal(sub); }} title="Rename" style={chipBtn(T.muted)}><Pencil size={12} /></button>
                <button type="button" disabled={busy} onClick={() => remove(idx)} title="Delete" style={chipBtn(T.danger)}><Trash2 size={12} /></button>
              </span>
            )
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 12.5, color: T.faint, fontWeight: 500 }}>No sub-categories yet — add the first one below.</div>
      )}

      <div style={{ display: 'flex', gap: 8, maxWidth: 360 }}>
        <input
          style={{ ...inputStyle, flex: 1, height: 36 }}
          value={adding}
          onChange={(e) => setAdding(e.target.value)}
          placeholder="Add a sub-category…"
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        />
        <Button type="button" variant="soft" icon="Plus" onClick={add} style={busy ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>Add</Button>
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
  const [confirmTarget, setConfirmTarget] = useState(null); // category pending delete
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(confirmTarget._id);
      showToast(`Category "${confirmTarget.name}" deleted successfully!`, '🗑️');
      setConfirmTarget(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete category.', '❌');
    } finally {
      setDeleting(false);
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
      key: 'subCategories', label: 'Sub-categories', align: 'center', render: (c) => {
        const n = c.subCategories?.length || 0;
        return (
          <span title={n ? c.subCategories.join(', ') : 'No sub-categories'} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, padding: '3px 9px', borderRadius: 99, color: n ? T.primary : T.faint, background: n ? T.primarySoft : T.surfaceAlt, border: `1px solid ${n ? 'transparent' : T.line}` }}>
            <Layers size={13} />
            {n}
          </span>
        );
      },
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
          <button onClick={() => setConfirmTarget(c)} className="admin-icon-btn" title="Delete" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
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
        subtitle="Create and manage categories and their sub-categories. Expand any row to manage its sub-categories."
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
              getRowId={(c) => c._id}
              renderExpanded={(c) => <SubCategoryPanel key={(c.subCategories || []).join('|')} category={c} onSaved={fetchData} />}
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

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete category?"
        message={confirmTarget ? `"${confirmTarget.name}" and its ${confirmTarget.subCategories?.length || 0} sub-categor${(confirmTarget.subCategories?.length || 0) === 1 ? 'y' : 'ies'} will be permanently removed. This cannot be undone.` : ''}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => !deleting && setConfirmTarget(null)}
      />
    </>
  );
};

export default Categories;
