// Buy Together — Admin Panel Design System
// A self-contained premium theme: light content surface + dark ink sidebar,
// teal brand accent. Kept independent of the mobile app's dark-mode tokens so
// the admin console always renders as a crisp, professional light dashboard.

export const T = {
  /* Brand */
  primary:      '#0D9488',
  primaryDeep:  '#0B7A70',
  primaryDark:  '#075E57',
  primarySoft:  '#E6F4F2',
  primaryTint:  '#F2FAF9',
  primaryGlow:  'rgba(13,148,136,0.30)',

  /* Sidebar (dark ink) */
  sidebar:        '#0E0E12',
  sidebarAlt:     '#17171C',
  sidebarElev:    '#1E1E25',
  sidebarLine:    'rgba(255,255,255,0.08)',
  sidebarText:    '#9A9AA4',
  sidebarTextHi:  '#FFFFFF',
  sidebarMuted:   '#65656E',

  /* Content surfaces */
  bg:           '#F6F7F9',
  bgDeep:       '#EFF1F4',
  surface:      '#FFFFFF',
  surfaceAlt:   '#F7F8FA',

  /* Ink / text */
  ink:          '#101014',
  inkSoft:      '#33333B',
  muted:        '#6A6A74',
  faint:        '#9B9BA4',
  line:         '#E8E9EE',
  lineSoft:     '#F1F2F5',

  /* Semantic */
  success:      '#0D9488',
  successSoft:  '#E6F4F2',
  warning:      '#B7791F',
  warningSoft:  '#FBF0DC',
  danger:       '#D14343',
  dangerSoft:   '#FBEAEA',
  info:         '#2C5680',
  infoSoft:     '#E6EDF5',
  violet:       '#6D5BD0',
  violetSoft:   '#ECE9FA',
  amber:        '#D08700',
  amberSoft:    '#FBF1DC',

  /* Shadows */
  shadowXs:  '0 1px 2px rgba(16,16,20,0.04)',
  shadowSm:  '0 1px 3px rgba(16,16,20,0.06), 0 1px 2px rgba(16,16,20,0.04)',
  shadowMd:  '0 4px 16px -4px rgba(16,16,20,0.08), 0 1px 2px rgba(16,16,20,0.04)',
  shadowLg:  '0 16px 40px -12px rgba(16,16,20,0.14), 0 2px 6px rgba(16,16,20,0.04)',
  shadowGlow:'0 12px 30px -10px rgba(13,148,136,0.45)',
};

export const radius = { sm: 8, md: 10, lg: 12, xl: 14, '2xl': 18, '3xl': 24, pill: 9999 };

export const font = {
  sans: "'Geist', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
  mono: "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
};

// Layout dimensions
export const dims = {
  sidebarWidth: 264,
  sidebarCollapsed: 76,
  topbarHeight: 68,
};

export default T;
