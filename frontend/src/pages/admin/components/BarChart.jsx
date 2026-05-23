import { useState } from 'react';
import { T } from '../theme/adminTheme';

// Lightweight responsive bar/column chart. data: [{ label, value }]
const BarChart = ({ data = [], color = T.primary, height = 220, unit = '' }) => {
  const [hover, setHover] = useState(null);
  const max = Math.max(...data.map(d => d.value), 1);
  const ticks = 4;

  return (
    <div style={{ position: 'relative', paddingTop: 8 }}>
      {/* gridlines + y labels */}
      <div style={{ position: 'relative', height }}>
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const val = Math.round((max / ticks) * (ticks - i));
          const top = (height / ticks) * i;
          return (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, top }}>
              <div style={{ borderTop: `1px dashed ${T.lineSoft}`, marginLeft: 34 }} />
              <span style={{ position: 'absolute', left: 0, top: -7, fontSize: 10.5, color: T.faint, fontWeight: 600 }} className="font-mono-num">{val}</span>
            </div>
          );
        })}

        {/* bars */}
        <div style={{ position: 'absolute', inset: 0, marginLeft: 34, display: 'flex', alignItems: 'flex-end', gap: 'min(2%, 10px)' }}>
          {data.map((d, i) => {
            const h = (d.value / max) * 100;
            const active = hover === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', cursor: 'default' }}
              >
                {active && (
                  <div style={{
                    position: 'absolute', bottom: `calc(${h}% + 8px)`, background: T.ink, color: '#fff',
                    fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 7, whiteSpace: 'nowrap', zIndex: 2,
                    boxShadow: T.shadowMd,
                  }} className="font-mono-num">{unit}{d.value}</div>
                )}
                <div
                  style={{
                    width: '78%', maxWidth: 30, height: `${h}%`,
                    background: active ? color : `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
                    opacity: active ? 1 : 0.88,
                    borderRadius: '6px 6px 3px 3px',
                    transformOrigin: 'bottom',
                    animation: `admin-bar-grow 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 40}ms both`,
                    transition: 'opacity 0.15s ease',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* x labels */}
      <div style={{ display: 'flex', gap: 'min(2%, 10px)', marginLeft: 34, marginTop: 8 }}>
        {data.map((d, i) => (
          <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10.5, color: T.muted, fontWeight: 600 }}>{d.label || d.m}</span>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
