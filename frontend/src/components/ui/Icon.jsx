const paths = {
  search:      <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  menu:        <><path d="M3 6h18M3 12h18M3 18h18"/></>,
  bell:        <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  users:       <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  home:        <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></>,
  flame:       <><path d="M12 2c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3 1-5-1-7 2-9Z"/></>,
  plus:        <><path d="M12 5v14M5 12h14"/></>,
  arrowR:      <><path d="M5 12h14M13 5l7 7-7 7"/></>,
  arrowL:      <><path d="M19 12H5M11 5l-7 7 7 7"/></>,
  chevR:       <><path d="m9 6 6 6-6 6"/></>,
  chevD:       <><path d="m6 9 6 6 6-6"/></>,
  chevU:       <><path d="m6 15 6-6 6 6"/></>,
  check:       <><path d="m5 12 5 5L20 7"/></>,
  checkCircle: <><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-5"/></>,
  x:           <><path d="M18 6 6 18M6 6l12 12"/></>,
  heart:       <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></>,
  star:        <><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2Z"/></>,
  bag:         <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
  settings:    <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></>,
  log:         <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>,
  send:        <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  mic:         <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3"/></>,
  image:       <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></>,
  poll:        <><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="13" y="8" width="3" height="10"/></>,
  target:      <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  bolt:        <><path d="M13 2 3 14h7v8l10-12h-7Z"/></>,
  shield:      <><path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6Z"/><path d="m9 12 2 2 4-4"/></>,
  tag:         <><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"/><circle cx="7" cy="7" r="1.5"/></>,
  edit:        <><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></>,
  phone:       <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></>,
  lock:        <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  sparkle:     <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></>,
  trending:    <><path d="m22 7-9.5 9.5-5-5L2 17"/><path d="M16 7h6v6"/></>,
  filter:      <><path d="M22 3H2l8 9.46V19l4 2v-8.54Z"/></>,
  clock:       <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
  rupee:       <><path d="M6 3h12M6 8h12M9 13c5 0 6-5 1-5"/><path d="m9 13 7 8M6 13h3"/></>,
  eye:         <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  pin:         <><path d="M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12Z"/><circle cx="12" cy="10" r="3"/></>,
  verified:    <><path d="m9 12 2 2 4-4"/><path d="M12 2 9.5 4.3 6.2 4 5 7.2 2 9l1.5 3L2 15l3 1.8 1.2 3.2 3.3-.3L12 22l2.5-2.3 3.3.3 1.2-3.2L22 15l-1.5-3L22 9l-3-1.8L17.8 4l-3.3.3Z"/></>,
  grid:        <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  chat:        <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></>,
  award:       <><circle cx="12" cy="8" r="6"/><path d="M9 13.5 7 22l5-3 5 3-2-8.5"/></>,
  share:       <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></>,
  bookmark:    <><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></>,
  info:        <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></>,
  qr:          <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></>,
};

const Icon = ({ name, size = 20, color = 'currentColor', stroke = 2, fill = 'none' }) => {
  const isFilled = fill && fill !== 'none';
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={isFilled ? fill : 'none'} stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {paths[name] || null}
    </svg>
  );
};

export default Icon;
