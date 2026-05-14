// Buy Together — Design Tokens (v3 · "Clean Professional")
// White canvas + emerald accent + neutral cool grays. Geist only. No serif. No warm tones.

const DT = {
  // ─── Color ────────────────────────────────────────────────
  c: {
    // brand — deep emerald (single accent for CTA · savings · trust)
    primary:      '#0F6B53',
    primarySoft:  '#E4F0EC',
    primaryDeep:  '#0A4F3C',
    primaryTint:  '#F5FAF8',
    primaryGlow:  'rgba(15,107,83,0.18)',

    // accent / gold are removed — alias to neutrals so legacy refs render clean
    accent:       '#0F0F12',     // ink fallback
    accentSoft:   '#F2F2F5',
    accentDeep:   '#0F0F12',
    gold:         '#0F0F12',     // ink fallback
    goldSoft:     '#F2F2F5',

    // neutrals — cool, professional
    ink:          '#0F0F12',
    inkSoft:      '#2A2A30',
    muted:        '#6B6B72',
    faint:        '#A8A8AE',
    line:         '#E5E5EA',
    lineSoft:     '#F0F0F3',
    surface:      '#FFFFFF',
    surfaceWarm:  '#FFFFFF',     // Cards = pure white
    surfaceAlt:   '#F6F6F8',     // App canvas — very subtle cool gray
    surfaceDeep:  '#EFEFF3',     // Inset / track
    surfaceInk:   '#0E0E11',

    // semantic — reuses palette so screens stay monochromatic
    saving:       '#0F6B53',     // savings = primary emerald
    savingSoft:   '#E4F0EC',
    danger:       '#B43A30',
    dangerSoft:   '#FAE3DF',
    info:         '#2C5680',     // navy for verified
    infoSoft:     '#E4ECF4',
    warning:      '#6B6B72',     // neutral

    inkAlpha8:    'rgba(15,15,18,0.08)',
    inkAlpha4:    'rgba(15,15,18,0.04)',
  },

  // ─── Typography ──────────────────────────────────────────
  f: {
    // Same sans for everything — no serif, no italic decoration
    display: "'Geist', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
    sans:    "'Geist', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
    mono:    "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
  },

  // ─── Radii ───────────────────────────────────────────────
  r: { sm: 8, md: 10, lg: 12, xl: 16, '2xl': 20, '3xl': 24, pill: 9999 },

  // ─── Shadows (neutral, never warm) ───────────────────────
  s: {
    sm:  '0 1px 2px rgba(15,15,18,0.04)',
    md:  '0 4px 16px -4px rgba(15,15,18,0.07), 0 1px 2px rgba(15,15,18,0.03)',
    lg:  '0 16px 40px -12px rgba(15,15,18,0.10), 0 2px 6px rgba(15,15,18,0.03)',
    xl:  '0 30px 60px -18px rgba(15,15,18,0.16), 0 4px 12px rgba(15,15,18,0.05)',
    glow:'0 18px 40px -16px rgba(15,107,83,0.50)',
    inkGlow:'0 18px 40px -16px rgba(15,15,18,0.40)',
    inset:'inset 0 0 0 1px rgba(15,15,18,0.06)',
  },
};

// Frame size for every phone artboard
const PHONE_W = 390;
const PHONE_H = 844;

Object.assign(window, { DT, PHONE_W, PHONE_H });
