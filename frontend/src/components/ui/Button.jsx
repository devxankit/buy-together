import { c, s } from '../../design/tokens';

const variants = {
  primary: { bg: c.primary,      fg: '#fff',   shadow: s.glow },
  dark:    { bg: c.ink,          fg: '#fff',   shadow: s.inkGlow },
  soft:    { bg: '#fff',         fg: c.ink,    ring: c.line, shadow: s.sm },
  ghost:   { bg: 'transparent',  fg: c.ink },
};

const sizes = {
  sm: { h: 38, px: 14, fs: 12.5, r: 12 },
  md: { h: 48, px: 18, fs: 14,   r: 14 },
  lg: { h: 56, px: 22, fs: 15,   r: 16 },
};

const Button = ({ children, variant = 'primary', size = 'md', icon, iconRight, full, style, onClick, type = 'button' }) => {
  const v = variants[variant] || variants.primary;
  const sz = sizes[size] || sizes.md;
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        height: sz.h, padding: `0 ${sz.px}px`, borderRadius: sz.r,
        background: v.bg, color: v.fg,
        fontSize: sz.fs, fontWeight: 600, letterSpacing: -0.1,
        border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 9, cursor: 'pointer', width: full ? '100%' : 'auto',
        boxShadow: (v.ring ? `inset 0 0 0 1px ${v.ring}, ` : '') + (v.shadow || 'none'),
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {icon}{children}{iconRight}
    </button>
  );
};

export default Button;
