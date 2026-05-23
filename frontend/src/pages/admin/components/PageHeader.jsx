import { T } from '../theme/adminTheme';

// Page title block: eyebrow + title + subtitle on the left, actions on the right.
const PageHeader = ({ eyebrow, title, subtitle, children }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    gap: 16, flexWrap: 'wrap', marginBottom: 22,
  }}>
    <div>
      {eyebrow && (
        <span style={{ fontSize: 11.5, fontWeight: 700, color: T.primary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {eyebrow}
        </span>
      )}
      <h1 style={{ margin: eyebrow ? '6px 0 0' : 0, fontSize: 24, fontWeight: 800, color: T.ink, letterSpacing: '-0.03em' }}>{title}</h1>
      {subtitle && <p style={{ margin: '5px 0 0', fontSize: 13.5, color: T.muted, fontWeight: 500, maxWidth: 560 }}>{subtitle}</p>}
    </div>
    {children && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>{children}</div>}
  </div>
);

export default PageHeader;
