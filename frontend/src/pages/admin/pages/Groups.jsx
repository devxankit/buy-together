import { useState, useEffect, useCallback } from 'react';
import {
  X, Pencil, Trash2, Users, Check, Search, Loader2,
  Boxes, Tag, Lock, Flag, UserPlus, UserMinus, MessageSquare, Star,
} from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, DataTable, StatusBadge, Avatar, SearchInput, SegmentTabs, Button, LocationAutocomplete, ImageUploader, ChatTranscript } from '../components';
import { getGroupChatAdmin } from '../../../services/admin.api';
import { showToast } from '../../../utils/toast';
import {
  listGroupsAdmin,
  createGroupAdmin,
  updateGroupAdmin,
  deleteGroupAdmin,
  getGroupAdmin,
  addGroupMember,
  removeGroupMember,
} from '../../../services/group.api';
import { listUsersAdmin } from '../../../services/user.api';
import { listCategoriesAdmin } from '../../../services/category.api';
import { ADMIN_STATS_REFRESH_EVENT } from '../layout/AdminLayout';

const dispatchStatsRefresh = () =>
  window.dispatchEvent(new Event(ADMIN_STATS_REFRESH_EVENT));

const STATUSES = ['active', 'closing', 'completed', 'locked', 'flagged'];
const TYPES = ['user', 'vendor'];

const EMPTY_FORM = {
  title: '',
  productName: '',
  category: '',
  subCategory: '',
  type: 'user',
  location: '',
  coordinates: null,
  image: '',
  slogan: '',
  description: '',
  spotsTotal: 50,
  status: 'active',
  trending: false,
  closesAt: '',
  creatorName: '',
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

const Progress = ({ spotsJoined, spotsTotal, status }) => {
  const total = Number(spotsTotal) || 0;
  const joined = Number(spotsJoined) || 0;
  const pct = total > 0 ? Math.min(100, Math.round((joined / total) * 100)) : 0;
  const color =
    status === 'completed' || status === 'locked' ? T.success :
    status === 'closing' ? T.info :
    status === 'flagged' ? T.danger : T.primary;
  return (
    <div style={{ minWidth: 150 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span className="font-mono-num" style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{joined}/{total}</span>
        <span className="font-mono-num" style={{ fontSize: 11.5, fontWeight: 600, color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: T.lineSoft, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
};

// Convert an ISO timestamp → yyyy-mm-dd for <input type="date">.
const toDateInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

const formatPhone = (p = '') => {
  const d = String(p).replace(/\D/g, '').slice(-10);
  return d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : p;
};

// ── Create / Edit modal ─────────────────────────────────────────────
const GroupModal = ({ initial, onClose, onSaved }) => {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY_FORM;
    return {
      ...EMPTY_FORM,
      ...initial,
      closesAt: toDateInput(initial.closesAt),
      creatorName: initial.creatorName || (initial.creator !== '—' ? initial.creator : '') || '',
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Group members list and search states
  const [loadingMembers, setLoadingMembers] = useState(isEdit);
  const [members, setMembers] = useState([]);
  const [memberQ, setMemberQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchingMembers, setSearchingMembers] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch full details (populated members) on mount if editing
  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    const fetchFullDetails = async () => {
      try {
        const { data } = await getGroupAdmin(initial.id);
        if (active) {
          setMembers(data.members || []);
        }
      } catch (err) {
        console.error('Failed to load group details:', err);
      } finally {
        if (active) setLoadingMembers(false);
      }
    };
    fetchFullDetails();
    return () => { active = false; };
  }, [initial?.id, isEdit]);

  // Fetch all categories on mount
  useEffect(() => {
    let active = true;
    const fetchCats = async () => {
      try {
        const { data } = await listCategoriesAdmin();
        if (active) {
          setCategories(data.results || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (active) setLoadingCategories(false);
      }
    };
    fetchCats();
    return () => { active = false; };
  }, []);

  // Consolidated user fetcher (loads in pages of 50)
  const fetchUsers = useCallback(async (page, search, append = false) => {
    try {
      if (page === 1) {
        setSearchingMembers(true);
      } else {
        setLoadingMore(true);
      }
      const { data } = await listUsersAdmin({
        search: search.trim(),
        limit: 50,
        page,
        role: 'user',
      });
      const newResults = data.results || [];
      if (append) {
        setSearchResults((prev) => [...prev, ...newResults]);
      } else {
        setSearchResults(newResults);
      }
      const totalPages = data.totalPages || 1;
      setHasMoreUsers(page < totalPages && newResults.length === 50);
      setUserPage(page);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setSearchingMembers(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounced search/load for users (always fires at least once for page 1 on mount)
  useEffect(() => {
    const t = setTimeout(() => {
      fetchUsers(1, memberQ, false);
    }, 300);
    return () => clearTimeout(t);
  }, [memberQ, fetchUsers]);

  // Click-outside listener to close the dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClose = () => setDropdownOpen(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [dropdownOpen]);

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Group title is required.');
    const total = parseInt(form.spotsTotal, 10);
    if (Number.isNaN(total) || total < 0) return setError('Target spots must be a non-negative number.');

    const payload = {
      title: form.title.trim(),
      productName: form.productName?.trim() || '',
      category: form.category || '',
      subCategory: form.subCategory || '',
      type: form.type,
      location: form.location?.trim() || '',
      coordinates: form.coordinates || null,
      image: form.image?.trim() || '',
      slogan: form.slogan?.trim() || '',
      description: form.description?.trim() || '',
      spotsTotal: total,
      status: form.status,
      trending: !!form.trending,
      creatorName: form.creatorName?.trim() || '',
      closesAt: form.closesAt || null,
      members: members.map((m) => m.id || m._id),
    };

    setSaving(true);
    try {
      if (isEdit) await updateGroupAdmin(initial.id, payload);
      else await createGroupAdmin(payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the group.');
      setSaving(false);
    }
  };

  const selectedCatObj = categories.find(
    (c) => c.name.toLowerCase() === form.category?.toLowerCase() || c.slug.toLowerCase() === form.category?.toLowerCase()
  );
  const subCategoriesList = selectedCatObj ? (selectedCatObj.subCategories || []) : [];

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
              {isEdit ? 'Edit Group' : 'Create New Group'}
            </div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>
              {isEdit ? 'Update group details, target, and lifecycle status.' : 'Spin up a demand group and set its target headcount.'}
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

          <SectionHeader icon={Boxes} title="Group details" subtitle="What buyers are pooling demand for." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Group title" required>
              <input style={inputStyle} value={form.title} onChange={set('title')} placeholder="e.g. Indore iPhone 16 Buyers" autoFocus />
            </Field>
            <Field label="Product / model" hint="The specific item being pooled.">
              <input style={inputStyle} value={form.productName} onChange={set('productName')} placeholder="e.g. iPhone 16 Pro 256GB" maxLength={120} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <Field label="Category">
              <select
                style={inputStyle}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value, subCategory: '' }))}
              >
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name} {!c.isActive && '(Hidden)'}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sub-category">
              <select style={inputStyle} value={form.subCategory} onChange={set('subCategory')}>
                <option value="">Select sub…</option>
                {subCategoriesList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Type" hint="Who is driving it.">
              <select style={inputStyle} value={form.type} onChange={set('type')}>
                {TYPES.map((t) => <option key={t} value={t}>{t === 'user' ? 'Buyer-led' : 'Vendor-led'}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Slogan" hint="A short tagline shown to buyers (optional).">
            <input style={inputStyle} value={form.slogan} onChange={set('slogan')} placeholder="Let's grab it together at the best price." maxLength={240} />
          </Field>

          <Field label="Description" hint="Optional longer description.">
            <textarea
              style={{ ...inputStyle, height: 'auto', minHeight: 64, padding: '10px 12px', resize: 'vertical' }}
              value={form.description}
              onChange={set('description')}
              placeholder="Details about the deal, terms, or vendor."
              maxLength={1000}
            />
          </Field>

          <Field label="Cover image" hint="Shown in the consumer app. Upload to Cloudinary or paste a URL.">
            <ImageUploader value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} folder="groups" />
          </Field>

          <SectionHeader icon={Tag} title="Target & lifecycle" subtitle="How big the group needs to get and where it sits." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Target spots" required hint="Headcount needed to lock the deal.">
              <input style={inputStyle} type="number" min={0} value={form.spotsTotal} onChange={set('spotsTotal')} placeholder="50" />
            </Field>
            <Field label="Status">
              <select style={inputStyle} value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Location" hint="Type to search — pick from Google suggestions.">
              <LocationAutocomplete
                value={form.location}
                onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                onCoordinates={(coords) => setForm((f) => ({ ...f, coordinates: coords }))}
                placeholder="Search city or area…"
              />
            </Field>
            <Field label="Closes on" hint="Deadline for the group to fill.">
              <input style={inputStyle} type="date" value={form.closesAt} onChange={set('closesAt')} />
            </Field>
          </div>

          <Field label="Creator name" hint="Display name of who started this group (optional).">
            <input style={inputStyle} value={form.creatorName} onChange={set('creatorName')} placeholder="e.g. Rahul Sharma" maxLength={80} />
          </Field>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', background: T.surfaceAlt, border: `1px solid ${form.trending ? T.warning : T.line}`, borderRadius: radius.lg, padding: 12 }}>
            <input type="checkbox" checked={!!form.trending} onChange={(e) => setForm((f) => ({ ...f, trending: e.target.checked }))} style={{ width: 16, height: 16, accentColor: T.warning, marginTop: 2 }} />
            <span>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.ink, display: 'flex', alignItems: 'center', gap: 6 }}><Star size={15} color={T.warning} /> Trending</span>
              <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.4, display: 'block', marginTop: 2 }}>Show this group in the “Trending Right Now” carousel on the app’s Groups page.</span>
            </span>
          </label>

          <SectionHeader icon={Users} title="Group members" subtitle="Search and select users to add to this group." />
          
          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <label style={labelStyle}>Add Members</label>
            <div className="admin-focusable" style={{ display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}>
              <Search size={16} color={T.faint} strokeWidth={2.1} />
              <input
                className="admin-input"
                value={memberQ}
                onChange={(e) => {
                  setMemberQ(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                placeholder="Type to search or browse users…"
                style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: T.ink, fontWeight: 500 }}
              />
              {searchingMembers && <Loader2 size={15} color={T.faint} className="admin-spin" />}
              {dropdownOpen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: 4, display: 'inline-flex', alignItems: 'center' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {dropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: 4, border: `1px solid ${T.line}`, borderRadius: radius.lg, overflow: 'hidden', background: T.surface, boxShadow: T.shadowLg }}>
                <div style={{ maxHeight: 240, overflowY: 'auto' }} className="admin-scroll">
                  {searchResults.length === 0 ? (
                    <div style={{ padding: '12px 16px', textAlign: 'center', color: T.faint, fontSize: 12.5 }}>No users found</div>
                  ) : (
                    searchResults.map((u) => {
                      const already = members.some((m) => (m.id || m._id) === u.id);
                      return (
                        <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderBottom: `1px solid ${T.lineSoft}` }}>
                          <Avatar name={u.name} color={T.primary} size={28} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                            <div className="font-mono-num" style={{ fontSize: 11, color: T.muted }}>{formatPhone(u.phone)}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!already) {
                                setMembers((prev) => [...prev, u]);
                              } else {
                                setMembers((prev) => prev.filter((x) => (x.id || x._id) !== u.id));
                              }
                            }}
                            className="admin-btn"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 26, padding: '0 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: already ? T.dangerSoft : T.primarySoft, color: already ? T.danger : T.primary }}
                          >
                            {already ? <><X size={12} /> Remove</> : <><UserPlus size={12} /> Add</>}
                          </button>
                        </div>
                      );
                    })
                  )}

                  {hasMoreUsers && (
                    <div style={{ padding: 8, display: 'flex', justifyContent: 'center', background: T.surfaceAlt, borderTop: `1px solid ${T.lineSoft}` }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchUsers(userPage + 1, memberQ, true);
                        }}
                        disabled={loadingMore}
                        className="admin-btn"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 14px', borderRadius: 6, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, cursor: 'pointer', fontSize: 11.5, fontWeight: 600 }}
                      >
                        {loadingMore ? <Loader2 size={13} className="admin-spin" /> : null}
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Selected Members ({members.length})</label>
            {loadingMembers ? (
              <div style={{ padding: '12px 0', textAlign: 'center', color: T.muted, fontSize: 12.5 }}>Loading members…</div>
            ) : members.length === 0 ? (
              <div style={{ padding: '12px 0', textAlign: 'center', color: T.faint, fontSize: 12.5, fontStyle: 'italic' }}>
                No members in this group yet. Use the search field above to add members.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 180, overflowY: 'auto', paddingRight: 4 }} className="admin-scroll">
                {members.map((m) => (
                  <div key={m.id || m._id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: T.surfaceAlt, borderRadius: radius.md, border: `1px solid ${T.line}` }}>
                    <Avatar name={m.name} color={T.violet} size={24} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                      <div className="font-mono-num" style={{ fontSize: 10.5, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {formatPhone(m.phone)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMembers((prev) => prev.filter((x) => (x.id || x._id) !== (m.id || m._id)))}
                      className="admin-icon-btn"
                      title="Remove member"
                      style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      <UserMinus size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 22px', borderTop: `1px solid ${T.lineSoft}`, position: 'sticky', bottom: 0, background: T.surface }}>
          <Button variant="soft" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={saving ? undefined : 'Check'} type="submit" style={saving ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Group'}
          </Button>
        </div>
      </form>
    </div>
  );
};

// ── Member management modal ─────────────────────────────────────────
const MembersModal = ({ group, onClose, onChanged }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getGroupAdmin(group.id);
      setDetail(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load group members.');
    } finally {
      setLoading(false);
    }
  }, [group.id]);

  useEffect(() => { loadDetail(); }, [loadDetail]);

  // Consolidated user fetcher (loads in pages of 50)
  const fetchUsers = useCallback(async (page, search, append = false) => {
    try {
      if (page === 1) {
        setSearching(true);
      } else {
        setLoadingMore(true);
      }
      const { data } = await listUsersAdmin({
        search: search.trim(),
        limit: 50,
        page,
        role: 'user',
      });
      const newResults = data.results || [];
      if (append) {
        setResults((prev) => [...prev, ...newResults]);
      } else {
        setResults(newResults);
      }
      const totalPages = data.totalPages || 1;
      setHasMoreUsers(page < totalPages && newResults.length === 50);
      setUserPage(page);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setSearching(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounced search/load for users
  useEffect(() => {
    const t = setTimeout(() => {
      fetchUsers(1, q, false);
    }, 300);
    return () => clearTimeout(t);
  }, [q, fetchUsers]);

  // Click-outside listener to close the dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClose = () => setDropdownOpen(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [dropdownOpen]);

  const memberIds = new Set((detail?.members || []).map((m) => m.id));

  const handleAdd = async (user) => {
    setBusyId(user.id);
    try {
      const { data } = await addGroupMember(group.id, user.id);
      setDetail(data);
      showToast(`Added ${user.name} to the group!`, '👤');
      onChanged?.();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add member.', '❌');
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (user) => {
    setBusyId(user.id);
    try {
      const { data } = await removeGroupMember(group.id, user.id);
      setDetail(data);
      showToast(`Removed ${user.name} from the group!`, '👤');
      onChanged?.();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove member.', '❌');
    } finally {
      setBusyId(null);
    }
  };

  const members = detail?.members || [];

  return (
    <div
      onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(16,16,20,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{ width: 560, maxWidth: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: T.surface, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${T.lineSoft}` }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Manage Members
            </div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>
              {group.title} · {members.length}/{group.spotsTotal || 0} spots filled
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }} className="admin-scroll">
          {error && (
            <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{error}</div>
          )}

          {/* Add member search */}
          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <label style={labelStyle}>Add a member</label>
            <div className="admin-focusable" style={{ display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}>
              <Search size={16} color={T.faint} strokeWidth={2.1} />
              <input
                className="admin-input"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                placeholder="Type to search or browse users…"
                style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: T.ink, fontWeight: 500 }}
              />
              {searching && <Loader2 size={15} color={T.faint} className="admin-spin" />}
              {dropdownOpen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: 4, display: 'inline-flex', alignItems: 'center' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {dropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: 4, border: `1px solid ${T.line}`, borderRadius: radius.lg, overflow: 'hidden', background: T.surface, boxShadow: T.shadowLg }}>
                <div style={{ maxHeight: 200, overflowY: 'auto' }} className="admin-scroll">
                  {results.length === 0 ? (
                    <div style={{ padding: '12px 16px', textAlign: 'center', color: T.faint, fontSize: 12.5 }}>No users found</div>
                  ) : (
                    results.map((u) => {
                      const already = memberIds.has(u.id);
                      return (
                        <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderBottom: `1px solid ${T.lineSoft}` }}>
                          <Avatar name={u.name} color={T.primary} size={28} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                            <div className="font-mono-num" style={{ fontSize: 11, color: T.muted }}>{formatPhone(u.phone)}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => !already && handleAdd(u)}
                            disabled={already || busyId === u.id}
                            className="admin-btn"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 26, padding: '0 8px', borderRadius: 6, border: 'none', cursor: already ? 'default' : 'pointer', fontSize: 11, fontWeight: 700, background: already ? T.lineSoft : T.primarySoft, color: already ? T.muted : T.primary, opacity: busyId === u.id ? 0.6 : 1 }}
                          >
                            {already ? <><Check size={12} /> Added</> : <><UserPlus size={12} /> Add</>}
                          </button>
                        </div>
                      );
                    })
                  )}

                  {hasMoreUsers && (
                    <div style={{ padding: 8, display: 'flex', justifyContent: 'center', background: T.surfaceAlt, borderTop: `1px solid ${T.lineSoft}` }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchUsers(userPage + 1, q, true);
                        }}
                        disabled={loadingMore}
                        className="admin-btn"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 14px', borderRadius: 6, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, cursor: 'pointer', fontSize: 11.5, fontWeight: 600 }}
                      >
                        {loadingMore ? <Loader2 size={13} className="admin-spin" /> : null}
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current members */}
          <div>
            <label style={labelStyle}>Current members ({members.length})</label>
            {loading ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: T.muted, fontSize: 13 }}>Loading members…</div>
            ) : members.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: T.faint, fontSize: 13 }}>No members yet — search above to add the first one.</div>
            ) : (
              <div style={{ border: `1px solid ${T.line}`, borderRadius: radius.lg, overflow: 'hidden' }}>
                {members.map((m, i) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: i === members.length - 1 ? 'none' : `1px solid ${T.lineSoft}` }}>
                    <Avatar name={m.name} color={T.violet} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                      <div className="font-mono-num" style={{ fontSize: 11.5, color: T.muted }}>{formatPhone(m.phone)}{m.email ? ` · ${m.email}` : ''}</div>
                    </div>
                    <button
                      onClick={() => handleRemove(m)}
                      disabled={busyId === m.id}
                      className="admin-icon-btn"
                      title="Remove from group"
                      style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: busyId === m.id ? 0.6 : 1, flexShrink: 0 }}
                    >
                      <UserMinus size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 22px', borderTop: `1px solid ${T.lineSoft}` }}>
          <Button variant="soft" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
};

// ── Group chat viewer (read-only) ───────────────────────────────────
const GroupChatModal = ({ group, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getGroupChatAdmin(group.id, 500);
        if (active) setMessages(data || []);
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Failed to load chat.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [group.id]);

  return (
    <div
      onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(16,16,20,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{ width: 560, maxWidth: '100%', height: '80vh', display: 'flex', flexDirection: 'column', background: T.surfaceAlt, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}`, overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 18px', borderBottom: `1px solid ${T.line}`, background: T.surface }}>
          <Avatar name={group.title} src={group.image} color={T.primary} size={38} square />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.title}</div>
            <div style={{ fontSize: 11.5, color: T.muted }}>Group chat · {group.spotsJoined || 0} members · read-only</div>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>
        <div className="admin-scroll" style={{ flex: 1, overflowY: 'auto' }}>
          <ChatTranscript messages={messages} loading={loading} error={error} emptyText="No messages in this group yet." />
        </div>
      </div>
    </div>
  );
};

// ── Page ────────────────────────────────────────────────────────────
const Groups = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, closing: 0, locked: 0, flagged: 0 });
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);        // null | 'new' | group object
  const [membersOf, setMembersOf] = useState(null); // null | group object
  const [chatOf, setChatOf] = useState(null);       // null | group object

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 100 };
      if (tab !== 'all') params.status = tab;
      if (q.trim()) params.search = q.trim();
      const { data } = await listGroupsAdmin(params);
      setRows(data.results || []);
      setCounts({ all: 0, active: 0, closing: 0, locked: 0, flagged: 0, ...(data.counts || {}) });
      dispatchStatsRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load groups.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, q]);

  useEffect(() => {
    const t = setTimeout(fetchData, 250);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleDelete = async (g) => {
    if (!window.confirm(`Delete group "${g.title}"? This cannot be undone.`)) return;
    try {
      await deleteGroupAdmin(g.id);
      showToast(`Group "${g.title}" deleted!`, '🗑️');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete group.', '❌');
    }
  };

  const setStatus = async (g, status) => {
    try {
      await updateGroupAdmin(g.id, { status });
      showToast(`Group status updated to ${status}!`, '⚙️');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update group.', '❌');
    }
  };

  const toggleTrending = async (g) => {
    try {
      await updateGroupAdmin(g.id, { trending: !g.trending });
      showToast(g.trending ? 'Removed from Trending.' : 'Added to Trending! ⭐');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update group.', '❌');
    }
  };

  const columns = [
    {
      key: 'title', label: 'Group', strong: true, render: (g) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, maxWidth: 300 }}>
          <Avatar name={g.title} src={g.image} color={g.status === 'flagged' ? T.danger : g.status === 'locked' || g.status === 'completed' ? T.success : T.primary} size={36} square />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 5 }}>
              {g.trending && <Star size={13} color={T.warning} fill={T.warning} style={{ flexShrink: 0 }} />}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.title}</span>
            </div>
            <div style={{ fontSize: 11.5, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {g.productName ? `${g.productName} · ` : ''}by {g.creator || '—'}
            </div>
            {g.slogan && (
              <div style={{ fontSize: 11, color: T.faint, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.slogan}</div>
            )}
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (g) => (
      g.category
        ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft, background: T.surfaceAlt, border: `1px solid ${T.line}`, padding: '3px 9px', borderRadius: 999, alignSelf: 'flex-start' }}>{g.category}</span>
            {g.subCategory && <span style={{ fontSize: 10.5, color: T.faint, paddingLeft: 2 }}>{g.subCategory}</span>}
          </div>
        )
        : <span style={{ color: T.faint }}>—</span>
    )},
    { key: 'type', label: 'Type', render: (g) => <StatusBadge status={g.type} dot={false} size="sm" /> },
    { key: 'progress', label: 'Progress', render: (g) => <Progress spotsJoined={g.spotsJoined} spotsTotal={g.spotsTotal} status={g.status} /> },
    { key: 'location', label: 'Location', render: (g) => <span style={{ color: g.location ? T.muted : T.faint }}>{g.location || '—'}</span> },
    { key: 'daysLeft', label: 'Closes', align: 'center', mono: true, render: (g) => (
      <span style={{ fontSize: 12, fontWeight: 600, color: g.status === 'closing' ? T.info : T.muted }}>{g.daysLeft}</span>
    )},
    { key: 'status', label: 'Status', render: (g) => <StatusBadge status={g.status} /> },
    {
      key: 'actions', label: '', align: 'right', render: (g) => (
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <button onClick={() => setMembersOf(g)} className="admin-btn" title="Manage members" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 32, padding: '0 10px', borderRadius: 8, border: 'none', background: T.primarySoft, color: T.primary, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
            <Users size={14} /> {g.spotsJoined}
          </button>
          <button onClick={() => setChatOf(g)} className="admin-icon-btn" title="View group chat" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.info, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} />
          </button>
          <button onClick={() => toggleTrending(g)} className="admin-icon-btn" title={g.trending ? 'Remove from Trending' : 'Mark as Trending'} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${g.trending ? T.warning : T.line}`, background: g.trending ? T.warningSoft : T.surface, color: T.warning, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={15} fill={g.trending ? T.warning : 'none'} />
          </button>
          {g.status !== 'flagged' ? (
            <button onClick={() => setStatus(g, 'flagged')} className="admin-icon-btn" title="Flag group" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={15} />
            </button>
          ) : (
            <button onClick={() => setStatus(g, 'active')} className="admin-icon-btn" title="Clear flag (re-activate)" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.success, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={15} />
            </button>
          )}
          {g.status !== 'locked' && g.status !== 'completed' && (
            <button onClick={() => setStatus(g, 'locked')} className="admin-icon-btn" title="Lock deal" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.violet, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={15} />
            </button>
          )}
          <button onClick={() => setModal(g)} className="admin-icon-btn" title="Edit" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(g)} className="admin-icon-btn" title="Delete" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: T.surface, color: T.danger, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
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
        title="Groups"
        subtitle="Create demand groups, manage members, track progress toward targets, lock deals, and moderate."
      >
        <Button variant="dark" icon="Plus" onClick={() => setModal('new')}>Create Group</Button>
      </PageHeader>

      <Panel padded={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: 16, flexWrap: 'wrap', borderBottom: `1px solid ${T.lineSoft}` }}>
          <SegmentTabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'active', label: 'Active', count: counts.active },
              { id: 'closing', label: 'Closing soon', count: counts.closing },
              { id: 'locked', label: 'Locked', count: counts.locked },
              { id: 'flagged', label: 'Flagged', count: counts.flagged },
            ]}
          />
          <SearchInput value={q} onChange={setQ} placeholder="Search groups…" />
        </div>
        <div style={{ padding: 20 }}>
          {error ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: T.danger, fontSize: 13.5, fontWeight: 600 }}>{error}</div>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              emptyText={loading ? 'Loading groups…' : 'No groups match your filters — create one to get started.'}
            />
          )}
        </div>
      </Panel>

      {modal && (
        <GroupModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchData(); }}
        />
      )}

      {membersOf && (
        <MembersModal
          group={membersOf}
          onClose={() => setMembersOf(null)}
          onChanged={fetchData}
        />
      )}

      {chatOf && (
        <GroupChatModal group={chatOf} onClose={() => setChatOf(null)} />
      )}
    </>
  );
};

export default Groups;
