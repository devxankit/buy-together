import * as Icons from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import Sparkline from './Sparkline';

const ACCENTS = {
  primary: { fg: T.primary, soft: T.primarySoft },
  violet:  { fg: T.violet,  soft: T.violetSoft },
  info:    { fg: T.info,    soft: T.infoSoft },
  amber:   { fg: T.amber,   soft: T.amberSoft },
  danger:  { fg: T.danger,  soft: T.dangerSoft },
};

const fmt = (v) => {
  if (typeof v !== 'number') return v;
  if (v >= 1000) return v.toLocaleString('en-IN');
  return v % 1 === 0 ? v : v.toFixed(2);
};

const StatCard = ({ label, value, prefix = '', suffix = '', delta, trend = 'up', spark, icon, accent = 'primary', index = 0 }) => {
  const a = ACCENTS[accent] || ACCENTS.primary;
  const Icon = (icon && Icons[icon]) || Icons.Activity;
  const up = trend === 'up';
  const TrendIcon = up ? ArrowUpRight : ArrowDownRight;
  const trendColor = up ? T.success : T.danger;

  return (
    <div
      className="admin-card-hover admin-fade-up"
      style={{
        background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius['2xl'],
        boxShadow: T.shadowSm, padding: 18, position: 'relative', overflow: 'hidden',
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: radius.lg, background: a.soft, color: a.fg,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} strokeWidth={2.1} />
        </div>
        {delta != null && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            color: trendColor, background: up ? T.successSoft : T.dangerSoft,
            padding: '3px 7px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
          }}>
            <TrendIcon size={13} strokeWidth={2.6} />{Math.abs(delta)}%
          </span>
        )}
      </div>

      <p style={{ margin: '16px 0 4px', fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: '0.01em' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        {prefix && <span style={{ fontSize: 20, fontWeight: 700, color: T.ink }}>{prefix}</span>}
        <span className="font-mono-num" style={{ fontSize: 27, fontWeight: 800, color: T.ink, letterSpacing: '-0.03em', lineHeight: 1 }}>{fmt(value)}</span>
        {suffix && <span style={{ fontSize: 15, fontWeight: 700, color: T.inkSoft, marginLeft: 2 }}>{suffix}</span>}
      </div>

      {spark && <div style={{ marginTop: 14, marginInline: -2 }}><Sparkline data={spark} color={a.fg} height={34} /></div>}
    </div>
  );
};

export default StatCard;
