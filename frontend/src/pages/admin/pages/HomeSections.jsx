import { useState, useEffect, useCallback, useMemo } from 'react';
import { Pencil, Trash2, X, GripVertical, ArrowUp, ArrowDown, Search, ImageOff, LayoutGrid, Rows3 } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, SearchInput, SegmentTabs, Button } from '../components';
import { showToast } from '../../../utils/toast';
import {
  listHomeSectionsAdmin,
  createHomeSection,
  updateHomeSection,
  deleteHomeSection,
} from '../../../services/homeSection.api';
import { listGroupsAdmin } from '../../../services/group.api';
import { listCategoriesAdmin } from '../../../services/category.api';

const EMPTY_FORM = {
  title: '',
  layout: 'carousel',
  viewAllLink: '',
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

const Thumb = ({ src }) => {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div style={{ width: 38, height: 38, borderRadius: radius.md, background: T.surfaceAlt, border: `1px solid ${T.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: T.faint, flexShrink: 0 }}>
        <ImageOff size={15} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setBroken(true)}
      style={{ width: 38, height: 38, borderRadius: radius.md, objectFit: 'cover', border: `1px solid ${T.line}`, display: 'block', flexShrink: 0 }}
    />
  );
};

/**
 * GroupPicker — lets the admin search the full group catalogue (by free text,
 * category, and sub-category) and curate an ordered set of groups for a
 * section. Selection is kept as full group objects so chips can render rich
 * detail; the parent maps them to ids on save.
 */
const GroupPicker = ({ selected, onChange }) => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  // Load category taxonomy once for the filter dropdowns.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await listCategoriesAdmin();
        if (active) setCategories(data.results || data || []);
      } catch (err) {
        console.error('Failed to load categories for group picker:', err);
      }
    })();
    return () => { active = false; };
  }, []);

  // Fetch groups whenever the text or category filter changes (debounced).
  useEffect(() => {
    let active = true;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = { limit: 100 };
        if (search.trim()) params.search = search.trim();
        if (category) params.category = category;
        const { data } = await listGroupsAdmin(params);
        if (active) setGroups(data.results || []);
      } catch (err) {
        console.error('Failed to load groups for picker:', err);
        if (active) setGroups([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => { active = false; clearTimeout(t); };
  }, [search, category]);

  const subCategoriesList = useMemo(() => {
    const cat = categories.find((c) => c.name === category);
    return cat?.subCategories || [];
  }, [categories, category]);

  // Apply the sub-category filter client-side (the list endpoint filters by
  // category only).
  const results = useMemo(() => {
    if (!subCategory) return groups;
    return groups.filter((g) => g.subCategory === subCategory);
  }, [groups, subCategory]);

  const selectedIds = useMemo(() => new Set(selected.map((g) => g.id || g._id)), [selected]);

  const toggle = (group) => {
    const id = group.id || group._id;
    if (selectedIds.has(id)) {
      onChange(selected.filter((g) => (g.id || g._id) !== id));
    } else {
      onChange([...selected, group]);
    }
  };

  const remove = (id) => onChange(selected.filter((g) => (g.id || g._id) !== id));

  const move = (index, dir) => {
    const next = [...selected];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ── Selected groups (ordered) ── */}
      <div>
        <div style={{ ...labelStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Selected groups · {selected.length}</span>
          {selected.length > 0 && (
            <button type="button" onClick={() => onChange([])} style={{ fontSize: 11, fontWeight: 700, color: T.danger, background: 'none', border: 'none', cursor: 'pointer' }}>
              Clear all
            </button>
          )}
        </div>
        {selected.length === 0 ? (
          <div style={{ padding: '14px 12px', fontSize: 12.5, color: T.faint, fontStyle: 'italic', textAlign: 'center', border: `1px dashed ${T.line}`, borderRadius: radius.lg }}>
            No groups selected yet. Pick groups from the list below.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selected.map((g, i) => {
              const id = g.id || g._id;
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, border: `1px solid ${T.line}`, borderRadius: radius.lg, background: T.surface }}>
                  <GripVertical size={15} color={T.faint} style={{ flexShrink: 0 }} />
                  <Thumb src={g.image} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.title}</div>
                    <div style={{ fontSize: 11, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {g.category || '—'}{g.subCategory ? ` · ${g.subCategory}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'inline-flex', gap: 4, flexShrink: 0 }}>
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Move up" style={iconBtn(i === 0)}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === selected.length - 1} title="Move down" style={iconBtn(i === selected.length - 1)}>
                      <ArrowDown size={14} />
                    </button>
                    <button type="button" onClick={() => remove(id)} title="Remove" style={{ ...iconBtn(false), color: T.danger }}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Search & filters ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12, border: `1px solid ${T.line}`, borderRadius: radius.lg, background: T.surfaceAlt }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} color={T.faint} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            style={{ ...inputStyle, paddingLeft: 34, background: T.surface }}
            placeholder="Search groups by name, product, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <select
            style={{ ...inputStyle, background: T.surface }}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setSubCategory(''); }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id || c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select
            style={{ ...inputStyle, background: T.surface, opacity: subCategoriesList.length ? 1 : 0.55 }}
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            disabled={!subCategoriesList.length}
          >
            <option value="">All sub-categories</option>
            {subCategoriesList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* ── Results ── */}
        <div style={{ maxHeight: 230, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }} className="admin-scroll">
          {loading ? (
            <div style={{ padding: '18px 8px', fontSize: 12.5, color: T.faint, textAlign: 'center' }}>Loading groups…</div>
          ) : results.length === 0 ? (
            <div style={{ padding: '18px 8px', fontSize: 12.5, color: T.faint, fontStyle: 'italic', textAlign: 'center' }}>No groups match these filters.</div>
          ) : (
            results.map((g) => {
              const id = g.id || g._id;
              const isSel = selectedIds.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(g)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: 8, width: '100%', textAlign: 'left',
                    border: `1px solid ${isSel ? T.primary : T.line}`,
                    borderRadius: radius.lg,
                    background: isSel ? T.primarySoft : T.surface,
                    cursor: 'pointer',
                  }}
                >
                  <Thumb src={g.image} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: isSel ? T.primary : T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.title}</div>
                    <div style={{ fontSize: 11, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {g.category || '—'}{g.subCategory ? ` · ${g.subCategory}` : ''} · {g.spotsJoined ?? 0}/{g.spotsTotal ?? 0} buyers
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: isSel ? T.primary : T.faint, flexShrink: 0 }}>
                    {isSel ? '✓ Added' : '+ Add'}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const iconBtn = (disabled) => ({
  width: 28, height: 28, borderRadius: 7, border: `1px solid ${T.line}`,
  background: T.surface, color: disabled ? T.faint : T.inkSoft,
  cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
});

const SectionModal = ({ initial, onClose, onSaved }) => {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
  const [selected, setSelected] = useState(initial?.groups ? initial.groups.filter(Boolean) : []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Section heading is required.');

    const payload = {
      title: form.title.trim(),
      layout: form.layout,
      groups: selected.map((g) => g.id || g._id),
      viewAllLink: form.viewAllLink?.trim() || '',
      displayOrder: Number(form.displayOrder) || 0,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateHomeSection(initial.id, payload);
        showToast('Section updated successfully! 🎉');
      } else {
        await createHomeSection(payload);
        showToast('Section created successfully! 🎉');
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the section.');
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
        style={{ width: 620, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', background: T.surface, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}` }}
        className="admin-scroll"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${T.lineSoft}`, position: 'sticky', top: 0, background: T.surface, borderRadius: `${radius['2xl']}px ${radius['2xl']}px 0 0`, zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{isEdit ? 'Edit Home Section' : 'New Home Section'}</div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>Curate the heading and the exact groups shown in this home-page section.</div>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{error}</div>
          )}

          <Field label="Section heading" hint="The title displayed above the section, e.g. “Trending in Fashion”.">
            <input style={inputStyle} value={form.title} onChange={set('title')} placeholder="e.g. Hot Buying Groups" autoFocus maxLength={80} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Layout style" hint="How the cards are presented on the home page.">
              <select style={inputStyle} value={form.layout} onChange={set('layout')}>
                <option value="carousel">Carousel (horizontal cards)</option>
                <option value="list">List (stacked rows)</option>
              </select>
            </Field>
            <Field label="Display order" hint="Lower numbers appear higher on the page.">
              <input type="number" min={0} style={inputStyle} value={form.displayOrder} onChange={set('displayOrder')} />
            </Field>
          </div>

          <Field label="“See All” link" hint="Optional. Where the section’s See All button goes, e.g. /groups or /categories.">
            <input style={inputStyle} value={form.viewAllLink} onChange={set('viewAllLink')} placeholder="/groups" maxLength={250} />
          </Field>

          <div style={{ borderTop: `1px solid ${T.lineSoft}`, paddingTop: 16 }}>
            <GroupPicker selected={selected} onChange={setSelected} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 4 }}>
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} style={{ width: 16, height: 16, accentColor: T.primary }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Active</span>
            <span style={{ fontSize: 12, color: T.muted }}>— visible on the user app home page</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 22px', borderTop: `1px solid ${T.lineSoft}`, position: 'sticky', bottom: 0, background: T.surface }}>
          <Button variant="soft" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={saving ? undefined : 'Check'} type="submit" style={saving ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Section'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const HomeSections = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, hidden: 0 });
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | 'new' | section object

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (tab !== 'all') params.status = tab;
      if (q.trim()) params.search = q.trim();
      const { data } = await listHomeSectionsAdmin(params);
      setRows(data.results || []);
      setCounts(data.counts || { all: 0, active: 0, hidden: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load home sections.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, q]);

  useEffect(() => {
    const t = setTimeout(fetchData, 250);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleDelete = async (section) => {
    if (!window.confirm('Delete this home section? This cannot be undone.')) return;
    try {
      await deleteHomeSection(section.id);
      showToast('Section deleted successfully!', '🗑️');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete section.', '❌');
    }
  };

  const columns = [
    {
      key: 'title', label: 'Section', strong: true, render: (s) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{s.title}</span>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {s.layout === 'list' ? <Rows3 size={12} /> : <LayoutGrid size={12} />}
            {s.layout === 'list' ? 'List' : 'Carousel'}
          </span>
        </div>
      ),
    },
    {
      key: 'groups', label: 'Groups', align: 'center', render: (s) => (
        <span style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, background: T.surfaceAlt, border: `1px solid ${T.line}`, padding: '3px 10px', borderRadius: 999 }}>
          {(s.groups || []).length}
        </span>
      ),
    },
    { key: 'displayOrder', label: 'Order', align: 'center', mono: true },
    { key: 'status', label: 'Status', render: (s) => <StatusBadge status={s.isActive ? 'active' : 'low'} label={s.isActive ? 'Active' : 'Hidden'} /> },
    {
      key: 'actions', label: '', align: 'right', render: (s) => (
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <button onClick={() => setModal(s)} className="admin-icon-btn" title="Edit" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(s)} className="admin-icon-btn" title="Delete" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
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
        title="Home Sections"
        subtitle="Curate the group sections shown on the user app home page — set each heading, layout, and exactly which groups appear."
      >
        <Button variant="dark" icon="Plus" onClick={() => setModal('new')}>New Section</Button>
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
          <SearchInput value={q} onChange={setQ} placeholder="Search sections…" />
        </div>
        <div style={{ padding: 20 }}>
          {error ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: T.danger, fontSize: 13.5, fontWeight: 600 }}>{error}</div>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              emptyText={loading ? 'Loading sections…' : 'No home sections yet. Create one to control what shows on the home page.'}
            />
          )}
        </div>
      </Panel>

      {modal && (
        <SectionModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchData(); }}
        />
      )}
    </>
  );
};

export default HomeSections;
