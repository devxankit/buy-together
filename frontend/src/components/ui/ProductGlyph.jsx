import { c } from '../../design/tokens';

const ProductGlyph = ({ kind = 'phone', size = 60, tone }) => {
  const t = tone || c.muted;
  const glyphs = {
    phone:  <><rect x="22" y="8" width="36" height="64" rx="5" fill="none" stroke={t} strokeWidth="1.6"/><rect x="26" y="14" width="28" height="50" rx="2" fill={t} fillOpacity="0.08"/><circle cx="40" cy="68" r="1.5" fill={t}/></>,
    laptop: <><rect x="12" y="18" width="56" height="38" rx="3" fill="none" stroke={t} strokeWidth="1.6"/><rect x="16" y="22" width="48" height="30" rx="1" fill={t} fillOpacity="0.08"/><path d="M6 60h68l-4 6H10z" fill="none" stroke={t} strokeWidth="1.6"/></>,
    car:    <><path d="M14 48 L20 32 H60 L66 48" fill="none" stroke={t} strokeWidth="1.6" strokeLinejoin="round"/><rect x="10" y="46" width="60" height="14" rx="3" fill={t} fillOpacity="0.08" stroke={t} strokeWidth="1.6"/><circle cx="22" cy="60" r="5" fill={t}/><circle cx="58" cy="60" r="5" fill={t}/></>,
    home:   <><path d="M12 38 L40 14 L68 38 V66 H12 Z" fill={t} fillOpacity="0.08" stroke={t} strokeWidth="1.6" strokeLinejoin="round"/><rect x="34" y="48" width="12" height="18" fill="none" stroke={t} strokeWidth="1.6"/></>,
    bike:   <><circle cx="20" cy="54" r="10" fill="none" stroke={t} strokeWidth="1.6"/><circle cx="60" cy="54" r="10" fill="none" stroke={t} strokeWidth="1.6"/><path d="M20 54 L34 30 L52 30 L60 54 M34 30 L46 54" fill="none" stroke={t} strokeWidth="1.6"/></>,
    fridge: <><rect x="22" y="10" width="36" height="60" rx="3" fill="none" stroke={t} strokeWidth="1.6"/><line x1="22" y1="32" x2="58" y2="32" stroke={t} strokeWidth="1.6"/><line x1="30" y1="22" x2="30" y2="26" stroke={t} strokeWidth="2"/><line x1="30" y1="42" x2="30" y2="46" stroke={t} strokeWidth="2"/></>,
    game:   <><rect x="10" y="22" width="60" height="36" rx="10" fill={t} fillOpacity="0.08" stroke={t} strokeWidth="1.6"/><circle cx="24" cy="40" r="5" fill={t}/><circle cx="56" cy="40" r="5" fill="none" stroke={t} strokeWidth="1.6"/></>,
    cart:   <><path d="M10 14 H20 L28 50 H62 L70 22 H24" fill="none" stroke={t} strokeWidth="1.6" strokeLinejoin="round"/><circle cx="32" cy="62" r="4" fill={t}/><circle cx="58" cy="62" r="4" fill={t}/></>,
    tv:     <><rect x="10" y="14" width="60" height="42" rx="4" fill={t} fillOpacity="0.08" stroke={t} strokeWidth="1.6"/><path d="M28 56h24M40 56v10" stroke={t} strokeWidth="1.6"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: 'block', flexShrink: 0 }}>
      {glyphs[kind] || glyphs.phone}
    </svg>
  );
};

export default ProductGlyph;
