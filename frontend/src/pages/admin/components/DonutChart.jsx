import { T } from '../theme/adminTheme';

// SVG donut with centred total + legend. data: [{ label, value, color }]
const DonutChart = ({ data = [], size = 168, thickness = 22, centerLabel = 'Total', unit = '%' }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  // Pre-compute each arc's dash length + start offset purely (no render-time mutation).
  const arcs = data.map((d, i) => ({
    color: d.color,
    dash: (d.value / total) * C,
    offset: data.slice(0, i).reduce((s, x) => s + (x.value / total) * C, 0),
  }));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.lineSoft} strokeWidth={thickness} />
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={a.color} strokeWidth={thickness}
              strokeDasharray={`${a.dash} ${C - a.dash}`}
              strokeDashoffset={-a.offset}
              strokeLinecap="butt"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          ))}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="font-mono-num" style={{ fontSize: 26, fontWeight: 800, color: T.ink, lineHeight: 1 }}>{total}{unit}</span>
          <span style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginTop: 2 }}>{centerLabel}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, flex: 1, minWidth: 130 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: T.inkSoft, fontWeight: 500, flex: 1 }}>{d.label}</span>
            <span className="font-mono-num" style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{d.value}{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
