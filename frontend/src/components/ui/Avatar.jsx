import { c } from '../../design/tokens';

const INITIALS = ['RK','SN','PJ','AM','VS','MK','TR','NB','DG','KP','HS','LM'];
const GRADIENTS = [
  ['#2C4A40','#1A5D4F'],
  ['#3A4458','#2C3548'],
  ['#7A4E3A','#5C3825'],
  ['#2C5680','#1F4264'],
  ['#3D3D45','#26262C'],
  ['#5C6E5A','#445046'],
  ['#4A3A55','#332842'],
  ['#6B5945','#4D4032'],
];

export const Avatar = ({ seed = 1, size = 28, ring = false, name }) => {
  const idx = seed % GRADIENTS.length;
  const [g1, g2] = GRADIENTS[idx];
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : INITIALS[seed % INITIALS.length];

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${g1}, ${g2})`,
      boxShadow: ring ? `0 0 0 2px ${c.surfaceAlt}` : 'none',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 600, fontSize: size * 0.36, flexShrink: 0,
      letterSpacing: 0.2,
    }}>
      {initials}
    </div>
  );
};

export const AvatarStack = ({ count = 3, more, size = 24 }) => (
  <div style={{ display: 'flex' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ marginLeft: i ? -size * 0.35 : 0, boxShadow: '0 0 0 2px #fff', borderRadius: '50%' }}>
        <Avatar seed={i + 2} size={size} />
      </div>
    ))}
    {more != null && (
      <div style={{
        marginLeft: -size * 0.35, width: size, height: size, borderRadius: '50%',
        background: c.ink, color: '#fff', fontSize: size * 0.35, fontWeight: 800,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 2px #fff',
      }}>+{more}</div>
    )}
  </div>
);
