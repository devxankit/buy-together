// Vendor screens: Dashboard, Create Offer

// ────────────────────────────────────────────────────────────────
// 1) VENDOR DASHBOARD
// ────────────────────────────────────────────────────────────────
const ScreenVendorDashboard = () => (
  <PhoneShell bg={DT.c.surfaceAlt}>
    <IOSStatusBar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 13,
            background: DT.c.ink, color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 14,
          }}>AS</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: DT.c.ink }}>Apple Studio</span>
              <Icon name="verified" size={13} color={DT.c.info} fill={DT.c.info} stroke={0}/>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.faint, textTransform: 'uppercase', letterSpacing: 0.6 }}>Vendor · Premium</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 38, height: 38, borderRadius: 12, background: '#fff', border: `1px solid ${DT.c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Icon name="bell" size={17} color={DT.c.ink} stroke={2.2}/>
            <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 8, fontWeight: 500, background: DT.c.primary, color: '#fff', padding: '1px 4px', borderRadius: 99 }}>4</span>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Earnings hero */}
        <div style={{
          background: DT.c.ink, color: '#fff', borderRadius: 24, padding: 22,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -40, top: -40, width: 220, height: 220, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,93,79,0.40), transparent 70%)',
          }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.2, textTransform: 'uppercase' }}>This month · GMV</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 38, fontWeight: 500, letterSpacing: -1.2 }}>₹18.4L</span>
              <Chip tone="saving" size="xs">↑ 32%</Chip>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>vs ₹13.9L last month · 142 deals</div>

            {/* Tiny chart */}
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-end', gap: 6, height: 50 }}>
              {[35, 48, 30, 62, 44, 70, 58, 78, 60, 88, 72, 96].map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`, borderRadius: 3,
                  background: i >= 10 ? DT.c.primary : (i >= 6 ? 'rgba(26,93,79,0.45)' : 'rgba(255,255,255,0.18)'),
                }}/>
              ))}
            </div>
          </div>
        </div>

        {/* Stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { v: '12', l: 'Active groups', t: DT.c.primary, bg: DT.c.primarySoft },
            { v: '438', l: 'Buyers in', t: DT.c.info, bg: DT.c.infoSoft },
            { v: '4.9', l: 'Rating', t: DT.c.saving, bg: DT.c.savingSoft },
          ].map((s, i) => (
            <div key={i} style={{
              background: DT.c.surfaceWarm, borderRadius: 16, padding: 14,
              border: `1px solid ${DT.c.line}`, boxShadow: DT.s.sm,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 9, background: s.bg, marginBottom: 8,
              }}/>
              <div style={{ fontSize: 20, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.4 }}>{s.v}</div>
              <div style={{ fontSize: 10, fontWeight: 500, color: DT.c.faint, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Active offers */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.2 }}>Live offers</span>
            <button style={{ background: DT.c.ink, color: '#fff', fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 99, border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name="plus" size={12} color="#fff" stroke={3}/> NEW
            </button>
          </div>

          {[
            { t: 'iPhone 16 Pro 256GB', p: '₹1,19,900', j: 7, total: 10, status: 'Filling', tone: DT.c.primary, time: '1d 13h' },
            { t: 'MacBook Air M4', p: '₹89,990', j: 10, total: 10, status: 'Locked · pending', tone: DT.c.saving, time: 'Action needed' },
            { t: 'iPad Pro 11"', p: '₹74,990', j: 3, total: 8, status: 'New', tone: DT.c.info, time: 'Just launched' },
          ].map((o, i) => (
            <div key={i} style={{
              background: DT.c.surfaceWarm, borderRadius: 18, padding: 14,
              border: `1px solid ${DT.c.line}`, boxShadow: DT.s.sm,
              marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: DT.c.surfaceAlt,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${DT.c.line}`,
              }}><ProductGlyph kind={i === 1 ? 'laptop' : 'phone'} size={28} tone={DT.c.inkSoft}/></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.2 }}>{o.t}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: DT.c.ink }}>{o.p}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <div style={{ flex: 1 }}><Progress value={o.j} total={o.total} height={4}/></div>
                  <span style={{ fontSize: 10, fontWeight: 500, color: DT.c.ink }}>{o.j}/{o.total}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: o.tone }}/>
                  <span style={{ fontSize: 10.5, fontWeight: 500, color: o.tone, letterSpacing: 0.4, textTransform: 'uppercase' }}>{o.status}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: DT.c.faint, marginLeft: 'auto' }}>{o.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demand heatmap */}
        <div style={{ background: DT.c.surfaceWarm, borderRadius: 18, padding: 16, border: `1px solid ${DT.c.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.2 }}>Demand by area</span>
            <span style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.faint, letterSpacing: 0.6 }}>LAST 7 DAYS</span>
          </div>
          {[
            { l: 'Lajpat Nagar', v: 86, c: 142 },
            { l: 'Saket', v: 64, c: 98 },
            { l: 'Gurgaon Sector 56', v: 52, c: 78 },
            { l: 'Noida 62', v: 38, c: 51 },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: DT.c.ink, width: 120 }}>{a.l}</span>
              <div style={{ flex: 1, height: 8, background: DT.c.line, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${a.v}%`, height: '100%',
                  background: `linear-gradient(90deg, ${DT.c.primary}, #FF8B5C)`,
                }}/>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, width: 40, textAlign: 'right' }}>{a.c}</span>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="home"/>
    </div>
  </PhoneShell>
);

// ────────────────────────────────────────────────────────────────
// 2) VENDOR CREATE OFFER
// ────────────────────────────────────────────────────────────────
const ScreenVendorOffer = () => (
  <PhoneShell bg={DT.c.surfaceAlt}>
    <IOSStatusBar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ScreenHeader back title="New offer" subtitle="Draft · auto-saved" right={
        <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.faint, letterSpacing: 0.6 }}>SAVE & EXIT</span>
      }/>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Preview card */}
        <div style={{
          background: DT.c.ink, color: '#fff', borderRadius: 22, padding: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -16, top: -10, opacity: 0.18 }}>
            <ProductGlyph kind="car" size={170} tone="rgba(255,255,255,0.8)"/>
          </div>
          <Chip tone="primary" size="xs">PREVIEW</Chip>
          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.6, marginTop: 10 }}>Maruti Baleno Zeta</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>2026 · Petrol · 5-seater</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
            <span style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6 }}>₹8,00,000</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>₹8,90,000</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Target: 10 buyers</span>
            <span style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }}/>
            <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.saving }}>↓ 10% off</span>
          </div>
        </div>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Product</div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: `1px solid ${DT.c.line}`, fontSize: 13.5, fontWeight: 500, color: DT.c.ink }}>
              Maruti Baleno Zeta · 2026
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Deal price</div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: `1.5px solid ${DT.c.primary}`, boxShadow: `0 0 0 4px ${DT.c.primaryGlow}` }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.3 }}>₹8,00,000</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>MRP</div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: `1px solid ${DT.c.line}` }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.3 }}>₹8,90,000</div>
              </div>
            </div>
          </div>

          {/* Target slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>Target buyers</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: DT.c.primary }}>10 people</div>
            </div>
            <div style={{
              background: '#fff', borderRadius: 14, padding: '16px 16px 14px',
              border: `1px solid ${DT.c.line}`,
            }}>
              <div style={{ position: 'relative', height: 24 }}>
                <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 4, background: DT.c.line, borderRadius: 2 }}/>
                <div style={{ position: 'absolute', top: 10, left: 0, width: '40%', height: 4, background: DT.c.primary, borderRadius: 2 }}/>
                <div style={{
                  position: 'absolute', top: 0, left: 'calc(40% - 12px)', width: 24, height: 24, borderRadius: '50%',
                  background: '#fff', border: `3px solid ${DT.c.primary}`, boxShadow: DT.s.md,
                }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, fontWeight: 500, color: DT.c.faint }}>
                <span>5</span><span>15</span><span>25</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Categories</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Chip tone="ink" size="sm">Cars</Chip>
              <Chip tone="ink" size="sm">Maruti</Chip>
              <Chip tone="soft" size="sm">+ Add tag</Chip>
            </div>
          </div>

          {/* Validity */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Offer valid till</div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: `1px solid ${DT.c.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="clock" size={18} color={DT.c.muted} stroke={2.2}/>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: DT.c.ink }}>15 Dec 2026 · 11:59 PM</span>
              </div>
              <Icon name="chevR" size={16} color={DT.c.faint} stroke={2.4}/>
            </div>
          </div>
        </div>

        {/* Estimate */}
        <div style={{
          background: DT.c.savingSoft, border: `1px solid ${DT.c.saving}33`,
          borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12, background: DT.c.saving,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="trending" size={18} color="#fff" stroke={2.4}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: DT.c.ink }}>Est. fill time: 4–7 days</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.muted, marginTop: 1 }}>Based on similar Maruti groups in Delhi NCR</div>
          </div>
        </div>
      </div>

      {/* sticky CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 20px 30px', background: 'rgba(250,247,242,0.92)',
        backdropFilter: 'blur(20px)', borderTop: `1px solid ${DT.c.line}`,
        display: 'flex', gap: 10,
      }}>
        <Btn variant="soft" size="lg">Preview</Btn>
        <Btn variant="primary" size="lg" iconRight={<Icon name="bolt" size={18} color="#fff" stroke={2.4}/>} style={{ flex: 1 }}>
          Launch offer
        </Btn>
      </div>
    </div>
  </PhoneShell>
);

window.VendorScreens = { ScreenVendorDashboard, ScreenVendorOffer };
