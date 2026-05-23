import * as Icons from 'lucide-react';
import { T, radius } from '../theme/adminTheme';

const VARIANTS = {
  primary: { background: T.primary, color: '#fff', border: '1px solid transparent', boxShadow: T.shadowGlow },
  dark:    { background: T.ink, color: '#fff', border: '1px solid transparent', boxShadow: T.shadowSm },
  soft:    { background: T.surface, color: T.ink, border: `1px solid ${T.line}`, boxShadow: T.shadowXs },
  ghost:   { background: 'transparent', color: T.inkSoft, border: '1px solid transparent', boxShadow: 'none' },
  danger:  { background: T.dangerSoft, color: T.danger, border: '1px solid transparent', boxShadow: 'none' },
};

const SIZES = {
  sm: { height: 32, padding: '0 12px', fontSize: 12.5, gap: 6, icon: 15 },
  md: { height: 38, padding: '0 15px', fontSize: 13.5, gap: 7, icon: 16 },
  lg: { height: 44, padding: '0 20px', fontSize: 14.5, gap: 8, icon: 18 },
};

const Button = ({ children, variant = 'soft', size = 'md', icon, iconRight, onClick, style, type = 'button', title }) => {
  const v = VARIANTS[variant] || VARIANTS.soft;
  const s = SIZES[size] || SIZES.md;
  const Icon = icon && Icons[icon];
  const IconR = iconRight && Icons[iconRight];
  return (
    <button
      type={type} onClick={onClick} title={title}
      className="admin-btn"
      style={{
        ...v, ...s, padding: s.padding, height: s.height, fontSize: s.fontSize, gap: s.gap,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: radius.lg, fontWeight: 600, fontFamily: 'inherit', letterSpacing: '-0.01em',
        cursor: 'pointer', whiteSpace: 'nowrap', ...style,
      }}
    >
      {Icon && <Icon size={s.icon} strokeWidth={2.2} />}
      {children}
      {IconR && <IconR size={s.icon} strokeWidth={2.2} />}
    </button>
  );
};

export default Button;
