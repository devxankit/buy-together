import { useState } from 'react';

// Initials avatar with a deterministic / passed brand colour.
const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

const Avatar = ({ name, src, color = '#0D9488', size = 36, square = false }) => {
  const [broken, setBroken] = useState(false);
  const borderRadius = square ? size * 0.28 : 999;

  if (src && !broken) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setBroken(true)}
        style={{
          width: size,
          height: size,
          borderRadius,
          objectFit: 'cover',
          display: 'block',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <span style={{
      width: size, height: size, flexShrink: 0,
      borderRadius,
      background: color, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38, letterSpacing: '-0.02em',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
    }}>
      {initials(name)}
    </span>
  );
};

export default Avatar;
