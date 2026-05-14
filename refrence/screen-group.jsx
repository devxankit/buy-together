// Group flow: Group Detail, Group Chat, Members, Create Group

// ────────────────────────────────────────────────────────────────
// 1) GROUP DETAIL
// ────────────────────────────────────────────────────────────────
const ScreenGroupDetail = () => (
  <PhoneShell bg={DT.c.surfaceAlt}>
    <IOSStatusBar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero */}
      <div style={{
        position: 'relative', height: 320, marginBottom: -40,
        background: `linear-gradient(160deg, #1F1F25, #0F0F12)`,
        padding: '4px 20px 0',
      }}>
        {/* gradient orb */}
        <div style={{
          position: 'absolute', right: -60, top: -40, width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,93,79,0.45), transparent 70%)',
        }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <button style={{
            width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="arrowL" size={18} color="#fff" stroke={2.4}/></button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="share" size={18} color="#fff" stroke={2.2}/>
            </button>
            <button style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="bookmark" size={18} color="#fff" stroke={2.2}/>
            </button>
          </div>
        </div>

        {/* product */}
        <div style={{ position: 'relative', marginTop: 30, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: '#fff' }}>
          <Chip tone="primary" size="xs">Most popular · 3 left</Chip>
          <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: -1, lineHeight: 1.05, marginTop: 10 }}>
            iPhone 16 Pro<br/>256GB · Titanium
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.1)' }}>
              <Icon name="verified" size={12} color={DT.c.info} fill={DT.c.info} stroke={0}/>
              <span style={{ fontSize: 10.5, fontWeight: 500 }}>Apple India</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="star" size={11} color={DT.c.warning} fill={DT.c.warning} stroke={0}/>
              <span style={{ fontSize: 11, fontWeight: 500 }}>4.9 · 1.2k</span>
            </div>
          </div>
        </div>
      </div>

      {/* product image floating */}
      <div style={{
        position: 'absolute', top: 90, right: 14, width: 150, height: 200,
        borderRadius: 22, background: '#fff',
        boxShadow: DT.s.xl, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: 'rotate(4deg)',
      }}>
        <ProductGlyph kind="phone" size={120} tone={DT.c.inkSoft}/>
      </div>

      {/* Body card */}
      <div style={{
        flex: 1, background: DT.c.surfaceAlt, borderRadius: '24px 24px 0 0',
        padding: '22px 20px 100px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Price strip */}
        <div style={{
          background: DT.c.surfaceWarm, borderRadius: 20, padding: 16,
          border: `1px solid ${DT.c.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.6 }}>₹1,19,900</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: DT.c.faint, textDecoration: 'line-through' }}>₹1,29,900</span>
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: DT.c.saving, marginTop: 2 }}>You save ₹10,000 · 8%</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.faint, letterSpacing: 0.6 }}>LOCKS IN</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: DT.c.primary, letterSpacing: -0.3 }}>1d 13h</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: DT.c.surfaceWarm, borderRadius: 20, padding: 18, border: `1px solid ${DT.c.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="target" size={16} color={DT.c.primary} stroke={2.4}/>
              <span style={{ fontSize: 13, fontWeight: 500, color: DT.c.ink }}>7 of 10 joined</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.primary, padding: '4px 10px', background: DT.c.primarySoft, borderRadius: 99 }}>3 SPOTS LEFT</span>
          </div>
          <Progress value={7} total={10} height={10}/>

          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AvatarStack count={5} more={2} size={28} />
              <span style={{ fontSize: 11.5, fontWeight: 500, color: DT.c.muted }}>+ 4 friends</span>
            </div>
            <button style={{
              fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 99,
              background: DT.c.surfaceAlt, border: `1px solid ${DT.c.line}`, color: DT.c.ink,
            }}>View all</button>
          </div>
        </div>

        {/* Activity */}
        <div style={{ background: DT.c.surfaceWarm, borderRadius: 20, padding: 16, border: `1px solid ${DT.c.line}` }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.faint, letterSpacing: 1, textTransform: 'uppercase' }}>Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {[
              { who: 'Priya', what: 'joined the group', when: 'Just now', tone: DT.c.primary },
              { who: 'Vendor', what: 'confirmed stock for 10 units', when: '2 hrs', tone: DT.c.info, vendor: true },
              { who: 'Aman', what: 'voted in poll', when: '3 hrs', tone: DT.c.warning },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {a.vendor ? (
                  <div style={{
                    width: 30, height: 30, borderRadius: 10, background: DT.c.infoSoft,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name="verified" size={14} color={DT.c.info} fill={DT.c.info} stroke={0}/></div>
                ) : <Avatar seed={i+3} size={30}/>}
                <div style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: DT.c.muted }}>
                  <span style={{ fontWeight: 500, color: DT.c.ink }}>{a.who}</span> {a.what}
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.faint }}>{a.when}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky CTA */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: '14px 20px 30px',
          background: 'rgba(250,247,242,0.92)', backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${DT.c.line}`,
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <button style={{ width: 52, height: 52, borderRadius: 16, background: '#fff', border: `1px solid ${DT.c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chat" size={20} color={DT.c.ink} stroke={2.2}/>
          </button>
          <Btn variant="primary" size="lg" iconRight={<Icon name="arrowR" size={18} color="#fff" stroke={2.4}/>} style={{ flex: 1 }}>
            Join group · 3 left
          </Btn>
        </div>
      </div>
    </div>
  </PhoneShell>
);

// ────────────────────────────────────────────────────────────────
// 2) GROUP CHAT (with poll + structured chat)
// ────────────────────────────────────────────────────────────────
const ChatBubble = ({ self, text, who, time, poll, system, seed }) => {
  if (system) return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
        padding: '6px 14px', borderRadius: 99,
        background: DT.c.savingSoft, color: DT.c.saving,
        fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <Icon name="check" size={12} color={DT.c.saving} stroke={3}/> {text}
      </div>
    </div>
  );
  if (poll) {
    return (
      <div style={{
        background: DT.c.surfaceWarm, borderRadius: 18, padding: 14,
        border: `1px solid ${DT.c.line}`, alignSelf: 'flex-start', maxWidth: '88%',
        boxShadow: DT.s.sm,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Avatar seed={2} size={22}/>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: DT.c.ink }}>Aman started a poll</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: DT.c.ink, marginBottom: 12 }}>Which color do you prefer?</div>
        {[
          { l: 'Titanium Black', v: 60, top: true },
          { l: 'Natural Titanium', v: 28 },
          { l: 'White Titanium', v: 12 },
        ].map((o, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{
              position: 'relative', borderRadius: 10, padding: '8px 12px',
              background: o.top ? DT.c.primarySoft : DT.c.surfaceAlt,
              border: `1px solid ${o.top ? DT.c.primary : DT.c.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0, width: `${o.v}%`,
                background: o.top ? 'rgba(26,93,79,0.10)' : 'rgba(15,15,18,0.04)',
              }}/>
              <span style={{ fontSize: 12, fontWeight: 500, color: DT.c.ink, position: 'relative' }}>{o.l}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: o.top ? DT.c.primary : DT.c.muted, position: 'relative' }}>{o.v}%</span>
            </div>
          </div>
        ))}
        <div style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.faint, marginTop: 6 }}>7 voted · closes in 4h</div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: self ? 'flex-end' : 'flex-start', gap: 4 }}>
      {!self && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 38 }}>
          <span style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.muted }}>{who}</span>
          {who === 'Apple India' && <Icon name="verified" size={11} color={DT.c.info} fill={DT.c.info} stroke={0}/>}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, maxWidth: '82%' }}>
        {!self && <Avatar seed={seed || 3} size={28}/>}
        <div style={{
          padding: '10px 14px', borderRadius: 16,
          background: self ? DT.c.ink : '#fff',
          color: self ? '#fff' : DT.c.ink,
          border: self ? 'none' : `1px solid ${DT.c.line}`,
          fontSize: 13, fontWeight: 500, lineHeight: 1.4,
          borderTopLeftRadius: self ? 16 : 6,
          borderTopRightRadius: self ? 6 : 16,
        }}>{text}</div>
      </div>
      <span style={{ fontSize: 9.5, fontWeight: 500, color: DT.c.faint, paddingLeft: self ? 0 : 38, paddingRight: self ? 6 : 0 }}>{time}</span>
    </div>
  );
};

const ScreenGroupChat = () => (
  <PhoneShell bg={DT.c.surfaceAlt}>
    <IOSStatusBar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '8px 16px 12px', background: '#fff', borderBottom: `1px solid ${DT.c.line}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button style={{ width: 36, height: 36, borderRadius: 12, background: DT.c.surfaceAlt, border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrowL" size={18} color={DT.c.ink} stroke={2.4}/>
        </button>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: DT.c.ink, color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}><ProductGlyph kind="phone" size={22} tone="rgba(255,255,255,0.7)"/></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.2 }}>iPhone 16 Pro · group</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: DT.c.saving, display: 'inline-block' }}/>
            <span style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted }}>7 members · 3 online</span>
          </div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 12, background: DT.c.surfaceAlt, border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="users" size={18} color={DT.c.ink} stroke={2.2}/>
        </button>
      </div>

      {/* Progress strip */}
      <div style={{
        margin: '10px 16px 0', padding: '10px 14px', borderRadius: 14,
        background: `linear-gradient(135deg, ${DT.c.primarySoft}, #DCE9E3)`,
        border: `1px solid ${DT.c.primary}33`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Icon name="flame" size={18} color={DT.c.primary} stroke={2.2} fill={DT.c.primary}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 500, color: DT.c.ink }}>3 more to unlock 8% off</div>
          <div style={{ marginTop: 4 }}><Progress value={7} total={10} height={4}/></div>
        </div>
        <button style={{ background: DT.c.ink, color: '#fff', fontSize: 10.5, fontWeight: 500, padding: '7px 12px', borderRadius: 99, border: 'none' }}>INVITE</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ChatBubble system text="Group started · 7 days ago"/>
        <ChatBubble who="Priya" text="Hey everyone! I really need this by Diwali, hoping we hit 10 fast 🙏" time="10:24 AM" seed={3}/>
        <ChatBubble self text="Same here. Let's all share with 2 friends each tonight." time="10:28 AM"/>
        <ChatBubble poll/>
        <ChatBubble who="Apple India" text="Stock confirmed for 10 units in Delhi NCR. Will release deal once target hits." time="11:12 AM" seed={2}/>
        <ChatBubble system text="Aman joined the group"/>
        <ChatBubble who="Aman" text="Just joined! Anyone wants the 512GB variant?" time="11:18 AM" seed={4}/>
      </div>

      {/* Composer */}
      <div style={{
        padding: '12px 16px 28px', background: '#fff', borderTop: `1px solid ${DT.c.line}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button style={{ width: 40, height: 40, borderRadius: 12, background: DT.c.surfaceAlt, border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={18} color={DT.c.ink} stroke={2.4}/>
        </button>
        <div style={{
          flex: 1, height: 44, borderRadius: 14, background: DT.c.surfaceAlt,
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
        }}>
          <span style={{ fontSize: 13.5, color: DT.c.faint, flex: 1, fontWeight: 500 }}>Type a message…</span>
          <Icon name="image" size={18} color={DT.c.faint} stroke={2.2}/>
          <Icon name="mic" size={18} color={DT.c.faint} stroke={2.2}/>
        </div>
        <button style={{
          width: 44, height: 44, borderRadius: 12,
          background: `linear-gradient(135deg, ${DT.c.primary}, #FF8B5C)`,
          boxShadow: DT.s.glow, border: 'none',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="send" size={18} color="#fff" stroke={2.4}/>
        </button>
      </div>
    </div>
  </PhoneShell>
);

// ────────────────────────────────────────────────────────────────
// 3) CREATE GROUP
// ────────────────────────────────────────────────────────────────
const ScreenCreateGroup = () => (
  <PhoneShell bg={DT.c.surfaceAlt}>
    <IOSStatusBar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ScreenHeader back title="New group" subtitle="Step 2 of 4" right={
        <span style={{ fontSize: 12, fontWeight: 500, color: DT.c.faint }}>Cancel</span>
      }/>

      {/* Stepper */}
      <div style={{ padding: '0 20px 18px', display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: s <= 2 ? DT.c.primary : DT.c.line,
          }}/>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: -0.6, color: DT.c.ink, lineHeight: 1.1 }}>
            What are you<br/><span style={{ color: DT.c.primary }}>buying together?</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: DT.c.muted, marginTop: 8 }}>We'll suggest similar groups so you don't duplicate.</div>
        </div>

        {/* Product name */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Product</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff', border: `1.5px solid ${DT.c.primary}`,
            borderRadius: 14, padding: '14px 16px',
            boxShadow: `0 0 0 4px ${DT.c.primaryGlow}`,
          }}>
            <span style={{ fontSize: 14.5, fontWeight: 500, color: DT.c.ink, flex: 1 }}>iPhone 16 Pro 256GB</span>
            <Icon name="check" size={18} color={DT.c.saving} stroke={2.8}/>
          </div>

          {/* AI suggestion card */}
          <div style={{
            marginTop: 10, padding: 12, borderRadius: 14,
            background: DT.c.infoSoft, border: `1px solid ${DT.c.info}22`,
            display: 'flex', gap: 10,
          }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: DT.c.info, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="sparkle" size={14} color="#fff" stroke={2.6}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 500, color: DT.c.ink }}>3 similar groups already exist</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.muted, marginTop: 2, lineHeight: 1.35 }}>iPhone 16 Pro · 7/10 joined · Lajpat Nagar</div>
              <button style={{
                marginTop: 8, fontSize: 11, fontWeight: 500, color: DT.c.info,
                background: 'transparent', border: `1px solid ${DT.c.info}`,
                padding: '6px 10px', borderRadius: 99,
              }}>Join existing instead</button>
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Auto-detected category</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { l: 'Electronics', a: true },
              { l: 'Smartphones' },
              { l: 'Apple' },
            ].map((c, i) => (
              <div key={i} style={{
                padding: '8px 12px', borderRadius: 99,
                background: c.a ? DT.c.ink : '#fff', color: c.a ? '#fff' : DT.c.ink,
                fontSize: 12, fontWeight: 500, letterSpacing: -0.1,
                border: c.a ? 'none' : `1px solid ${DT.c.line}`,
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                {c.l}{c.a && <Icon name="check" size={12} color="#fff" stroke={3}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Target & price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Target buyers</div>
            <div style={{ background: DT.c.surfaceWarm, borderRadius: 14, padding: 14, border: `1px solid ${DT.c.line}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.6 }}>10</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: DT.c.muted }}>people</span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ flex: 1, height: 4, background: DT.c.line, borderRadius: 2 }}>
                  <div style={{ width: '40%', height: '100%', background: DT.c.primary, borderRadius: 2 }}/>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Target price</div>
            <div style={{ background: DT.c.surfaceWarm, borderRadius: 14, padding: 14, border: `1px solid ${DT.c.line}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: DT.c.ink }}>₹</span>
                <span style={{ fontSize: 22, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.4 }}>1,19,900</span>
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.saving, marginTop: 6 }}>↓ ₹10,000 vs MRP</div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: DT.c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Location</div>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '14px 16px',
            border: `1px solid ${DT.c.line}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Icon name="pin" size={18} color={DT.c.primary} stroke={2.4} fill={DT.c.primary}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: DT.c.ink }}>Lajpat Nagar, Delhi</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: DT.c.faint, marginTop: 1 }}>Radius: 5 km · 12,400 users</div>
            </div>
            <Icon name="chevR" size={16} color={DT.c.faint} stroke={2.4}/>
          </div>
        </div>
      </div>

      {/* sticky CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 20px 30px', background: 'rgba(250,247,242,0.92)',
        backdropFilter: 'blur(20px)', borderTop: `1px solid ${DT.c.line}`,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <Btn variant="soft" size="lg">Back</Btn>
        <Btn variant="primary" size="lg" iconRight={<Icon name="arrowR" size={18} color="#fff" stroke={2.4}/>} style={{ flex: 1 }}>
          Review & launch
        </Btn>
      </div>
    </div>
  </PhoneShell>
);

window.GroupScreens = { ScreenGroupDetail, ScreenGroupChat, ScreenCreateGroup };
