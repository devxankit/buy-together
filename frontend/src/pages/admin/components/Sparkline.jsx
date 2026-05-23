// Dependency-free SVG sparkline with a soft area fill. Width is fluid (viewBox).
const Sparkline = ({ data = [], color = '#0D9488', height = 36, fill = true, strokeWidth = 2 }) => {
  if (!data.length) return null;
  const W = 100, H = 100;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = W / (data.length - 1 || 1);
  const pts = data.map((v, i) => [i * step, H - ((v - min) / range) * (H - 12) - 6]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${W},${H} L0,${H} Z`;
  const gid = `spark-${color.replace('#', '')}-${data.length}-${Math.round(data[0])}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

export default Sparkline;
