// Home / Discovery screens — Heritage Modern
// Banners use ink + emerald + ivory variants. Categories use refined glyphs.

// ─── Banner ───────────────────────────────────────────────
const Banner = ({ idx }) => {
  const variants = [
    {
      kicker: 'Featured · Electronics',
      pre: 'Pool 9 friends.',
      mid: 'iPhone 16 Pro',
      post: 'for 22% less.',
      bg: DT.c.surfaceInk,
      tone: 'dark',
      orb: 'radial-gradient(circle at 85% 20%, rgba(26,93,79,0.42), transparent 58%)',
      glyph: 'phone',
      glyphColor: 'rgba(255,255,255,0.16)',
      midColor: '#fff',
    },
    {
      kicker: 'Vendor · Maruti Suzuki',
      pre: 'A new deal:',
      mid: 'Baleno @ ₹8L',
      post: 'for 10 buyers.',
      bg: DT.c.primary,
      tone: 'dark',
      orb: 'radial-gradient(circle at 90% 80%, rgba(255,255,255,0.16), transparent 50%)',
      glyph: 'car',
      glyphColor: 'rgba(255,255,255,0.20)',
      midColor: '#fff',
    },
    {
      kicker: 'Local · Lajpat Nagar',
      pre: 'Group your',
      mid: 'monthly grocery',
      post: 'haul. Save 18%.',
      bg: DT.c.surfaceWarm,
      tone: 'light',
      orb: 'radial-gradient(circle at 80% 80%, rgba(168,131,65,0.18), transparent 55%)',
      glyph: 'cart',
      glyphColor: DT.c.line,
      midColor: DT.c.primary,
    },
  ];
  const v = variants[idx];
  const isDark = v.tone === 'dark';
  const text = isDark ? '#fff' : DT.c.ink;
  const sub  = isDark ? 'rgba(255,255,255,0.62)' : DT.c.muted;
  return (
    <div style={{
      width: 314, height: 188, marginRight: 12, flexShrink: 0,
      borderRadius: 22, background: v.bg, color: text,
      padding: 22, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      border: isDark ? 'none' : `1px solid ${DT.c.line}`,
      boxShadow: idx === 0 ? '0 26px 50px -22px rgba(14,14,17,0.45)' : DT.s.md,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: v.orb }}/>
      <div style={{ position: 'absolute', right: -18, bottom: -18, transform: 'rotate(-8deg)' }}>
        <ProductGlyph kind={v.glyph} size={180} tone={v.glyphColor}/>
      </div>

      <div style={{ position: 'relative' }}>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1.8, textTransform: 'uppercase', color: sub }}>{v.kicker}</span>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 13.5, fontWeight: 400, color: sub, marginBottom: 2 }}>{v.pre}</div>
        <div style={{
          fontSize: 30, fontWeight: 400, letterSpacing: -1, lineHeight: 1.0,
          fontFamily: DT.f.display, fontStyle: 'italic',
          color: v.midColor,
        }}>{v.mid}</div>
        <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: -0.2, lineHeight: 1.2, marginTop: 4, color: text }}>{v.post}</div>

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 99,
            background: isDark ? 'rgba(255,255,255,0.12)' : DT.c.ink,
            color: '#fff', fontSize: 11, fontWeight: 500, letterSpacing: 0.2,
            backdropFilter: isDark ? 'blur(8px)' : 'none',
            border: isDark ? '1px solid rgba(255,255,255,0.14)' : 'none',
          }}>
            Explore <Icon name="arrowR" size={11} color="#fff" stroke={2}/>
          </div>
          <AvatarStack count={3} more={idx === 0 ? 6 : 2} size={22} />
        </div>
      </div>
    </div>
  );
};

// ─── Trending group card ──────────────────────────────────
const TrendingCard = ({ title, vendor, price, original, joined, total, tag, tagTone = 'primary', glyph, hero }) => (
  <div style={{
    minWidth: 230, marginRight: 12, flexShrink: 0,
    background: DT.c.surfaceWarm, borderRadius: 22, overflow: 'hidden',
    border: `1px solid ${DT.c.line}`,
  }}>
    <div style={{
      height: 134, position: 'relative',
      background: hero || `linear-gradient(170deg, ${DT.c.surfaceWarm}, ${DT.c.surfaceDeep})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'absolute', top: 12, left: 12 }}>
        <Chip tone={tagTone} size="xs">{tag}</Chip>
      </div>
      <button style={{
        position: 'absolute', top: 10, right: 10,
        width: 32, height: 32, borderRadius: 10, background: 'rgba(251,248,242,0.85)',
        border: `1px solid ${DT.c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="heart" size={14} color={DT.c.muted} stroke={1.8}/>
      </button>
      <ProductGlyph kind={glyph} size={90} tone={DT.c.muted}/>
    </div>
    <div style={{ padding: '14px 16px 16px' }}>
      <div style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>{vendor}</div>
      <div style={{ fontSize: 14.5, fontWeight: 500, color: DT.c.ink, marginTop: 4, lineHeight: 1.2, letterSpacing: -0.3 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
        <span style={{ fontSize: 17, fontWeight: 500, color: DT.c.ink, fontFamily: DT.f.mono, letterSpacing: -0.4 }}>{price}</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.faint, textDecoration: 'line-through', fontFamily: DT.f.mono }}>{original}</span>
      </div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Progress value={joined} total={total} height={4}/>
        <span style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.ink, whiteSpace: 'nowrap', fontFamily: DT.f.mono }}>{joined}/{total}</span>
      </div>
    </div>
  </div>
);

// ─── Category glyph card ──────────────────────────────────
const CategoryTile = ({ glyph, label, dot }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
    <div style={{
      width: 64, height: 64, borderRadius: 18,
      background: DT.c.surfaceWarm, border: `1px solid ${DT.c.line}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      {glyph === 'all' ? (
        <Icon name="grid" size={22} color={DT.c.muted} stroke={1.8}/>
      ) : (
        <ProductGlyph kind={glyph} size={42} tone={DT.c.inkSoft}/>
      )}
      {dot && (
        <span style={{
          position: 'absolute', top: 6, right: 6, width: 6, height: 6,
          background: DT.c.accent, borderRadius: '50%',
        }}/>
      )}
    </div>
    <span style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.ink, letterSpacing: 0.2 }}>{label}</span>
  </div>
);

// ────────────────────────────────────────────────────────────────
// 1) HOME
// ────────────────────────────────────────────────────────────────
const ScreenHome = () => (
  <PhoneShell bg={DT.c.surfaceAlt}>
    <IOSStatusBar />
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Top header */}
      <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={{
          width: 40, height: 40, borderRadius: 12, background: DT.c.surfaceWarm,
          border: `1px solid ${DT.c.line}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="menu" size={18} color={DT.c.ink} stroke={1.8}/>
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: DT.c.surfaceWarm, border: `1px solid ${DT.c.line}`,
          padding: '8px 12px', borderRadius: 99,
        }}>
          <Icon name="pin" size={12} color={DT.c.primary} stroke={1.8} fill={DT.c.primary}/>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: DT.c.ink }}>Lajpat Nagar</span>
          <Icon name="chevD" size={11} color={DT.c.faint} stroke={2}/>
        </div>
        <button style={{
          width: 40, height: 40, borderRadius: 12, background: DT.c.surfaceWarm,
          border: `1px solid ${DT.c.line}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <Icon name="bell" size={17} color={DT.c.ink} stroke={1.8}/>
          <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, background: DT.c.accent, borderRadius: '50%' }}/>
        </button>
      </div>

      {/* Greeting */}
      <div style={{ padding: '0 20px', marginTop: 4 }}>
        <div style={{ fontSize: 12.5, fontWeight: 400, color: DT.c.muted }}>Good morning, Rahul.</div>
        <div style={{
          fontSize: 32, lineHeight: 1.0, color: DT.c.ink, marginTop: 6,
          letterSpacing: -1, fontWeight: 500,
        }}>
          Find your group.<br/>
          <Serif style={{ color: DT.c.primary, fontSize: 38 }}>Save together.</Serif>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '20px 20px 0' }}>
        <SearchBar />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'hidden', marginTop: 20 }}>
        {/* Banner carousel */}
        <div style={{ display: 'flex', paddingLeft: 20, overflow: 'hidden' }}>
          <Banner idx={0} />
          <Banner idx={1} />
          <div style={{ width: 50, flexShrink: 0 }}/>
        </div>

        {/* dots */}
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 14 }}>
          <div style={{ width: 18, height: 3, background: DT.c.ink, borderRadius: 2 }}/>
          <div style={{ width: 3, height: 3, background: DT.c.faint, borderRadius: 2 }}/>
          <div style={{ width: 3, height: 3, background: DT.c.faint, borderRadius: 2 }}/>
        </div>

        {/* Categories */}
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div style={{ fontSize: 17, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.3 }}>Browse <Serif style={{ color: DT.c.primary }}>categories</Serif></div>
            <span style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.muted, letterSpacing: 1.4, textTransform: 'uppercase' }}>View all</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, rowGap: 16 }}>
            <CategoryTile glyph="phone" label="Phones" dot/>
            <CategoryTile glyph="laptop" label="Laptops"/>
            <CategoryTile glyph="car" label="Cars"/>
            <CategoryTile glyph="home" label="Property"/>
            <CategoryTile glyph="fridge" label="Appliances"/>
            <CategoryTile glyph="bike" label="Bikes"/>
            <CategoryTile glyph="game" label="Gaming"/>
            <CategoryTile glyph="all" label="View all"/>
          </div>
        </div>

        {/* Live activity */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{
            background: DT.c.surfaceWarm, borderRadius: 14, padding: '12px 14px',
            border: `1px solid ${DT.c.line}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Avatar seed={3} size={28}/>
            <div style={{ flex: 1, fontSize: 12.5, fontWeight: 400, color: DT.c.ink }}>
              <span style={{ fontWeight: 500 }}>Priya</span> unlocked <span style={{ color: DT.c.primary, fontWeight: 500, fontFamily: DT.f.mono }}>₹8,400</span> off in MacBook group
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 8px', borderRadius: 99,
              background: DT.c.primary, color: '#fff',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }}/>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.6 }}>LIVE</span>
            </div>
          </div>
        </div>

        {/* Trending */}
        <div style={{ padding: '24px 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px 14px', alignItems: 'baseline' }}>
            <div style={{ fontSize: 17, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.3 }}>
              Trending <Serif style={{ color: DT.c.primary }}>now</Serif>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.muted, letterSpacing: 1.4, textTransform: 'uppercase' }}>View all</span>
          </div>
          <div style={{ display: 'flex', paddingLeft: 20, overflow: 'hidden' }}>
            <TrendingCard title="iPhone 16 Pro 256GB" vendor="Apple India" price="₹1,19,900" original="₹1,29,900" joined={7} total={10} tag="3 LEFT" tagTone="ink" glyph="phone"
              hero={`linear-gradient(170deg, ${DT.c.surfaceInk}, #1F1F25)`}/>
            <TrendingCard title="Sony PlayStation 5" vendor="Sony" price="₹44,990" original="₹54,990" joined={4} total={6} tag="HOT" tagTone="accent" glyph="game"
              hero={`linear-gradient(170deg, ${DT.c.surfaceWarm}, ${DT.c.surfaceDeep})`}/>
            <TrendingCard title="MacBook Air M4" vendor="Apple India" price="₹89,990" original="₹1,09,990" joined={8} total={10} tag="2 LEFT" tagTone="ink" glyph="laptop"
              hero={`linear-gradient(170deg, ${DT.c.primarySoft}, #D4E1DA)`}/>
            <div style={{ width: 20, flexShrink: 0 }}/>
          </div>
        </div>

        {/* CTA banner */}
        <div style={{ padding: '24px 20px 100px' }}>
          <div style={{
            background: DT.c.surfaceInk, color: '#fff', borderRadius: 20, padding: '20px 22px',
            display: 'flex', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 100% 0%, rgba(26,93,79,0.35), transparent 55%)',
            }}/>
            <div style={{ position: 'relative', flex: 1 }}>
              <div style={{
                fontSize: 18, fontWeight: 500, letterSpacing: -0.4, lineHeight: 1.15,
              }}>
                Don't see your <Serif style={{ color: DT.c.primarySoft }}>deal?</Serif>
              </div>
              <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                Start a group · invite friends · save together
              </div>
            </div>
            <div style={{
              position: 'relative', width: 44, height: 44, borderRadius: 12,
              background: DT.c.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: DT.s.glow,
            }}>
              <Icon name="plus" size={20} color="#fff" stroke={2}/>
            </div>
          </div>
        </div>
      </div>

      <TabBar active="home" />
    </div>
  </PhoneShell>
);

// ────────────────────────────────────────────────────────────────
// 2) SIDEBAR
// ────────────────────────────────────────────────────────────────
const ScreenSidebar = () => (
  <PhoneShell bg={DT.c.ink}>
    <IOSStatusBar dark />
    <div style={{ flex: 1, position: 'relative' }}>
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
        background: 'rgba(14,14,17,0.55)', backdropFilter: 'blur(8px)',
      }}/>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 310,
        background: DT.c.surfaceAlt,
        boxShadow: '20px 0 60px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Profile header */}
        <div style={{
          padding: '22px 22px 24px',
          background: DT.c.surfaceWarm,
          borderBottom: `1px solid ${DT.c.line}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar seed={1} size={50} ring/>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.2 }}>Rahul Khanna</span>
                  <Icon name="verified" size={13} color={DT.c.info} fill={DT.c.info} stroke={0}/>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 400, color: DT.c.muted, marginTop: 2, fontFamily: DT.f.mono }}>+91 98765 43210</div>
              </div>
            </div>
            <button style={{
              width: 30, height: 30, borderRadius: 10, background: DT.c.surfaceAlt,
              border: `1px solid ${DT.c.line}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="x" size={14} color={DT.c.muted} stroke={2}/></button>
          </div>

          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { v: '12', l: 'Groups' },
              { v: '₹24k', l: 'Saved' },
              { v: '4.9', l: 'Rating' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '10px 8px', background: DT.c.surfaceAlt,
                borderRadius: 12, border: `1px solid ${DT.c.line}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.3, fontFamily: DT.f.mono }}>{s.v}</span>
                <span style={{ fontSize: 9, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: '14px 12px 0', flex: 1, overflow: 'hidden' }}>
          {[
            { i: 'home', l: 'Home', active: true },
            { i: 'users', l: 'My groups', badge: '4' },
            { i: 'bag', l: 'My deals' },
            { i: 'tag', l: 'Vendor offers' },
            { i: 'heart', l: 'Wishlist' },
          ].map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12,
              background: it.active ? DT.c.surfaceWarm : 'transparent',
              border: it.active ? `1px solid ${DT.c.line}` : '1px solid transparent',
              color: it.active ? DT.c.ink : DT.c.muted,
              marginBottom: 2,
            }}>
              <Icon name={it.i} size={18} color={it.active ? DT.c.primary : DT.c.muted} stroke={1.8}/>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: it.active ? 500 : 400 }}>{it.l}</span>
              {it.badge && (
                <span style={{
                  fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 99,
                  background: DT.c.primary, color: '#fff', fontFamily: DT.f.mono,
                }}>{it.badge}</span>
              )}
              {!it.badge && <Icon name="chevR" size={13} color={DT.c.faint} stroke={2}/>}
            </div>
          ))}

          <div style={{ height: 1, background: DT.c.line, margin: '14px 14px' }}/>

          {[
            { i: 'bell', l: 'Notifications' },
            { i: 'settings', l: 'Settings' },
            { i: 'shield', l: 'Privacy' },
            { i: 'info', l: 'Help & support' },
          ].map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', color: DT.c.muted,
            }}>
              <Icon name={it.i} size={17} color={DT.c.muted} stroke={1.8}/>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 400 }}>{it.l}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 22px 22px' }}>
          <div style={{
            background: 'transparent', color: DT.c.danger, padding: '12px 14px',
            borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
            fontWeight: 500, fontSize: 13, border: `1px solid ${DT.c.line}`,
          }}>
            <Icon name="log" size={16} color={DT.c.danger} stroke={1.8}/>
            Log out
          </div>
        </div>
      </div>
    </div>
  </PhoneShell>
);

// ────────────────────────────────────────────────────────────────
// 3) CATEGORY BROWSE
// ────────────────────────────────────────────────────────────────
const ScreenCategory = () => {
  const items = [
    { title: 'iPhone 16 Pro', sub: '256GB · Titanium', vendor: 'Apple', price: '₹1,19,900', orig: '₹1,29,900', joined: 7, total: 10, save: '8%', glyph: 'phone' },
    { title: 'Galaxy S24 Ultra', sub: '512GB · Stellar', vendor: 'Samsung', price: '₹1,09,999', orig: '₹1,29,999', joined: 3, total: 5, save: '15%', glyph: 'phone' },
    { title: 'OnePlus 12R', sub: '256GB · Flowy', vendor: 'OnePlus', price: '₹38,999', orig: '₹42,999', joined: 9, total: 10, save: '9%', glyph: 'phone' },
    { title: 'Nothing Phone 3', sub: '128GB · White', vendor: 'Nothing', price: '₹29,990', orig: '₹34,990', joined: 12, total: 15, save: '14%', glyph: 'phone' },
  ];
  return (
    <PhoneShell bg={DT.c.surfaceAlt}>
      <IOSStatusBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ScreenHeader back title="Phones" subtitle="284 active groups · 42 vendors" right={
          <button style={{ width: 38, height: 38, borderRadius: 12, background: DT.c.surfaceWarm, border: `1px solid ${DT.c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="grid" size={17} color={DT.c.ink} stroke={1.8}/>
          </button>
        }/>

        <div style={{ padding: '0 20px 14px' }}>
          <SearchBar placeholder="iPhone 16 Pro, Samsung S24…" compact/>
        </div>

        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6, overflow: 'hidden' }}>
          {[
            { l: 'Sort · Trending', d: true, ink: true },
            { l: 'Price · Any' },
            { l: 'Near me' },
            { l: '< 10 joined' },
            { l: 'Verified only' },
          ].map((c, i) => (
            <div key={i} style={{
              padding: '8px 13px', borderRadius: 99, flexShrink: 0,
              background: c.ink ? DT.c.ink : DT.c.surfaceWarm,
              color: c.ink ? '#fff' : DT.c.ink,
              border: c.ink ? 'none' : `1px solid ${DT.c.line}`,
              fontSize: 11.5, fontWeight: 500, letterSpacing: -0.05,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>{c.l}{c.d && <Icon name="chevD" size={11} color="#fff" stroke={2}/>}</div>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px 100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {items.map((it, i) => (
              <div key={i} style={{
                background: DT.c.surfaceWarm, borderRadius: 18, overflow: 'hidden',
                border: `1px solid ${DT.c.line}`,
              }}>
                <div style={{
                  height: 100, background: DT.c.surfaceAlt,
                  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ProductGlyph kind={it.glyph} size={72} tone={DT.c.inkSoft}/>
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <Chip tone="saving" size="xs">↓ {it.save}</Chip>
                  </div>
                  <button style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 28, height: 28, borderRadius: 9, background: 'rgba(251,248,242,0.85)', border: `1px solid ${DT.c.line}`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name="heart" size={13} color={DT.c.muted} stroke={1.8}/></button>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>{it.vendor}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: DT.c.ink, marginTop: 3, lineHeight: 1.2, letterSpacing: -0.2 }}>{it.title}</div>
                  <div style={{ fontSize: 11, fontWeight: 400, color: DT.c.muted, marginTop: 2 }}>{it.sub}</div>
                  <div style={{ marginTop: 10, fontSize: 15, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.3, fontFamily: DT.f.mono }}>{it.price}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 400, color: DT.c.faint, textDecoration: 'line-through', fontFamily: DT.f.mono }}>{it.orig}</div>
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Progress value={it.joined} total={it.total} height={3}/>
                    <span style={{ fontSize: 9.5, fontWeight: 500, color: DT.c.ink, fontFamily: DT.f.mono }}>{it.joined}/{it.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <TabBar active="home" />
      </div>
    </PhoneShell>
  );
};

// ────────────────────────────────────────────────────────────────
// 4) NOTIFICATIONS
// ────────────────────────────────────────────────────────────────
const ScreenNotifications = () => {
  const items = [
    { title: 'iPhone 16 Pro group is locked.', sub: 'Target reached · vendor confirms in 2 hours', time: 'Just now', new: true, icon: 'lock', tone: DT.c.primary, bg: DT.c.primarySoft },
    { title: 'New deal in your area', sub: 'Maruti Baleno · ₹8L for 10 buyers · 1.2 km', time: '12 min', new: true, icon: 'tag', tone: DT.c.info, bg: DT.c.infoSoft },
    { title: 'You saved ₹8,400 this month.', sub: '4 deals confirmed · keep going', time: '2 hrs', icon: 'rupee', tone: DT.c.primary, bg: DT.c.primarySoft },
    { title: 'Vote: MacBook Air or Pro?', sub: 'New poll in MacBook M4 group', time: '5 hrs', icon: 'poll', tone: DT.c.muted, bg: DT.c.surfaceDeep },
    { title: 'Priya joined PS5 group.', sub: "You've been invited to join too", time: 'Yday', icon: 'users', tone: DT.c.muted, bg: DT.c.surfaceDeep },
  ];
  return (
    <PhoneShell bg={DT.c.surfaceAlt}>
      <IOSStatusBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader back title="Notifications" subtitle="3 unread" right={
          <span style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.muted, letterSpacing: 1.4, textTransform: 'uppercase' }}>Mark all</span>
        }/>

        <div style={{ padding: '0 20px 20px', display: 'flex', gap: 20 }}>
          {['All', 'Groups', 'Deals', 'System'].map((t, i) => (
            <div key={t} style={{
              fontSize: 13, fontWeight: i === 0 ? 500 : 400, paddingBottom: 8,
              color: i === 0 ? DT.c.ink : DT.c.muted,
              borderBottom: i === 0 ? `1.5px solid ${DT.c.primary}` : '1.5px solid transparent',
            }}>{t}</div>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: DT.c.muted, letterSpacing: 1.8, padding: '0 2px' }}>TODAY</div>

          {items.map((n, i) => (
            <div key={i} style={{
              background: DT.c.surfaceWarm, borderRadius: 16, padding: 14,
              border: `1px solid ${DT.c.line}`,
              display: 'flex', gap: 12,
              position: 'relative',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, background: n.bg,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={n.icon} size={18} color={n.tone} stroke={1.8} fill={n.icon === 'lock' ? n.tone : 'none'}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.2, lineHeight: 1.3 }}>{n.title}</div>
                <div style={{ fontSize: 12, fontWeight: 400, color: DT.c.muted, marginTop: 3, lineHeight: 1.4 }}>{n.sub}</div>
                <div style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.faint, marginTop: 6, fontFamily: DT.f.mono }}>{n.time}</div>
              </div>
              {n.new && <span style={{ width: 6, height: 6, borderRadius: '50%', background: DT.c.primary, alignSelf: 'flex-start', marginTop: 6 }}/>}
            </div>
          ))}

          <div style={{ fontSize: 10, fontWeight: 500, color: DT.c.muted, letterSpacing: 1.8, padding: '10px 2px 0' }}>EARLIER</div>
          <div style={{
            background: DT.c.surfaceWarm, borderRadius: 16, padding: 14,
            border: `1px solid ${DT.c.line}`,
            display: 'flex', gap: 12,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: DT.c.primarySoft,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon name="award" size={18} color={DT.c.primary} stroke={1.8}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: DT.c.ink }}>You earned the <Serif style={{ color: DT.c.primary }}>Bulk-Buyer</Serif> badge.</div>
              <div style={{ fontSize: 12, fontWeight: 400, color: DT.c.muted, marginTop: 3 }}>5 successful group deals in a month</div>
              <div style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.faint, marginTop: 6, fontFamily: DT.f.mono }}>3 days ago</div>
            </div>
          </div>
        </div>

        <TabBar active="home"/>
      </div>
    </PhoneShell>
  );
};

window.HomeScreens = { ScreenHome, ScreenSidebar, ScreenCategory, ScreenNotifications };
