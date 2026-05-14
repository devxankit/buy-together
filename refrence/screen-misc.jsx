// Profile, My Groups, Deal Confirmation

// ────────────────────────────────────────────────────────────────
// 1) PROFILE
// ────────────────────────────────────────────────────────────────
const ScreenProfile = () => (
  <PhoneShell bg={DT.c.surfaceAlt}>
    <IOSStatusBar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 19, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.4 }}>My profile</span>
        <button style={{ width: 38, height: 38, borderRadius: 12, background: '#fff', border: `1px solid ${DT.c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="settings" size={18} color={DT.c.ink} stroke={2.2}/>
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Profile card */}
        <div style={{
          background: '#fff', borderRadius: 24, padding: 22,
          border: `1px solid ${DT.c.line}`,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* faint pattern */}
          <div style={{
            position: 'absolute', right: -50, top: -50, width: 180, height: 180, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,93,79,0.10), transparent 70%)',
          }}/>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
            <Avatar seed={1} size={68} ring/>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 18, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.4 }}>Rahul Khanna</span>
                <Icon name="verified" size={16} color={DT.c.info} fill={DT.c.info} stroke={0}/>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: DT.c.muted }}>+91 98765 43210</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Icon name="pin" size={12} color={DT.c.faint} stroke={2.4}/>
                <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.faint }}>Lajpat Nagar, Delhi</span>
              </div>
            </div>
            <button style={{ width: 34, height: 34, borderRadius: 11, background: DT.c.surfaceAlt, border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="edit" size={14} color={DT.c.ink} stroke={2.2}/>
            </button>
          </div>

          {/* badges */}
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <Chip tone="gold" size="sm">Bulk buyer</Chip>
            <Chip tone="info" size="sm">Top contributor</Chip>
            <Chip tone="saving" size="sm">5 deals</Chip>
          </div>

          {/* level bar */}
          <div style={{
            marginTop: 16, padding: 12, borderRadius: 14,
            background: DT.c.surfaceAlt, border: `1px solid ${DT.c.line}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.ink, letterSpacing: 0.2 }}>LEVEL 3 · GROUP LEADER</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.primary }}>2 / 5 to L4</span>
            </div>
            <Progress value={2} total={5} height={6}/>
          </div>
        </div>

        {/* Money saved big number */}
        <div style={{
          background: DT.c.ink, color: '#fff', borderRadius: 22, padding: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -30, bottom: -30, width: 150, height: 150, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(31,168,98,0.4), transparent 65%)',
          }}/>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.2, textTransform: 'uppercase' }}>Total saved with Buy Together</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6, position: 'relative' }}>
            <span style={{ fontSize: 40, fontWeight: 500, letterSpacing: -1.4 }}>₹24,820</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: DT.c.saving }}>across 5 deals</span>
          </div>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, position: 'relative' }}>
            {[
              { v: '12', l: 'Joined' },
              { v: '3', l: 'Created' },
              { v: '8', l: 'Confirmed' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 500 }}>{s.v}</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.4, textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu list */}
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${DT.c.line}`, overflow: 'hidden' }}>
          {[
            { i: 'users', l: 'My groups', s: '4 active · 8 completed' },
            { i: 'bag', l: 'My deals', s: '2 pending confirmation' },
            { i: 'heart', l: 'Wishlist', s: '12 saved items' },
            { i: 'qr', l: 'Invite friends', s: 'Earn 1 month Premium', accent: true },
          ].map((it, i, arr) => (
            <div key={i} style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i < arr.length - 1 ? `1px solid ${DT.c.line}` : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 11,
                background: it.accent ? DT.c.primarySoft : DT.c.surfaceAlt,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={it.i} size={17} color={it.accent ? DT.c.primary : DT.c.muted} stroke={2.2}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: DT.c.ink }}>{it.l}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.faint, marginTop: 1 }}>{it.s}</div>
              </div>
              <Icon name="chevR" size={14} color={DT.c.faint} stroke={2.4}/>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="profile"/>
    </div>
  </PhoneShell>
);

// ────────────────────────────────────────────────────────────────
// 2) MY GROUPS — list with filters
// ────────────────────────────────────────────────────────────────
const ScreenMyGroups = () => (
  <PhoneShell bg={DT.c.surfaceAlt}>
    <IOSStatusBar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ScreenHeader title="My groups" subtitle="4 active · 8 completed" right={
        <button style={{ width: 38, height: 38, borderRadius: 12, background: DT.c.primary, border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: DT.s.glow }}>
          <Icon name="plus" size={18} color="#fff" stroke={2.6}/>
        </button>
      }/>

      {/* Tabs */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6 }}>
        {[
          { l: 'Active', n: 4, active: true },
          { l: 'Locked', n: 1 },
          { l: 'Completed', n: 8 },
          { l: 'Saved', n: 12 },
        ].map((t, i) => (
          <div key={t.l} style={{
            padding: '8px 14px', borderRadius: 99,
            background: t.active ? DT.c.ink : '#fff',
            color: t.active ? '#fff' : DT.c.ink,
            border: t.active ? 'none' : `1px solid ${DT.c.line}`,
            fontSize: 12, fontWeight: 500, letterSpacing: -0.1,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {t.l}
            <span style={{
              fontSize: 9, padding: '1px 6px', borderRadius: 99, fontWeight: 500,
              background: t.active ? 'rgba(255,255,255,0.18)' : DT.c.surfaceAlt,
              color: t.active ? '#fff' : DT.c.faint,
            }}>{t.n}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Card 1 — near complete */}
        <div style={{
          background: '#fff', borderRadius: 22, padding: 16,
          border: `1.5px solid ${DT.c.primary}`,
          boxShadow: `0 0 0 4px ${DT.c.primaryGlow}`,
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <Chip tone="primary" size="xs">90% full · 1 left</Chip>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 16, background: DT.c.ink, color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}><ProductGlyph kind="phone" size={28} tone="rgba(255,255,255,0.75)"/></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.3 }}>iPhone 16 Pro 256GB</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.faint, marginTop: 1 }}>Apple India · 1d 13h left</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 12 }}>
                <Progress value={9} total={10} height={5}/>
                <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.ink, whiteSpace: 'nowrap' }}>9/10</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <AvatarStack count={4} more={5} size={22}/>
            <Btn variant="primary" size="sm" iconRight={<Icon name="arrowR" size={12} color="#fff" stroke={2.6}/>}>Invite 1 more</Btn>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: DT.c.surfaceWarm, borderRadius: 20, padding: 16, border: `1px solid ${DT.c.line}` }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14, background: DT.c.primarySoft,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}><ProductGlyph kind="game" size={26} tone={DT.c.primary}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: DT.c.ink }}>Sony PlayStation 5</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.faint, marginTop: 1 }}>Created by you · 4 days ago</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <Progress value={4} total={6} height={5}/>
                <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.ink }}>4/6</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - chat unread */}
        <div style={{ background: DT.c.surfaceWarm, borderRadius: 20, padding: 16, border: `1px solid ${DT.c.line}` }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14, background: DT.c.surfaceAlt,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}><ProductGlyph kind="laptop" size={26} tone={DT.c.muted}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: DT.c.ink }}>MacBook Air M4</span>
                <span style={{ fontSize: 9, fontWeight: 500, padding: '2px 6px', borderRadius: 99, background: DT.c.danger, color: '#fff' }}>3 NEW</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.faint, marginTop: 1 }}>"Anyone needs the 16GB variant?"</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <Progress value={3} total={10} height={5}/>
                <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.ink }}>3/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 - vendor offer */}
        <div style={{ background: DT.c.surfaceWarm, borderRadius: 20, padding: 16, border: `1px solid ${DT.c.line}` }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14, background: DT.c.primarySoft,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}><ProductGlyph kind="cart" size={26} tone={DT.c.primary}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: DT.c.ink }}>Monthly Grocery Haul</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.faint, marginTop: 1 }}>Big Bazaar · Lajpat Nagar</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <Progress value={6} total={8} height={5}/>
                <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.ink }}>6/8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TabBar active="groups"/>
    </div>
  </PhoneShell>
);

// ────────────────────────────────────────────────────────────────
// 3) DEAL CONFIRMATION — locked, vendor ready
// ────────────────────────────────────────────────────────────────
const ScreenDealConfirm = () => (
  <PhoneShell bg="#fff">
    <IOSStatusBar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero celebration */}
      <div style={{
        padding: '20px 24px 30px',
        background: `linear-gradient(180deg, ${DT.c.primarySoft}, #fff)`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* confetti dots */}
        {Array.from({ length: 18 }).map((_, i) => {
          const colors = [DT.c.primary, DT.c.saving, DT.c.info, DT.c.warning];
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i * 53 + 7) % 100}%`,
              top: `${(i * 31 + 13) % 70}%`,
              width: 6 + (i % 3) * 2, height: 6 + (i % 3) * 2,
              borderRadius: i % 2 ? '50%' : '2px',
              background: colors[i % 4],
              opacity: 0.65,
              transform: `rotate(${i * 33}deg)`,
            }}/>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <button style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(255,255,255,0.7)', border: `1px solid ${DT.c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={18} color={DT.c.ink} stroke={2.4}/>
          </button>
          <button style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(255,255,255,0.7)', border: `1px solid ${DT.c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="share" size={16} color={DT.c.ink} stroke={2.2}/>
          </button>
        </div>

        <div style={{ marginTop: 24, position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99,
            background: DT.c.ink, color: '#fff',
            fontSize: 10.5, fontWeight: 500, letterSpacing: 1.2,
          }}>
            <Icon name="lock" size={12} color={DT.c.primary} stroke={2.4} fill={DT.c.primary}/> GROUP LOCKED
          </div>
          <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1.1, color: DT.c.ink, lineHeight: 1.05, marginTop: 14 }}>
            You did it.<br/><span style={{ color: DT.c.primary }}>Confirm your spot.</span>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: DT.c.muted, marginTop: 8, lineHeight: 1.45 }}>
            All 10 buyers are in. Apple India has released the deal. You have <span style={{ color: DT.c.ink, fontWeight: 500 }}>24 hours</span> to confirm.
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '8px 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Product summary card */}
        <div style={{
          background: DT.c.surfaceWarm, borderRadius: 22, padding: 18,
          border: `1px solid ${DT.c.line}`, boxShadow: DT.s.md,
        }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: DT.c.ink, color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}><ProductGlyph kind="phone" size={36} tone="rgba(255,255,255,0.75)"/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.faint, letterSpacing: 0.6 }}>APPLE INDIA</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.3, marginTop: 1 }}>iPhone 16 Pro 256GB</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.muted, marginTop: 2 }}>Titanium Black · 10-buyer group</div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: DT.c.surfaceAlt }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: DT.c.muted }}>MRP</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: DT.c.muted, textDecoration: 'line-through' }}>₹1,29,900</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: DT.c.muted }}>Group price</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: DT.c.ink }}>₹1,19,900</span>
            </div>
            <div style={{ height: 1, background: DT.c.line, margin: '10px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: DT.c.saving }}>You save</span>
              <span style={{ fontSize: 17, fontWeight: 500, color: DT.c.saving, letterSpacing: -0.3 }}>₹10,000</span>
            </div>
          </div>
        </div>

        {/* Group complete */}
        <div style={{
          background: DT.c.savingSoft, border: `1px solid ${DT.c.saving}33`,
          borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: DT.c.saving,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={20} color="#fff" stroke={3}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: DT.c.ink }}>10 / 10 buyers locked in</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.muted, marginTop: 1 }}>8 confirmed · 2 pending including you</div>
          </div>
          <AvatarStack count={3} more={7} size={22}/>
        </div>

        {/* Delivery info */}
        <div style={{
          background: DT.c.surfaceWarm, borderRadius: 16, padding: 14,
          border: `1px solid ${DT.c.line}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: DT.c.infoSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bag" size={18} color={DT.c.info} stroke={2.2}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: DT.c.ink }}>Delivery in 5–7 days</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.muted, marginTop: 1 }}>Apple Store · Lajpat Nagar · Pickup or home</div>
          </div>
          <Icon name="chevR" size={14} color={DT.c.faint} stroke={2.4}/>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 20px 30px', background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', borderTop: `1px solid ${DT.c.line}`,
      }}>
        <Btn variant="primary" size="lg" full iconRight={<Icon name="arrowR" size={18} color="#fff" stroke={2.4}/>}>
          Confirm & pay ₹1,19,900
        </Btn>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          <Icon name="shield" size={12} color={DT.c.muted} stroke={2.2}/>
          <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted }}>Secured · Buyer protection included</span>
        </div>
      </div>
    </div>
  </PhoneShell>
);

window.MiscScreens = { ScreenProfile, ScreenMyGroups, ScreenDealConfirm };
