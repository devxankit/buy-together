import { c } from '../../design/tokens';

const Progress = ({ value, total, height = 6, color }) => {
  const pct = Math.min(100, (value / total) * 100);
  return (
    <div style={{
      height, borderRadius: 99, background: c.surfaceDeep, overflow: 'hidden', flex: 1,
    }}>
      <div style={{
        width: `${pct}%`, height: '100%', borderRadius: 99,
        background: color || `linear-gradient(90deg, ${c.primaryDeep}, ${c.primary})`,
        transition: 'width 0.6s ease',
      }} />
    </div>
  );
};

export default Progress;
