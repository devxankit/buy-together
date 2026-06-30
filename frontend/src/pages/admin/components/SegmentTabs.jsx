import { T, radius } from '../theme/adminTheme';

// Pill segmented control. tabs: [{ id, label, count? }]
const SegmentTabs = ({ tabs = [], value, onChange }) => (
  <div style={{
    display: 'inline-flex', gap: 3, padding: 3,
    background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg,
  }}>
    {tabs.map((t) => {
      const active = value === t.id;
      return (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange?.(t.id)}
          className="admin-btn"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 13px', borderRadius: radius.md, border: 'none', cursor: 'pointer',
            background: active ? T.surface : 'transparent',
            color: active ? T.ink : T.muted,
            boxShadow: active ? T.shadowXs : 'none',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit', letterSpacing: '-0.01em',
          }}
        >
          {t.label}
          {t.count != null && (
            <span className="font-mono-num" style={{
              fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
              background: active ? T.primarySoft : T.lineSoft, color: active ? T.primary : T.faint,
            }}>{t.count}</span>
          )}
        </button>
      );
    })}
  </div>
);

export default SegmentTabs;
