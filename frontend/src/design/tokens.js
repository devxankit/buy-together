// Buy Together — Design Tokens
// Emerald primary · cool gray neutrals · Geist font

export const c = {
  primary:     '#0D9488',
  primarySoft: '#E6F4F2',
  primaryDeep: '#0B7A70',
  primaryTint: '#F2FAF9',
  primaryGlow: 'rgba(13,148,136,0.18)',

  ink:         '#0F0F12',
  inkSoft:     '#2A2A30',
  muted:       '#6B6B72',
  faint:       '#A8A8AE',
  line:        '#E5E5EA',
  lineSoft:    '#F0F0F3',
  surface:     '#FFFFFF',
  surfaceAlt:  '#F6F6F8',
  surfaceDeep: '#EFEFF3',
  surfaceInk:  '#0E0E11',

  saving:      '#0D9488',
  savingSoft:  '#E6F4F2',
  danger:      '#B43A30',
  dangerSoft:  '#FAE3DF',
  info:        '#2C5680',
  infoSoft:    '#E4ECF4',

  inkAlpha8:   'rgba(15,15,18,0.08)',
  inkAlpha4:   'rgba(15,15,18,0.04)',
};

export const f = {
  sans: "'Geist', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
  mono: "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
};

export const r = { sm: 8, md: 10, lg: 12, xl: 16, '2xl': 20, '3xl': 24, pill: 9999 };

export const s = {
  sm:      '0 1px 2px rgba(15,15,18,0.04)',
  md:      '0 4px 16px -4px rgba(15,15,18,0.07), 0 1px 2px rgba(15,15,18,0.03)',
  lg:      '0 16px 40px -12px rgba(15,15,18,0.10), 0 2px 6px rgba(15,15,18,0.03)',
  xl:      '0 30px 60px -18px rgba(15,15,18,0.16), 0 4px 12px rgba(15,15,18,0.05)',
  glow:    '0 18px 40px -16px rgba(13,148,136,0.50)',
  inkGlow: '0 18px 40px -16px rgba(15,15,18,0.40)',
  inset:   'inset 0 0 0 1px rgba(15,15,18,0.06)',
};

const DT = { c, f, r, s };
export default DT;
