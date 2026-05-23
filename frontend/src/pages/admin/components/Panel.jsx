import { T, radius } from '../theme/adminTheme';

// A surface container with an optional header (title, subtitle, right-aligned action).
const Panel = ({ title, subtitle, action, padded = true, children, style, bodyStyle, className = '' }) => (
  <section
    className={`admin-card-hover ${className}`}
    style={{
      background: T.surface,
      border: `1px solid ${T.line}`,
      borderRadius: radius['2xl'],
      boxShadow: T.shadowSm,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      ...style,
    }}
  >
    {(title || action) && (
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, padding: '18px 20px',
        borderBottom: `1px solid ${T.lineSoft}`,
      }}>
        <div style={{ minWidth: 0 }}>
          {title && <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.ink, letterSpacing: '-0.02em' }}>{title}</h3>}
          {subtitle && <p style={{ margin: '3px 0 0', fontSize: 12.5, color: T.muted, fontWeight: 500 }}>{subtitle}</p>}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </header>
    )}
    <div style={{ padding: padded ? 20 : 0, flex: 1, ...bodyStyle }}>{children}</div>
  </section>
);

export default Panel;
