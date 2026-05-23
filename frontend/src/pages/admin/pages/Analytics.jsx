import { TrendingUp, MapPin, Activity, Users } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, BarChart, DonutChart, Button, Sparkline } from '../components';
import { revenueSeries, categoryDemand, heatmap, heatmapRegions, heatmapCategories } from '../data/mockData';

// Intensity → teal cell. 0..100
const heatColor = (v) => {
  const a = 0.08 + (v / 100) * 0.92;
  return `rgba(13,148,136,${a.toFixed(2)})`;
};

const mini = [
  { label: 'Demand Index',  value: '142.6', delta: '+9.2%', spark: [20,28,24,34,40,38,52,60], icon: Activity, color: T.primary },
  { label: 'Conversion',    value: '38.4%', delta: '+3.1%', spark: [30,32,31,35,34,37,38,40], icon: TrendingUp, color: T.violet },
  { label: 'Avg Group Fill', value: '71%',  delta: '+5.0%', spark: [50,55,58,60,64,66,69,71], icon: Users, color: T.info },
  { label: 'Active Regions', value: '24',   delta: '+2',    spark: [18,19,20,20,21,22,23,24], icon: MapPin, color: T.amber },
];

const topRegions = [
  { region: 'Indore',    demand: 92, growth: '+14%' },
  { region: 'Mumbai',    demand: 88, growth: '+9%' },
  { region: 'Pune',      demand: 85, growth: '+11%' },
  { region: 'Surat',     demand: 80, growth: '+18%' },
  { region: 'Hyderabad', demand: 70, growth: '+6%' },
];

const Analytics = () => (
  <>
    <PageHeader
      eyebrow="Intelligence"
      title="Analytics"
      subtitle="Demand intelligence across categories and regions — the data layer that powers vendor targeting."
    >
      <Button variant="soft" icon="Calendar">Last 12 months</Button>
      <Button variant="dark" icon="Download">Export Report</Button>
    </PageHeader>

    {/* Mini metrics */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 18 }}>
      {mini.map((m, i) => (
        <div key={i} className="admin-card-hover" style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius['2xl'], padding: 18, boxShadow: T.shadowSm }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: `${m.color}14`, color: m.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <m.icon size={18} strokeWidth={2.2} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.success }}>{m.delta}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 }}>
            <div>
              <div className="font-mono-num" style={{ fontSize: 24, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em' }}>{m.value}</div>
              <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginTop: 2 }}>{m.label}</div>
            </div>
            <div style={{ width: 70 }}><Sparkline data={m.spark} color={m.color} height={30} /></div>
          </div>
        </div>
      ))}
    </div>

    {/* Heatmap + donut */}
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 18, marginBottom: 18 }} className="admin-grid-2">
      <Panel title="Demand Heatmap" subtitle="Region × category intent intensity">
        <div style={{ overflowX: 'auto' }} className="admin-scroll">
          <div style={{ minWidth: 460 }}>
            {/* header */}
            <div style={{ display: 'grid', gridTemplateColumns: `90px repeat(${heatmapCategories.length}, 1fr)`, gap: 6, marginBottom: 6 }}>
              <div />
              {heatmapCategories.map(c => (
                <div key={c} style={{ fontSize: 11, fontWeight: 700, color: T.muted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{c}</div>
              ))}
            </div>
            {heatmap.map((row, ri) => (
              <div key={ri} style={{ display: 'grid', gridTemplateColumns: `90px repeat(${heatmapCategories.length}, 1fr)`, gap: 6, marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft, display: 'flex', alignItems: 'center' }}>{heatmapRegions[ri]}</div>
                {row.map((v, ci) => (
                  <div
                    key={ci}
                    title={`${heatmapRegions[ri]} · ${heatmapCategories[ci]} — ${v}`}
                    className="font-mono-num"
                    style={{
                      height: 42, borderRadius: 9, background: heatColor(v),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: v > 55 ? '#fff' : T.inkSoft,
                      cursor: 'default', transition: 'transform 0.12s ease',
                    }}
                  >{v}</div>
                ))}
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 11, color: T.faint, fontWeight: 600 }}>Low</span>
              <div style={{ width: 120, height: 8, borderRadius: 99, background: `linear-gradient(90deg, ${heatColor(5)}, ${heatColor(100)})` }} />
              <span style={{ fontSize: 11, color: T.faint, fontWeight: 600 }}>High</span>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Category Mix" subtitle="Demand distribution">
        <DonutChart data={categoryDemand} />
      </Panel>
    </div>

    {/* Trend + top regions */}
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 18 }} className="admin-grid-2">
      <Panel title="Demand Trend" subtitle="Aggregate group activity · monthly index">
        <BarChart data={revenueSeries} color={T.violet} height={220} />
      </Panel>

      <Panel title="Top Regions" subtitle="By demand index">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {topRegions.map((r, i) => (
            <div key={r.region}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={14} color={T.primary} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{r.region}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: T.success }}>{r.growth}</span>
                  <span className="font-mono-num" style={{ fontSize: 13, fontWeight: 700, color: T.ink, width: 26, textAlign: 'right' }}>{r.demand}</span>
                </div>
              </div>
              <div style={{ height: 7, borderRadius: 99, background: T.lineSoft, overflow: 'hidden' }}>
                <div style={{ width: `${r.demand}%`, height: '100%', background: `linear-gradient(90deg, ${T.primaryDeep}, ${T.primary})`, borderRadius: 99, animation: `admin-bar-grow 0.6s ease ${i * 60}ms both`, transformOrigin: 'left' }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  </>
);

export default Analytics;
