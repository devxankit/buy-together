// Shared UI atoms used across screens
// All screens import these via window globals

// ─── Icon library — minimal hand-drawn SVGs ────────────────────────
const Icon = ({ name, size = 20, color = 'currentColor', stroke = 2, fill = 'none' }) => {
  const paths = {
    search:   <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    menu:     <><path d="M3 6h18M3 12h18M3 18h18"/></>,
    bell:     <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    location: <><path d="M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12Z"/><circle cx="12" cy="10" r="3"/></>,
    users:    <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    home:     <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    flame:    <><path d="M12 2c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3 1-5-1-7 2-9Z"/></>,
    plus:     <><path d="M12 5v14M5 12h14"/></>,
    arrowR:   <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    arrowL:   <><path d="M19 12H5M11 5l-7 7 7 7"/></>,
    chevR:    <><path d="m9 6 6 6-6 6"/></>,
    chevD:    <><path d="m6 9 6 6 6-6"/></>,
    chevU:    <><path d="m6 15 6-6 6 6"/></>,
    check:    <><path d="m5 12 5 5L20 7"/></>,
    checkCircle: <><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-5"/></>,
    x:        <><path d="M18 6 6 18M6 6l12 12"/></>,
    heart:    <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></>,
    star:     <><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2Z"/></>,
    bag:      <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></>,
    log:      <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>,
    send:     <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    mic:      <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3"/></>,
    image:    <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></>,
    poll:     <><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="13" y="8" width="3" height="10"/><rect x="19" y="5" width="2" height="13" opacity=".4"/></>,
    target:   <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    bolt:     <><path d="M13 2 3 14h7v8l10-12h-7Z"/></>,
    shield:   <><path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6Z"/><path d="m9 12 2 2 4-4"/></>,
    tag:      <><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"/><circle cx="7" cy="7" r="1.5" fill={color}/></>,
    edit:     <><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></>,
    phone:    <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></>,
    lock:     <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    crown:    <><path d="m2 20 3-10 5 5 2-9 2 9 5-5 3 10Z"/><path d="M2 20h20"/></>,
    sparkle:  <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></>,
    trending: <><path d="m22 7-9.5 9.5-5-5L2 17"/><path d="M16 7h6v6"/></>,
    filter:   <><path d="M22 3H2l8 9.46V19l4 2v-8.54Z"/></>,
    layers:   <><path d="m12 2 10 6-10 6L2 8Z"/><path d="m2 14 10 6 10-6"/></>,
    clock:    <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    rupee:    <><path d="M6 3h12M6 8h12M9 13c5 0 6-5 1-5"/><path d="m9 13 7 8M6 13h3"/></>,
    eye:      <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    mapPin:   <><path d="M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12Z" fill={fill || color} stroke="none"/><circle cx="12" cy="10" r="2.5" fill="#fff"/></>,
    pin:      <><path d="M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12Z"/><circle cx="12" cy="10" r="3"/></>,
    verified: <><path d="m9 12 2 2 4-4"/><path d="M12 2 9.5 4.3 6.2 4 5 7.2 2 9l1.5 3L2 15l3 1.8 1.2 3.2 3.3-.3L12 22l2.5-2.3 3.3.3 1.2-3.2L22 15l-1.5-3L22 9l-3-1.8L17.8 4l-3.3.3Z"/></>,
    grid:     <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    chat:     <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></>,
    award:    <><circle cx="12" cy="8" r="6"/><path d="M9 13.5 7 22l5-3 5 3-2-8.5"/></>,
    share:    <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></>,
    bookmark: <><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></>,
    info:     <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></>,
    qr:       <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></>,
  };
  const isFilled = fill && fill !== 'none';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={isFilled ? fill : 'none'} stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}>
      {paths[name] || null}
    </svg>
  );
};

// ─── Reusable atoms ────────────────────────────────────────────────
const PhoneShell = ({ children, dark = false, bg, label, title }) => (
  <IOSDevice width={PHONE_W} height={PHONE_H} dark={dark}
    style={{ background: bg || DT.c.surfaceAlt }}>
    {children}
  </IOSDevice>
);

// Status-bar replacement when we already supply our own header
const Status = ({ dark = false }) => <IOSStatusBar dark={dark} />;

const Avatar = ({ seed = 1, size = 28, ring = false }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: `linear-gradient(135deg, ${avPal(seed)[0]}, ${avPal(seed)[1]})`,
    boxShadow: ring ? `0 0 0 2px ${DT.c.surfaceAlt}` : 'none',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 600, fontSize: size * 0.36, flexShrink: 0,
    letterSpacing: 0.2, fontFamily: DT.f.sans,
  }}>{INITIALS[seed % INITIALS.length]}</div>
);
const avPal = (s) => AVATAR_GRADIENTS[s % AVATAR_GRADIENTS.length];
const INITIALS = ['RK','SN','PJ','AM','VS','MK','TR','NB','DG','KP','HS','LM'];
// Restrained, warm earth-toned gradients — no candy colors
const AVATAR_GRADIENTS = [
  ['#2C4A40','#1A5D4F'],  // emerald
  ['#3A4458','#2C3548'],  // slate ink
  ['#A88341','#8C6B30'],  // champagne gold
  ['#7A4E3A','#5C3825'],  // walnut
  ['#2C5680','#1F4264'],  // navy
  ['#3D3D45','#26262C'],  // graphite
  ['#5C6E5A','#445046'],  // sage
  ['#9F3F1E','#7A2F15'],  // terracotta
  ['#4A3A55','#332842'],  // aubergine
  ['#6B5945','#4D4032'],  // bronze
];

const AvatarStack = ({ count = 3, more, size = 24 }) => (
  <div style={{ display: 'flex' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ marginLeft: i ? -size * 0.35 : 0, boxShadow: '0 0 0 2px #fff', borderRadius:'50%' }}>
        <Avatar seed={i + 2} size={size} />
      </div>
    ))}
    {more != null && (
      <div style={{
        marginLeft: -size * 0.35, width: size, height: size, borderRadius: '50%',
        background: DT.c.ink, color: '#fff', fontSize: size*0.35, fontWeight: 800,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 2px #fff',
      }}>+{more}</div>
    )}
  </div>
);

const Progress = ({ value, total, height = 6, color }) => {
  const pct = Math.min(100, (value / total) * 100);
  return (
    <div style={{
      height, borderRadius: 99, background: DT.c.surfaceDeep, overflow: 'hidden', flex: 1,
    }}>
      <div style={{
        width: `${pct}%`, height: '100%', borderRadius: 99,
        background: color || `linear-gradient(90deg, ${DT.c.primaryDeep}, ${DT.c.primary})`,
      }} />
    </div>
  );
};

const Chip = ({ children, tone = 'ink', size = 'sm', icon }) => {
  const t = {
    ink:    { bg: DT.c.ink,        fg: '#fff' },
    primary:{ bg: DT.c.primary,    fg: '#fff' },
    saving: { bg: DT.c.savingSoft, fg: DT.c.primaryDeep },
    danger: { bg: DT.c.dangerSoft, fg: DT.c.danger },
    info:   { bg: DT.c.infoSoft,   fg: DT.c.info },
    gold:   { bg: DT.c.goldSoft,   fg: DT.c.gold },
    accent: { bg: DT.c.accentSoft, fg: DT.c.accentDeep },
    soft:   { bg: DT.c.surfaceWarm, fg: DT.c.ink, ring: DT.c.line },
    outline:{ bg: 'transparent',   fg: DT.c.ink, ring: DT.c.line },
  }[tone];
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
      fontFamily: DT.f.sans,
    }}>{icon}{children}</span>
  );
};

const Card = ({ children, style, p = 16, r = DT.r['2xl'], elevation = 'md' }) => (
  <div style={{
    background: '#fff', borderRadius: r, padding: p,
    border: `1px solid ${DT.c.lineSoft}`,
    boxShadow: DT.s[elevation],
    ...style,
  }}>{children}</div>
);

const Btn = ({ children, variant = 'primary', size = 'md', icon, iconRight, full, style, onClick }) => {
  const variants = {
    primary: { bg: DT.c.primary, fg: '#fff', shadow: DT.s.glow },
    dark:    { bg: DT.c.ink,     fg: '#fff', shadow: DT.s.inkGlow },
    soft:    { bg: DT.c.surfaceWarm, fg: DT.c.ink, ring: DT.c.line, shadow: DT.s.sm },
    ghost:   { bg: 'transparent', fg: DT.c.ink },
    gold:    { bg: DT.c.goldSoft, fg: DT.c.gold },
    accent:  { bg: DT.c.accent, fg: '#fff' },
  };
  const v = variants[variant];
  const sizes = {
    sm: { h: 38, px: 14, fs: 12.5, r: 12 },
    md: { h: 48, px: 18, fs: 14,   r: 14 },
    lg: { h: 56, px: 22, fs: 15,   r: 16 },
  };
  const s = sizes[size];
  return (
    <button onClick={onClick} style={{
      height: s.h, padding: `0 ${s.px}px`, borderRadius: s.r,
      background: v.bg, color: v.fg,
      fontSize: s.fs, fontWeight: 600, letterSpacing: -0.1,
      border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: 9, cursor: 'pointer', width: full ? '100%' : 'auto',
      boxShadow: (v.ring ? `inset 0 0 0 1px ${v.ring}, ` : '') + (v.shadow || 'none'),
      fontFamily: DT.f.sans,
      ...style,
    }}>
      {icon}{children}{iconRight}
    </button>
  );
};

// Header (in-screen) for app screens with title + back + action
const ScreenHeader = ({ back, title, subtitle, right, transparent, dark }) => (
  <div style={{
    padding: '8px 18px 14px',
    display: 'flex', alignItems: 'center', gap: 12,
    background: transparent ? 'transparent' : (dark ? DT.c.ink : '#fff'),
  }}>
    {back && (
      <button style={{
        width: 38, height: 38, borderRadius: 12,
        background: dark ? 'rgba(255,255,255,0.08)' : DT.c.surfaceAlt,
        border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="arrowL" size={18} color={dark ? '#fff' : DT.c.ink} />
      </button>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      {title && <div style={{ fontSize: 17, fontWeight: 800, color: dark ? '#fff' : DT.c.ink, letterSpacing: -0.3 }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 11.5, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.55)' : DT.c.faint, marginTop: 1 }}>{subtitle}</div>}
    </div>
    {right}
  </div>
);

// Bottom tab bar (app shell)
const TabBar = ({ active = 'home' }) => {
  const items = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'groups', icon: 'users', label: 'Groups' },
    { id: 'create', icon: 'plus', label: 'Create', big: true },
    { id: 'deals', icon: 'tag', label: 'Deals' },
    { id: 'profile', icon: 'verified', label: 'Profile' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      padding: '12px 20px 30px',
      background: 'rgba(251,248,242,0.92)',
      backdropFilter: 'blur(24px)',
      borderTop: `1px solid ${DT.c.line}`,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    }}>
      {items.map(it => (
        it.big ? (
          <button key={it.id} style={{
            width: 52, height: 52, borderRadius: 16,
            background: DT.c.primary,
            color: '#fff', border: 'none', boxShadow: DT.s.glow,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            transform: 'translateY(-8px)',
          }}>
            <Icon name="plus" size={22} stroke={2.2} />
          </button>
        ) : (
          <button key={it.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            background: 'transparent', border: 'none', padding: '4px 6px',
            color: active === it.id ? DT.c.ink : DT.c.faint,
          }}>
            <Icon name={it.icon} size={20} stroke={active === it.id ? 2 : 1.6}
              color={active === it.id ? DT.c.ink : DT.c.faint} />
            <span style={{
              fontSize: 9.5, fontWeight: 600, letterSpacing: 0.7,
              textTransform: 'uppercase',
              color: active === it.id ? DT.c.ink : DT.c.faint,
              fontFamily: DT.f.sans,
            }}>{it.label}</span>
          </button>
        )
      ))}
    </div>
  );
};

// Search-bar styled to brand
const SearchBar = ({ placeholder = 'Search groups, products, vendors', value, compact }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    background: DT.c.surfaceWarm, borderRadius: 14,
    padding: compact ? '11px 14px' : '14px 16px',
    border: `1px solid ${DT.c.line}`,
  }}>
    <Icon name="search" size={17} color={DT.c.muted} stroke={1.8} />
    <span style={{ flex: 1, fontSize: 13, fontWeight: 400, color: value ? DT.c.ink : DT.c.muted, fontFamily: DT.f.sans }}>
      {value || placeholder}
    </span>
    <div style={{
      width: 1, height: 18, background: DT.c.line,
    }}/>
    <Icon name="filter" size={15} color={DT.c.muted} stroke={1.8} />
  </div>
);

// Display helper — kept as plain inline span so existing usages still resolve
// (no italic, no serif — clean professional sans)
const Serif = ({ children, style }) => (
  <span style={{ ...style }}>{children}</span>
);

// Refined product silhouette — replaces big emoji glyphs in cards
const ProductGlyph = ({ kind = 'phone', size = 60, tone = DT.c.muted }) => {
  const glyphs = {
    phone:    <><rect x="22" y="8" width="36" height="64" rx="5" fill="none" stroke={tone} strokeWidth="1.6"/><rect x="26" y="14" width="28" height="50" rx="2" fill={tone} fillOpacity="0.08"/><circle cx="40" cy="68" r="1.5" fill={tone}/></>,
    laptop:   <><rect x="12" y="18" width="56" height="38" rx="3" fill="none" stroke={tone} strokeWidth="1.6"/><rect x="16" y="22" width="48" height="30" rx="1" fill={tone} fillOpacity="0.08"/><path d="M6 60h68l-4 6H10z" fill="none" stroke={tone} strokeWidth="1.6"/></>,
    car:      <><path d="M14 48 L20 32 H60 L66 48" fill="none" stroke={tone} strokeWidth="1.6" strokeLinejoin="round"/><rect x="10" y="46" width="60" height="14" rx="3" fill={tone} fillOpacity="0.08" stroke={tone} strokeWidth="1.6"/><circle cx="22" cy="60" r="5" fill={tone}/><circle cx="58" cy="60" r="5" fill={tone}/></>,
    home:     <><path d="M12 38 L40 14 L68 38 V66 H12 Z" fill={tone} fillOpacity="0.08" stroke={tone} strokeWidth="1.6" strokeLinejoin="round"/><rect x="34" y="48" width="12" height="18" fill="none" stroke={tone} strokeWidth="1.6"/></>,
    bike:     <><circle cx="20" cy="54" r="10" fill="none" stroke={tone} strokeWidth="1.6"/><circle cx="60" cy="54" r="10" fill="none" stroke={tone} strokeWidth="1.6"/><path d="M20 54 L34 30 L52 30 L60 54 M34 30 L46 54" fill="none" stroke={tone} strokeWidth="1.6"/></>,
    fridge:   <><rect x="22" y="10" width="36" height="60" rx="3" fill="none" stroke={tone} strokeWidth="1.6"/><line x1="22" y1="32" x2="58" y2="32" stroke={tone} strokeWidth="1.6"/><line x1="30" y1="22" x2="30" y2="26" stroke={tone} strokeWidth="2"/><line x1="30" y1="42" x2="30" y2="46" stroke={tone} strokeWidth="2"/></>,
    game:     <><rect x="10" y="22" width="60" height="36" rx="10" fill={tone} fillOpacity="0.08" stroke={tone} strokeWidth="1.6"/><circle cx="24" cy="40" r="5" fill={tone}/><circle cx="56" cy="40" r="5" fill="none" stroke={tone} strokeWidth="1.6"/></>,
    cart:     <><path d="M10 14 H20 L28 50 H62 L70 22 H24" fill="none" stroke={tone} strokeWidth="1.6" strokeLinejoin="round"/><circle cx="32" cy="62" r="4" fill={tone}/><circle cx="58" cy="62" r="4" fill={tone}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: 'block' }}>
      {glyphs[kind] || glyphs.phone}
    </svg>
  );
};

Object.assign(window, {
  Icon, PhoneShell, Status,
  Avatar, AvatarStack, Progress, Chip, Card, Btn,
  ScreenHeader, TabBar, SearchBar, Serif, ProductGlyph,
});
