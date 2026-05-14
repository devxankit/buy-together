import { c } from '../../design/tokens';

const tones = {
  ink:     { bg: '#0F0F12',      fg: '#fff' },
  primary: { bg: '#0F6B53',      fg: '#fff' },
  saving:  { bg: c.savingSoft,   fg: c.primaryDeep },
  danger:  { bg: c.dangerSoft,   fg: c.danger },
  info:    { bg: c.infoSoft,     fg: c.info },
  soft:    { bg: '#fff',         fg: c.ink,  ring: c.line },
  outline: { bg: 'transparent',  fg: c.ink,  ring: c.line },
};

const Chip = ({ children, tone = 'ink', size = 'sm', icon }) => {
  const t = tones[tone] || tones.ink;
  const px = size === 'xs' ? 7 : 10;
  const py = size === 'xs' ? 3 : 5;
  const fs = size === 'xs' ? 9.5 : 10.5;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: `${py}px ${px}px`, borderRadius: 999, fontWeight: 600,
      fontSize: fs, letterSpacing: 0.6, textTransform: 'uppercase',
      background: t.bg, color: t.fg,
      boxShadow: t.ring ? `inset 0 0 0 1px ${t.ring}` : 'none',
      whiteSpace: 'nowrap', lineHeight: 1,
    }}>
      {icon}{children}
    </span>
  );
};

export default Chip;
