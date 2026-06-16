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
import { listGroupsAdmin } from '../../../services/group.api';

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

  const isGroupLink = form.link && form.link.startsWith('/groups/');
  const [linkType, setLinkType] = useState(isGroupLink ? 'group' : form.link ? 'custom' : 'group');
  const [selectedGroupId, setSelectedGroupId] = useState(isGroupLink ? form.link.replace('/groups/', '') : '');
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredGroups = groups.filter((g) => {
    const titleMatch = g.title && g.title.toLowerCase().includes(groupSearchQuery.toLowerCase());
    const productMatch = g.productName && g.productName.toLowerCase().includes(groupSearchQuery.toLowerCase());
    return titleMatch || productMatch;
  });

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClose = () => setDropdownOpen(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [dropdownOpen]);

  useEffect(() => {
    let active = true;
    const fetchGroups = async () => {
      setLoadingGroups(true);
      try {
        const { data } = await listGroupsAdmin({ limit: 100 });
        if (active) {
          setGroups(data.results || []);
        }
      } catch (err) {
        console.error('Failed to load groups for banner redirect:', err);
      } finally {
        if (active) setLoadingGroups(false);
      }
    };
    fetchGroups();
    return () => { active = false; };
  }, []);

  const set = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!form.image.trim()) return setError('Banner image URL is required.');

    const payload = {
      badge: '',
      titleLine1: '',
      titleHighlight: '',
      description: '',
      image: form.image.trim(),
      activeBuyers: '',
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
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{isEdit ? 'Update details for this homepage banner image.' : 'Create a banner to display on the user app home page.'}</div>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{error}</div>
          )}

          <Field label="Banner Image" hint="Upload the main banner graphic. Ideal resolution is landscape.">
            <ImageUploader value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
          </Field>

          <Field label="Redirect Link Type" hint="Decide where the user is taken when they click this banner.">
            <select
              style={inputStyle}
              value={linkType}
              onChange={(e) => {
                const newType = e.target.value;
                setLinkType(newType);
                if (newType === 'group') {
                  setForm((f) => ({ ...f, link: selectedGroupId ? `/groups/${selectedGroupId}` : '' }));
                } else {
                  setForm((f) => ({ ...f, link: '' }));
                }
              }}
            >
              <option value="group">Redirect to a Group</option>
              <option value="custom">Custom / External Link</option>
            </select>
          </Field>

          {linkType === 'group' ? (
            <Field label="Select Target Group" hint={loadingGroups ? 'Loading groups list...' : 'Click to open and search the group list.'}>
              <div style={{ position: 'relative' }}>
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  disabled={loadingGroups}
                  style={{
                    ...inputStyle,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    opacity: loadingGroups ? 0.6 : 1,
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90%' }}>
                    {selectedGroupId
                      ? (groups.find((g) => (g.id || g._id) === selectedGroupId)?.title || 'Selected Group')
                      : 'Select a group...'}
                  </span>
                  <span style={{ fontSize: 9, color: T.muted }}>▼</span>
                </button>

                {/* Dropdown Menu Popup */}
                {dropdownOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 100,
                      marginTop: 6,
                      border: `1px solid ${T.line}`,
                      borderRadius: radius.lg,
                      background: T.surface,
                      boxShadow: T.shadowLg,
                      padding: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {/* Search Field Inside Dropdown */}
                    <input
                      type="text"
                      value={groupSearchQuery}
                      onChange={(e) => setGroupSearchQuery(e.target.value)}
                      placeholder="🔍 Type to search group..."
                      style={{
                        ...inputStyle,
                        height: 36,
                        borderRadius: radius.md,
                      }}
                      autoFocus
                    />

                    {/* Scrollable Match List */}
                    <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="admin-scroll">
                      {filteredGroups.length === 0 ? (
                        <div style={{ padding: '12px 8px', fontSize: 12.5, color: T.faint, fontStyle: 'italic', textAlign: 'center' }}>
                          No groups found
                        </div>
                      ) : (
                        filteredGroups.map((g) => {
                          const val = g.id || g._id;
                          const isSelected = val === selectedGroupId;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                setSelectedGroupId(val);
                                setForm((f) => ({ ...f, link: val ? `/groups/${val}` : '' }));
                                setDropdownOpen(false);
                                setGroupSearchQuery('');
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: radius.md,
                                background: isSelected ? T.primarySoft : 'transparent',
                                color: isSelected ? T.primary : T.ink,
                                cursor: 'pointer',
                                fontSize: 12.5,
                                fontWeight: isSelected ? 700 : 500,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                transition: 'background 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) e.currentTarget.style.background = T.surfaceAlt;
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{g.title}</div>
                              {g.productName && (
                                <div style={{ fontSize: 10.5, color: isSelected ? T.primary : T.muted }}>
                                  {g.productName}
                                </div>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Field>
          ) : (
            <Field label="Custom / External Redirect Link" hint="Provide any other link, starting with http://, https://, or a local path.">
              <input
                style={inputStyle}
                value={form.link}
                onChange={set('link')}
                placeholder="e.g. /deals or https://google.com"
                required
              />
            </Field>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
            <Field label="Display Order">
              <input type="number" min={0} style={inputStyle} value={form.displayOrder} onChange={set('displayOrder')} />
            </Field>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}>
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} style={{ width: 16, height: 16, accentColor: T.primary }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Active</span>
            <span style={{ fontSize: 12, color: T.muted }}>— visible in user app banner slider</span>
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
    if (!window.confirm('Delete this banner? This cannot be undone.')) return;
    try {
      await deleteBanner(banner.id);
      showToast('Banner deleted successfully!', '🗑️');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete banner.', '❌');
    }
  };

  const columns = [
    {
      key: 'image', label: 'Preview', render: (b) => (
        <Thumb src={b.image} name="Banner Image" />
      ),
    },
    {
      key: 'link', label: 'Redirect Link', strong: true, render: (b) => {
        const isGroup = b.link && b.link.startsWith('/groups/');
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
              {b.link || <span style={{ color: T.faint, fontStyle: 'italic' }}>No Redirect Link</span>}
            </span>
            {isGroup && (
              <span style={{ fontSize: 10, fontWeight: 700, color: T.primary, background: T.primarySoft, padding: '2px 8px', borderRadius: 999, alignSelf: 'flex-start' }}>
                Group Redirect
              </span>
            )}
            {!isGroup && b.link && (
              <span style={{ fontSize: 10, fontWeight: 700, color: T.info, background: T.infoSoft, padding: '2px 8px', borderRadius: 999, alignSelf: 'flex-start' }}>
                Custom / External Link
              </span>
            )}
          </div>
        );
      }
    },
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
