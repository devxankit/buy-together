// Auth flow — Heritage Modern

// ────────────────────────────────────────────────────────────────
// 1) ONBOARDING
// ────────────────────────────────────────────────────────────────
const ScreenOnboarding = () => (
  <PhoneShell bg={DT.c.surfaceInk}>
    <IOSStatusBar dark />
    <div style={{ flex: 1, padding: '20px 26px 32px', display: 'flex', flexDirection: 'column', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* warm radial glows */}
      <div style={{
        position: 'absolute', top: -160, right: -120, width: 460, height: 460, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,93,79,0.55), transparent 65%)',
      }} />
      <div style={{
        position: 'absolute', bottom: -140, left: -100, width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,131,65,0.18), transparent 70%)',
      }} />

      {/* top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: DT.c.primary,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: DT.s.glow,
          }}><Icon name="users" size={16} color="#fff" stroke={2}/></div>
          <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: -0.2 }}>buytogether</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.2 }}>Skip</span>
      </div>

      {/* layered cards */}
      <div style={{ flex: 1, position: 'relative', marginTop: 36, zIndex: 2 }}>
        <div style={{
          position: 'absolute', left: 14, top: 0, transform: 'rotate(-5deg)',
          width: 210, padding: 16, borderRadius: 18,
          background: DT.c.surfaceWarm, color: DT.c.ink, boxShadow: DT.s.xl,
          border: `1px solid ${DT.c.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, background: DT.c.surfaceAlt,
              border: `1px solid ${DT.c.line}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><ProductGlyph kind="phone" size={26} tone={DT.c.inkSoft}/></div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 500 }}>iPhone 16 Pro</div>
              <div style={{ fontSize: 10, fontWeight: 400, color: DT.c.muted, fontFamily: DT.f.mono, marginTop: 1 }}>7 / 10 joined</div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}><Progress value={7} total={10} height={3}/></div>
        </div>

        <div style={{
          position: 'absolute', right: 8, top: 110, transform: 'rotate(4deg)',
          width: 190, padding: 16, borderRadius: 18,
          background: DT.c.surfaceWarm, color: DT.c.ink, boxShadow: DT.s.xl,
          border: `1px solid ${DT.c.line}`,
        }}>
          <Chip tone="saving" size="xs">↓ ₹10,000</Chip>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 8, letterSpacing: -0.2 }}>Sony PS5 group</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <AvatarStack count={3} more={1} size={20} />
            <span style={{ fontSize: 10, fontWeight: 500, color: DT.c.muted, fontFamily: DT.f.mono }}>4 / 6</span>
          </div>
        </div>

        <div style={{
          position: 'absolute', left: 28, bottom: 24,
          padding: '11px 14px', borderRadius: 14,
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar seed={3} size={22}/>
          <span style={{ fontSize: 11.5, fontWeight: 400, color: '#fff' }}>Rahul just saved <span style={{ color: DT.c.primarySoft, fontWeight: 500, fontFamily: DT.f.mono }}>₹8,400</span></span>
        </div>
      </div>

      {/* tagline + CTA */}
      <div style={{ zIndex: 2, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, height: 1, background: DT.c.primarySoft }}/>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: DT.c.primarySoft }}>One of three</div>
        </div>
        <div style={{
          fontSize: 38, fontWeight: 400, lineHeight: 1.0, letterSpacing: -1.4, marginTop: 16,
          color: '#fff',
        }}>
          Buy alone,<br/>
          <Serif style={{ color: 'rgba(255,255,255,0.65)' }}>pay full price.</Serif>
        </div>
        <div style={{
          fontSize: 38, fontWeight: 400, lineHeight: 1.0, letterSpacing: -1.4, marginTop: 4,
        }}>
          Buy <Serif style={{ color: DT.c.primarySoft }}>together,</Serif><br/>save 22%.
        </div>
        <div style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.62)', marginTop: 16, lineHeight: 1.5, maxWidth: 320 }}>
          Join real buyer groups for anything from phones to flats. The group hits target, the vendor drops the price.
        </div>

        {/* dots */}
        <div style={{ display: 'flex', gap: 6, marginTop: 22 }}>
          <div style={{ width: 24, height: 3, borderRadius: 2, background: DT.c.primarySoft }}/>
          <div style={{ width: 3, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }}/>
          <div style={{ width: 3, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }}/>
        </div>

        <div style={{ marginTop: 20 }}>
          <Btn variant="primary" size="lg" full iconRight={<Icon name="arrowR" size={16} color="#fff" stroke={2}/>}>Get started</Btn>
        </div>
      </div>
    </div>
  </PhoneShell>
);

// ────────────────────────────────────────────────────────────────
// 2) LOGIN
// ────────────────────────────────────────────────────────────────
const ScreenLogin = () => (
  <PhoneShell bg={DT.c.surfaceAlt}>
    <IOSStatusBar />
    <div style={{ flex: 1, padding: '12px 26px 32px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={{
          width: 40, height: 40, borderRadius: 12, background: DT.c.surfaceWarm,
          border: `1px solid ${DT.c.line}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="arrowL" size={18} color={DT.c.ink} stroke={1.8}/></button>
        <span style={{ fontSize: 12, fontWeight: 400, color: DT.c.muted }}>Need help?</span>
      </div>

      <div style={{ marginTop: 36 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 99, background: DT.c.primarySoft,
          border: `1px solid ${DT.c.primary}22`,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: DT.c.primary }}/>
          <span style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.primaryDeep, letterSpacing: 1.4, textTransform: 'uppercase' }}>50,000+ buyers</span>
        </div>
        <div style={{ fontSize: 42, fontWeight: 400, letterSpacing: -1.4, lineHeight: 1.0, color: DT.c.ink, marginTop: 20 }}>
          Welcome<br/>
          <Serif style={{ color: DT.c.primary }}>back, friend.</Serif>
        </div>
        <div style={{ fontSize: 14, fontWeight: 400, color: DT.c.muted, marginTop: 12 }}>
          Sign in with your mobile number to continue saving together.
        </div>
      </div>

      {/* role toggle */}
      <div style={{
        marginTop: 28, padding: 4, background: DT.c.surfaceDeep,
        borderRadius: 14, display: 'flex', gap: 4,
      }}>
        <div style={{
          flex: 1, padding: '11px 0', borderRadius: 10, background: DT.c.surface,
          textAlign: 'center', boxShadow: DT.s.sm,
          fontSize: 13, fontWeight: 500, color: DT.c.ink, letterSpacing: -0.1,
        }}>I'm a buyer</div>
        <div style={{
          flex: 1, padding: '11px 0', borderRadius: 10, textAlign: 'center',
          fontSize: 13, fontWeight: 400, color: DT.c.muted, letterSpacing: -0.1,
        }}>I'm a vendor</div>
      </div>

      {/* form */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: DT.c.muted, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 }}>Mobile number</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            border: `1.5px solid ${DT.c.primary}`, borderRadius: 14,
            padding: '14px 16px', background: DT.c.surface,
            boxShadow: `0 0 0 4px ${DT.c.primaryGlow}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>🇮🇳</span>
              <span style={{ fontSize: 13.5, fontWeight: 500, color: DT.c.ink, fontFamily: DT.f.mono }}>+91</span>
              <Icon name="chevD" size={12} color={DT.c.faint} stroke={2}/>
            </div>
            <div style={{ height: 22, width: 1, background: DT.c.line }} />
            <span style={{ flex: 1, fontSize: 16, fontWeight: 500, color: DT.c.ink, letterSpacing: 0.5, fontFamily: DT.f.mono }}>98765 43210</span>
            <Icon name="check" size={18} color={DT.c.primary} stroke={2.4}/>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: DT.c.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <Icon name="check" size={11} color="#fff" stroke={3}/>
          </div>
          <span style={{ fontSize: 12, fontWeight: 400, color: DT.c.muted, lineHeight: 1.45 }}>
            I agree to the <span style={{ color: DT.c.ink, fontWeight: 500 }}>Terms</span> and <span style={{ color: DT.c.ink, fontWeight: 500 }}>Privacy Policy</span>. I consent to receive WhatsApp updates.
          </span>
        </label>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
        <Btn variant="primary" size="lg" full iconRight={<Icon name="arrowR" size={16} color="#fff" stroke={2}/>}>Send OTP</Btn>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: DT.c.line }} />
          <span style={{ fontSize: 10, fontWeight: 500, color: DT.c.muted, letterSpacing: 1.8, textTransform: 'uppercase' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: DT.c.line }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ flex: 1, height: 48, borderRadius: 12, background: DT.c.surface, border: `1px solid ${DT.c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 500, fontSize: 13, color: DT.c.ink, fontFamily: DT.f.sans }}>
            Google
          </button>
          <button style={{ flex: 1, height: 48, borderRadius: 12, background: DT.c.ink, color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 500, fontSize: 13, fontFamily: DT.f.sans }}>
            Apple
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 400, color: DT.c.muted, marginTop: 4 }}>
          New here? <span style={{ color: DT.c.primary, fontWeight: 500 }}>Create an account</span>
        </div>
      </div>
    </div>
  </PhoneShell>
);

// ────────────────────────────────────────────────────────────────
// 3) OTP
// ────────────────────────────────────────────────────────────────
const ScreenOTP = () => {
  const digits = [4, 8, 2, 1, '', ''];
  return (
    <PhoneShell bg={DT.c.surfaceAlt}>
      <IOSStatusBar />
      <div style={{ flex: 1, padding: '12px 26px 32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{
            width: 40, height: 40, borderRadius: 12, background: DT.c.surfaceWarm,
            border: `1px solid ${DT.c.line}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="arrowL" size={18} color={DT.c.ink} stroke={1.8}/></button>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 22, height: 3, background: DT.c.primary, borderRadius: 2 }}/>
            <div style={{ width: 22, height: 3, background: DT.c.primary, borderRadius: 2 }}/>
            <div style={{ width: 22, height: 3, background: DT.c.line, borderRadius: 2 }}/>
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: DT.c.primarySoft,
            border: `1px solid ${DT.c.primary}33`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="shield" size={24} color={DT.c.primary} stroke={1.8} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 400, letterSpacing: -1.2, lineHeight: 1.05, marginTop: 20, color: DT.c.ink }}>
            Verify it's<br/>
            <Serif style={{ color: DT.c.primary }}>really you.</Serif>
          </div>
          <div style={{ fontSize: 14, fontWeight: 400, color: DT.c.muted, marginTop: 12, lineHeight: 1.5 }}>
            We've sent a 6-digit code to <span style={{ color: DT.c.ink, fontWeight: 500, fontFamily: DT.f.mono }}>+91 98765 43210</span>. <span style={{ color: DT.c.primary, fontWeight: 500 }}>Change number</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              flex: 1, height: 66, borderRadius: 14,
              background: d !== '' ? DT.c.surface : DT.c.surfaceWarm,
              border: `1.5px solid ${i === 4 ? DT.c.primary : (d !== '' ? DT.c.line : 'transparent')}`,
              boxShadow: i === 4 ? `0 0 0 4px ${DT.c.primaryGlow}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 500, color: DT.c.ink, fontFamily: DT.f.mono,
              letterSpacing: -1,
            }}>
              {d}
              {i === 4 && <div style={{ width: 2, height: 28, background: DT.c.primary, animation: 'blink 1s infinite' }}/>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12.5, fontWeight: 400, color: DT.c.muted }}>Didn't get it?</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="clock" size={13} color={DT.c.faint} stroke={1.8}/>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: DT.c.muted, fontFamily: DT.f.mono }}>Resend in 0:24</span>
          </div>
        </div>

        <div style={{
          marginTop: 22, padding: 14, borderRadius: 14,
          background: DT.c.primarySoft,
          border: `1px solid ${DT.c.primary}22`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: DT.c.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={17} color="#fff" stroke={2.6}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: DT.c.ink }}>SMS detected · auto-filling</div>
            <div style={{ fontSize: 11, fontWeight: 400, color: DT.c.muted, marginTop: 2 }}>From DM-BUYTGR · 2 sec ago</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <Btn variant="primary" size="lg" full iconRight={<Icon name="arrowR" size={16} color="#fff" stroke={2}/>}>Verify & continue</Btn>
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11.5, fontWeight: 400, color: DT.c.muted, display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
          <Icon name="lock" size={11} color={DT.c.muted} stroke={1.8}/>
          Secure · end-to-end encrypted
        </div>
      </div>
    </PhoneShell>
  );
};

// ────────────────────────────────────────────────────────────────
// 4) LOCATION
// ────────────────────────────────────────────────────────────────
const ScreenLocation = () => (
  <PhoneShell bg={DT.c.surfaceAlt}>
    <IOSStatusBar />
    <div style={{ flex: 1, padding: '12px 0 32px', display: 'flex', flexDirection: 'column' }}>
      {/* visual area */}
      <div style={{
        margin: '12px 26px 0', borderRadius: 24, overflow: 'hidden',
        background: DT.c.surfaceWarm,
        position: 'relative', height: 360, border: `1px solid ${DT.c.line}`,
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.45 }}>
          <defs>
            <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(40,30,15,0.07)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <path d="M -20 280 Q 120 220 180 200 T 360 90" stroke="rgba(40,30,15,0.08)" strokeWidth="22" fill="none" strokeLinecap="round"/>
          <path d="M 40 -10 Q 80 80 140 130 T 280 220 T 380 280" stroke="rgba(26,93,79,0.18)" strokeWidth="12" fill="none" strokeLinecap="round"/>
        </svg>

        {[
          { top: 60, left: 50, label: '3 groups', tone: 'ink' },
          { top: 200, left: 230, label: 'Vendor', tone: 'gold' },
          { top: 250, left: 90, label: '+7', tone: 'soft' },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', top: p.top, left: p.left,
            padding: '6px 12px 6px 6px', borderRadius: 99,
            background: p.tone === 'ink' ? DT.c.ink : (p.tone === 'gold' ? DT.c.primary : DT.c.surface),
            color: p.tone === 'soft' ? DT.c.ink : '#fff',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: DT.s.lg, fontSize: 11, fontWeight: 500,
            border: p.tone === 'soft' ? `1px solid ${DT.c.line}` : 'none',
          }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="pin" size={11} color={p.tone === 'soft' ? DT.c.ink : '#fff'} stroke={2}/>
            </div>
            {p.label}
          </div>
        ))}

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div style={{
            position: 'absolute', inset: -36, borderRadius: '50%',
            background: 'rgba(26,93,79,0.18)', animation: 'pulse 2.4s infinite',
          }} />
          <div style={{
            position: 'absolute', inset: -16, borderRadius: '50%',
            background: 'rgba(26,93,79,0.32)',
          }} />
          <div style={{
            position: 'relative', width: 56, height: 56, borderRadius: '50%',
            background: DT.c.primary, boxShadow: DT.s.glow,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid #fff',
          }}>
            <Icon name="pin" size={24} color="#fff" stroke={2} fill="#fff"/>
          </div>
        </div>
      </div>

      <div style={{ padding: '30px 26px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, height: 1, background: DT.c.primary }}/>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: DT.c.primary }}>One last thing</div>
        </div>
        <div style={{ fontSize: 34, fontWeight: 400, letterSpacing: -1.1, lineHeight: 1.0, marginTop: 14, color: DT.c.ink }}>
          Find groups<br/>buying <Serif style={{ color: DT.c.primary }}>near you.</Serif>
        </div>
        <div style={{ fontSize: 14, fontWeight: 400, color: DT.c.muted, marginTop: 14, lineHeight: 1.55, maxWidth: 320 }}>
          We use your area to show local buyer groups and vendor offers. Never shared, never sold.
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: '0 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Btn variant="primary" size="lg" full icon={<Icon name="pin" size={16} color="#fff" stroke={2}/>}>Use my location</Btn>
        <button style={{ background: 'transparent', border: 'none', fontSize: 13, fontWeight: 500, color: DT.c.muted, padding: 10, fontFamily: DT.f.sans }}>
          Enter pincode manually
        </button>
      </div>
    </div>
  </PhoneShell>
);

window.AuthScreens = { ScreenOnboarding, ScreenLogin, ScreenOTP, ScreenLocation };
