// Design System showcase — Heritage Modern (premium)

const DSCard = ({ title, kicker, children, style }) => (
  <div style={{
    background: DT.c.surfaceWarm, borderRadius: 22, padding: 26,
    border: `1px solid ${DT.c.line}`,
    display: 'flex', flexDirection: 'column', gap: 16,
    ...style,
  }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', color: DT.c.muted, fontFamily: DT.f.sans }}>{title}</div>
      {kicker && <div style={{ fontSize: 10.5, color: DT.c.faint, fontFamily: DT.f.mono }}>{kicker}</div>}
    </div>
    {children}
  </div>
);

const Swatch = ({ name, hex, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{
      height: 90, borderRadius: 14, background: hex,
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
    }} />
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: DT.c.ink, letterSpacing: -0.2 }}>{name}</div>
      <div style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.faint, fontFamily: DT.f.mono, marginTop: 1 }}>{hex}</div>
      {label && <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, marginTop: 4 }}>{label}</div>}
    </div>
  </div>
);

const DesignSystem = () => (
  <div style={{
    width: 1640, padding: 40, background: DT.c.surfaceAlt,
    borderRadius: 32, border: `1px solid ${DT.c.line}`,
    fontFamily: DT.f.sans, color: DT.c.ink,
    display: 'flex', flexDirection: 'column', gap: 26,
  }}>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: DT.c.primary,
            boxShadow: DT.s.glow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="users" size={20} color="#fff" stroke={2}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: DT.c.muted, letterSpacing: 2.4, textTransform: 'uppercase' }}>Buy Together · Design System v2</div>
            <div style={{ fontSize: 12, color: DT.c.faint, fontFamily: DT.f.mono, marginTop: 2 }}>heritage-modern · emerald · ivory</div>
          </div>
        </div>
        <div style={{ fontSize: 80, lineHeight: 0.98, letterSpacing: -3, color: DT.c.ink, fontWeight: 500 }}>
          Buy <Serif style={{ color: DT.c.primary }}>together,</Serif>
          <br />save together.
        </div>
        <div style={{ fontSize: 16, fontWeight: 400, color: DT.c.muted, marginTop: 18, maxWidth: 660, lineHeight: 1.55 }}>
          A demand-aggregation app where individual buyers become buying groups. The system trades bright candy colour for a warm-ivory canvas, deep emerald for trust and savings, and an italic serif voice that lets the brand whisper instead of shout.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="dark" size="lg" icon={<Icon name="sparkle" size={16} color="#fff" stroke={1.8}/>}>Use system</Btn>
          <Btn variant="soft" size="lg">Inspect tokens</Btn>
        </div>
        <div style={{
          padding: '10px 14px', borderRadius: 10, background: DT.c.surfaceWarm,
          border: `1px solid ${DT.c.line}`, fontSize: 11, color: DT.c.muted,
          fontFamily: DT.f.mono,
        }}>v2.0 · updated · 14 May 2026</div>
      </div>
    </div>

    {/* Color */}
    <DSCard title="01 · Colour" kicker="12 tokens · 4 semantic">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18 }}>
        <Swatch name="Emerald · Primary" hex={DT.c.primary} label="CTA · savings · trust" />
        <Swatch name="Emerald · Deep" hex={DT.c.primaryDeep} label="Active · pressed" />
        <Swatch name="Emerald · Soft" hex={DT.c.primarySoft} label="Tinted surfaces" />
        <Swatch name="Terracotta · Accent" hex={DT.c.accent} label="Urgency · sparingly" />
        <Swatch name="Champagne · Gold" hex={DT.c.gold} label="Verified · featured" />
        <Swatch name="Navy · Info" hex={DT.c.info} label="Vendor badges" />
        <Swatch name="Ink" hex={DT.c.ink} label="Headlines · anchors" />
        <Swatch name="Muted" hex={DT.c.muted} label="Body text" />
        <Swatch name="Faint" hex={DT.c.faint} label="Captions · meta" />
        <Swatch name="Ivory · Canvas" hex={DT.c.surfaceAlt} label="App background" />
        <Swatch name="Cream · Surface" hex={DT.c.surfaceWarm} label="Cards" />
        <Swatch name="Line" hex={DT.c.line} label="Borders · dividers" />
      </div>
    </DSCard>

    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr 1fr', gap: 24 }}>
      {/* Type */}
      <DSCard title="02 · Typography" kicker="instrument serif · geist · geist mono">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <div style={{ fontSize: 10, color: DT.c.faint, fontWeight: 500, fontFamily: DT.f.mono, marginBottom: 8 }}>DISPLAY · serif italic · 64</div>
            <div style={{ fontSize: 56, lineHeight: 0.96, letterSpacing: -2, color: DT.c.ink, fontWeight: 500 }}>
              Save <Serif style={{ color: DT.c.primary }}>twenty-two</Serif>
              <br />percent. Together.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: DT.c.faint, fontWeight: 500, fontFamily: DT.f.mono, marginBottom: 6 }}>H2 · Geist 500 · 26</div>
            <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6 }}>iPhone 16 Pro · 256GB</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: DT.c.faint, fontWeight: 500, fontFamily: DT.f.mono, marginBottom: 6 }}>BODY · Geist 400 · 14.5</div>
            <div style={{ fontSize: 14.5, fontWeight: 400, color: DT.c.muted, lineHeight: 1.55 }}>
              Seven of ten buyers in. The group locks in thirty-six hours; the vendor releases the deal the moment the target hits.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <div>
              <div style={{ fontSize: 10, color: DT.c.faint, fontWeight: 500, fontFamily: DT.f.mono, marginBottom: 6 }}>NUMERIC · Geist Mono</div>
              <div style={{ fontSize: 28, fontWeight: 500, color: DT.c.ink, fontFamily: DT.f.mono, letterSpacing: -1 }}>₹1,19,900</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: DT.c.faint, fontWeight: 500, fontFamily: DT.f.mono, marginBottom: 6 }}>EYEBROW</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.muted, textTransform: 'uppercase', letterSpacing: 2 }}>Most popular · 3 left</div>
            </div>
          </div>
        </div>
      </DSCard>

      {/* Buttons */}
      <DSCard title="03 · Buttons & inputs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn variant="primary" size="lg" full iconRight={<Icon name="arrowR" size={16} color="#fff" stroke={2}/>}>Join group · 3 left</Btn>
          <Btn variant="dark" size="md" full>Confirm payment</Btn>
          <Btn variant="soft" size="md" full icon={<Icon name="users" size={15} color={DT.c.ink} stroke={1.8}/>}>Invite friends</Btn>
          <Btn variant="accent" size="md" full>Closing soon · join</Btn>
        </div>

        <div style={{ height: 1, background: DT.c.line, margin: '6px 0' }}/>

        <div>
          <div style={{ fontSize: 10, color: DT.c.faint, fontWeight: 500, fontFamily: DT.f.mono, marginBottom: 8 }}>FOCUSED INPUT</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: DT.c.surface, border: `1.5px solid ${DT.c.primary}`,
            borderRadius: 12, padding: '13px 14px',
            boxShadow: `0 0 0 4px ${DT.c.primaryGlow}`,
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: DT.c.ink, fontFamily: DT.f.mono }}>+91</span>
            <div style={{ height: 18, width: 1, background: DT.c.line }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: DT.c.ink, fontFamily: DT.f.mono, letterSpacing: 1 }}>98765 43210</span>
            <span style={{ flex: 1 }} />
            <Icon name="check" size={16} color={DT.c.primary} stroke={2.4}/>
          </div>
        </div>
      </DSCard>

      {/* Chips & badges */}
      <DSCard title="04 · Tags, badges & momentum">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <Chip tone="primary">Most popular</Chip>
          <Chip tone="ink">3 spots left</Chip>
          <Chip tone="saving">↓ 18% savings</Chip>
          <Chip tone="info">Vendor verified</Chip>
          <Chip tone="accent">Closing · 4 h</Chip>
          <Chip tone="gold">Featured</Chip>
          <Chip tone="outline">Electronics</Chip>
        </div>

        <div style={{ height: 1, background: DT.c.line }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <AvatarStack count={4} more={6} size={34} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.2 }}>10 joined</div>
            <div style={{ fontSize: 11.5, fontWeight: 400, color: DT.c.muted }}>+6 from your locality</div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: DT.c.muted, letterSpacing: 1.4, textTransform: 'uppercase' }}>7 of 10 joined</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: DT.c.primary, fontFamily: DT.f.mono }}>−₹10,000</span>
          </div>
          <Progress value={7} total={10} height={6} />
        </div>
      </DSCard>
    </div>

    {/* Component sampler row */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
      {/* Group card */}
      <DSCard title="05 · Group card · dark" style={{ padding: 0, overflow: 'hidden', background: 'transparent', border: 'none' }}>
        <div style={{
          borderRadius: 22, overflow: 'hidden', background: DT.c.surfaceInk,
          color: '#fff', padding: 24, position: 'relative',
          border: `1px solid ${DT.c.line}`,
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 0%, rgba(26,93,79,0.35), transparent 55%)' }}/>
          <div style={{ position: 'relative' }}>
            <Chip tone="gold" size="xs">Featured</Chip>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Apple · Smartphone</div>
              <div style={{ fontSize: 24, fontWeight: 500, marginTop: 4, letterSpacing: -0.6 }}>
                iPhone 16 Pro <Serif style={{ color: DT.c.gold }}>256GB</Serif>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 18 }}>
              <span style={{ fontSize: 30, fontWeight: 500, letterSpacing: -1, fontFamily: DT.f.mono }}>₹1,19,900</span>
              <span style={{ fontSize: 13, textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)', fontFamily: DT.f.mono }}>₹1,29,900</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, alignItems: 'center' }}>
              <AvatarStack count={3} more={4} size={26} />
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)', fontFamily: DT.f.mono }}>7 / 10</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', background: DT.c.primary, borderRadius: 99 }}/>
              </div>
            </div>
          </div>
        </div>
      </DSCard>

      {/* Big number / data */}
      <DSCard title="06 · Numeric display">
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.muted, letterSpacing: 1.4, textTransform: 'uppercase' }}>Total saved</div>
          <div style={{ fontSize: 56, lineHeight: 1, color: DT.c.ink, fontFamily: DT.f.mono, fontWeight: 500, letterSpacing: -2, marginTop: 6 }}>
            ₹24,820
          </div>
          <div style={{ fontSize: 13, fontWeight: 400, color: DT.c.muted, marginTop: 6 }}>
            across <span style={{ color: DT.c.primary, fontWeight: 500 }}>5 deals</span> · last 90 days
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 56, marginTop: 4 }}>
          {[24, 38, 30, 52, 44, 70, 58, 76, 60, 88, 72, 96].map((h, i) => (
            <div key={i} style={{
              flex: 1, height: `${h}%`, borderRadius: 2,
              background: i >= 9 ? DT.c.primary : (i >= 5 ? DT.c.primarySoft : DT.c.surfaceDeep),
            }}/>
          ))}
        </div>
      </DSCard>

      {/* Radii & shadow */}
      <DSCard title="07 · Form · radii · shadow">
        <div>
          <div style={{ fontSize: 10, color: DT.c.faint, fontWeight: 500, fontFamily: DT.f.mono, marginBottom: 8 }}>OTP — 6 digit</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[4,8,2,1,'',''].map((d,i) => (
              <div key={i} style={{
                flex: 1, height: 50, borderRadius: 12,
                background: d !== '' ? DT.c.surface : DT.c.surfaceWarm,
                border: `1.5px solid ${i === 4 ? DT.c.primary : (d !== '' ? DT.c.line : 'transparent')}`,
                boxShadow: i === 4 ? `0 0 0 4px ${DT.c.primaryGlow}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 500, color: DT.c.ink, fontFamily: DT.f.mono,
              }}>{d}</div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: DT.c.faint, fontWeight: 500, fontFamily: DT.f.mono, marginBottom: 10 }}>RADII · 8 / 12 / 18 / 28</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[8, 12, 18, 28].map(r => (
              <div key={r} style={{
                width: 52, height: 52, borderRadius: r,
                background: DT.c.surface, border: `1px solid ${DT.c.line}`,
              }}/>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: DT.c.faint, fontWeight: 500, fontFamily: DT.f.mono, marginBottom: 10 }}>SHADOWS</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[DT.s.sm, DT.s.md, DT.s.lg, DT.s.glow].map((sh, i) => (
              <div key={i} style={{
                width: 52, height: 52, borderRadius: 12,
                background: i === 3 ? DT.c.primary : DT.c.surface,
                boxShadow: sh,
              }}/>
            ))}
          </div>
        </div>
      </DSCard>
    </div>

    {/* Principles */}
    <div style={{
      background: DT.c.surfaceInk, color: '#fff', borderRadius: 24, padding: 38,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -100, top: -100, width: 460, height: 460, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,93,79,0.32), transparent 60%)',
      }}/>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.gold, letterSpacing: 2.4, textTransform: 'uppercase' }}>Five principles</div>
        <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: -1, marginTop: 12, lineHeight: 1.1 }}>
          A system <Serif style={{ color: DT.c.gold }}>that whispers,</Serif> not shouts.
        </div>
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 36 }}>
          {[
            { n: '01', t: 'Trust first', d: 'Verified vendor badges, OTP-only logins, audit trail on every deal.' },
            { n: '02', t: 'Visible momentum', d: 'Every group surfaces who joined, who is left, and how fast it is filling.' },
            { n: '03', t: 'One bold action', d: 'Each screen has a single emerald CTA. Everything else stays quiet.' },
            { n: '04', t: 'Warm, not loud', d: 'Ivory canvas, soft shadow, italic serif. Colour is a tool, not décor.' },
            { n: '05', t: 'Honest density', d: 'Group buying is data-rich. The type scale makes it scannable, not noisy.' },
          ].map(p => (
            <div key={p.n}>
              <div style={{ fontSize: 28, fontWeight: 500, color: DT.c.gold, fontFamily: DT.f.mono }}>{p.n}</div>
              <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3, marginTop: 8 }}>{p.t}</div>
              <div style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.55)', marginTop: 6, lineHeight: 1.55 }}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

window.DesignSystem = DesignSystem;
