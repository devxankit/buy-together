import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, StatusBadge, Button } from '../components';
import { showToast } from '../../../utils/toast';
import {
  listContentPagesAdmin,
  updateContentPage,
} from '../../../services/contentPage.api';

// Friendly metadata per slug for the listing + editor hints.
const PAGE_META = {
  'help-center': { name: 'Help Center', hint: 'FAQs + support contact. Each section is a question (title) and its answer (body).', sectionWord: 'FAQ' },
  terms: { name: 'Terms & Conditions', hint: 'Legal clauses. Each section is a clause title + body.', sectionWord: 'Clause' },
  privacy: { name: 'Privacy Policy', hint: 'Privacy clauses. The intro renders as the highlighted banner.', sectionWord: 'Clause' },
  'community-guidelines': { name: 'Community Guidelines', hint: 'Rules. Each section may have a leading emoji (icon).', sectionWord: 'Rule' },
  about: { name: 'About Us', hint: 'Company info. Intro shows under the brand card; sections are info cards.', sectionWord: 'Section' },
};

const inputStyle = {
  width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 13.5, color: T.ink, fontWeight: 500,
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

const iconBtn = (disabled) => ({
  width: 28, height: 28, borderRadius: 7, border: `1px solid ${T.line}`,
  background: T.surface, color: disabled ? T.faint : T.inkSoft,
  cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
});

// ── Sections editor ─────────────────────────────────────────────────
const SectionsEditor = ({ sections, onChange, sectionWord }) => {
  const update = (i, key, value) => {
    const next = sections.map((s, idx) => (idx === i ? { ...s, [key]: value } : s));
    onChange(next);
  };
  const remove = (i) => onChange(sections.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const next = [...sections];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  };
  const add = () => onChange([...sections, { icon: '', title: '', body: '' }]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ ...labelStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
        <span>Sections · {sections.length}</span>
        <button type="button" onClick={add} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: T.primary, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Plus size={14} /> Add {sectionWord}
        </button>
      </div>

      {sections.length === 0 && (
        <div style={{ padding: '14px 12px', fontSize: 12.5, color: T.faint, fontStyle: 'italic', textAlign: 'center', border: `1px dashed ${T.line}`, borderRadius: radius.lg }}>
          No sections yet. Add one above.
        </div>
      )}

      {sections.map((s, i) => (
        <div key={s.id || s._id || i} style={{ border: `1px solid ${T.line}`, borderRadius: radius.lg, padding: 12, background: T.surface, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              value={s.icon || ''}
              onChange={(e) => update(i, 'icon', e.target.value)}
              placeholder="🙂"
              maxLength={8}
              style={{ ...inputStyle, width: 52, textAlign: 'center', minHeight: 38, padding: '0 6px' }}
              title="Optional leading emoji"
            />
            <input
              value={s.title || ''}
              onChange={(e) => update(i, 'title', e.target.value)}
              placeholder="Section title / question"
              maxLength={200}
              style={{ ...inputStyle, flex: 1, minHeight: 38 }}
            />
            <div style={{ display: 'inline-flex', gap: 4, flexShrink: 0 }}>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Move up" style={iconBtn(i === 0)}><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === sections.length - 1} title="Move down" style={iconBtn(i === sections.length - 1)}><ArrowDown size={14} /></button>
              <button type="button" onClick={() => remove(i)} title="Remove" style={{ ...iconBtn(false), color: T.danger }}><Trash2 size={14} /></button>
            </div>
          </div>
          <textarea
            value={s.body || ''}
            onChange={(e) => update(i, 'body', e.target.value)}
            placeholder="Section body / answer"
            rows={3}
            maxLength={6000}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
      ))}
    </div>
  );
};

// ── Page editor modal ───────────────────────────────────────────────
const PageModal = ({ page, onClose, onSaved }) => {
  const meta = PAGE_META[page.slug] || { name: page.slug, hint: '', sectionWord: 'Section' };
  const [form, setForm] = useState({
    title: page.title || '',
    intro: page.intro || '',
    lastUpdated: page.lastUpdated || '',
    contactEmail: page.contactEmail || '',
    isActive: page.isActive !== false,
  });
  const [sections, setSections] = useState((page.sections || []).map((s) => ({ icon: s.icon || '', title: s.title || '', body: s.body || '' })));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Page title is required.');
    const payload = {
      title: form.title.trim(),
      intro: form.intro.trim(),
      lastUpdated: form.lastUpdated.trim(),
      contactEmail: form.contactEmail.trim(),
      isActive: form.isActive,
      sections: sections.map((s) => ({ icon: (s.icon || '').trim(), title: (s.title || '').trim(), body: (s.body || '').trim() })),
    };
    setSaving(true);
    try {
      await updateContentPage(page.slug, payload);
      showToast('Page saved successfully! 🎉');
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the page.');
      setSaving(false);
    }
  };

  return (
    <div onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(16,16,20,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <form onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}
        style={{ width: 660, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', background: T.surface, borderRadius: radius['2xl'], boxShadow: T.shadowLg, border: `1px solid ${T.line}` }}
        className="admin-scroll"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${T.lineSoft}`, position: 'sticky', top: 0, background: T.surface, borderRadius: `${radius['2xl']}px ${radius['2xl']}px 0 0`, zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Edit · {meta.name}</div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{meta.hint}</div>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ background: T.dangerSoft, color: T.danger, fontSize: 12.5, fontWeight: 600, padding: '10px 12px', borderRadius: radius.md }}>{error}</div>}

          <Field label="Page title">
            <input style={inputStyle} value={form.title} onChange={set('title')} maxLength={120} autoFocus />
          </Field>

          <Field label="Intro / banner text" hint="Optional. Shown as a highlighted banner above the sections (Privacy, Community, About).">
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.intro} onChange={set('intro')} maxLength={2000} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="“Last updated” stamp" hint="e.g. May 2026 (Terms & Privacy).">
              <input style={inputStyle} value={form.lastUpdated} onChange={set('lastUpdated')} maxLength={60} placeholder="May 2026" />
            </Field>
            <Field label="Contact email" hint="Optional (Help Center & About).">
              <input style={inputStyle} value={form.contactEmail} onChange={set('contactEmail')} maxLength={120} placeholder="support@buytogether.in" />
            </Field>
          </div>

          <div style={{ borderTop: `1px solid ${T.lineSoft}`, paddingTop: 16 }}>
            <SectionsEditor sections={sections} onChange={setSections} sectionWord={meta.sectionWord} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 4 }}>
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} style={{ width: 16, height: 16, accentColor: T.primary }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Active</span>
            <span style={{ fontSize: 12, color: T.muted }}>— visible in the user app</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 22px', borderTop: `1px solid ${T.lineSoft}`, position: 'sticky', bottom: 0, background: T.surface }}>
          <Button variant="soft" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={saving ? undefined : 'Check'} type="submit" style={saving ? { opacity: 0.7, pointerEvents: 'none' } : undefined}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const ContentPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await listContentPagesAdmin();
      setPages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load content pages.');
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <>
      <PageHeader
        eyebrow="Content"
        title="Content Pages"
        subtitle="Edit the Help Center, Terms, Privacy, Community Guidelines, and About Us content shown in the user app — no code changes needed."
      />

      <Panel>
        {error ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: T.danger, fontSize: 13.5, fontWeight: 600 }}>{error}</div>
        ) : loading ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: T.muted, fontSize: 13.5 }}>Loading pages…</div>
        ) : pages.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: T.muted, fontSize: 13.5 }}>
            No content pages found. Run <code style={{ background: T.surfaceAlt, padding: '2px 6px', borderRadius: 6 }}>npm run seed:content</code> in the backend to populate them.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {pages.map((p) => {
              const meta = PAGE_META[p.slug] || { name: p.slug };
              return (
                <div key={p.id || p.slug} style={{ border: `1px solid ${T.line}`, borderRadius: radius.xl, padding: 16, background: T.surface, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: radius.md, background: T.primarySoft, color: T.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={18} />
                    </div>
                    <StatusBadge status={p.isActive ? 'active' : 'low'} label={p.isActive ? 'Active' : 'Hidden'} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: T.ink }}>{meta.name}</div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{(p.sections || []).length} section{(p.sections || []).length === 1 ? '' : 's'} · /{p.slug}</div>
                  </div>
                  <Button variant="soft" size="sm" icon="Pencil" onClick={() => setEditing(p)} style={{ alignSelf: 'flex-start' }}>Edit content</Button>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {editing && (
        <PageModal
          page={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchData(); }}
        />
      )}
    </>
  );
};

export default ContentPages;
