// Login / onboarding wireframes

// ── Mobile A: Split welcome + sign-in ──
const LoginMobileA = () => (
  <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ height: 180, position: 'relative', marginBottom: 12 }}>
      <div className="wk-ph" style={{ height: '100%' }}>hero art · team photo</div>
      <Anno style={{ position: 'absolute', top: -6, right: -4 }}>hero ↘</Anno>
    </div>
    <div className="wk-hand" style={{ fontSize: 34, lineHeight: 1, marginBottom: 4 }}>courtside.</div>
    <div style={{ fontSize: 13, color: WK.ink70, marginBottom: 20 }}>Your stats. Your story. Every game.</div>

    <Col gap={10}>
      <div className="wk-label">Email</div>
      <div className="wk-box" style={{ height: 40, padding: '0 12px', display: 'flex', alignItems: 'center', fontSize: 12, color: WK.ink50 }} className="wk-box">
        <div className="wk-mono" style={{ fontSize: 11, color: WK.ink50 }}>you@team.com</div>
      </div>
      <div className="wk-label">Password</div>
      <div className="wk-box" style={{ height: 40, padding: '0 12px', display: 'flex', alignItems: 'center' }}>
        <div className="wk-mono" style={{ fontSize: 12, letterSpacing: 2 }}>••••••••</div>
      </div>
    </Col>

    <div style={{ marginTop: 16 }}>
      <button className="wk-btn wk-btn-primary" style={{ width: '100%', height: 44, borderRadius: 10 }}>Sign in</button>
    </div>
    <div style={{ textAlign: 'center', fontSize: 11, color: WK.ink70, marginTop: 14 }}>
      Forgot password? · New here? <span className="wk-underline">Ask your coach</span>
    </div>
  </div>
);

// ── Mobile B: Full-bleed role picker (first-run) ──
const OnboardRolePick = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 18 }}>
    <div className="wk-hand" style={{ fontSize: 28, lineHeight: 1 }}>Welcome to the team.</div>
    <div style={{ fontSize: 12, color: WK.ink70, marginTop: 6, marginBottom: 20 }}>
      Pick your jersey number so we know it's you.
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {[3, 7, 11, 14, 22, 23, 24, 31, 42].map(n => (
        <div key={n} className="wk-box" style={{
          aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 700,
          ...(n === 23 ? { background: WK.accent, color: '#fff' } : {}),
        }}>{n}</div>
      ))}
    </div>

    <Anno style={{ marginTop: 12 }}>
      <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 13l3 3 7-7" stroke={WK.accent} strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
      admin pre-populates
    </Anno>

    <div style={{ flex: 1 }} />
    <Row gap={10}>
      <button className="wk-btn" style={{ flex: 1 }}>Back</button>
      <button className="wk-btn wk-btn-primary" style={{ flex: 2 }}>Continue →</button>
    </Row>
  </div>
);

// ── Mobile C: Position + confirm ──
const OnboardProfile = () => (
  <div style={{ height: '100%', padding: 18, display: 'flex', flexDirection: 'column' }}>
    <Row gap={10} style={{ marginBottom: 16 }}>
      <div style={{ width: 40, height: 6, background: WK.accent, borderRadius: 999 }} />
      <div style={{ width: 40, height: 6, background: WK.accent, borderRadius: 999 }} />
      <div style={{ width: 40, height: 6, background: WK.ink15, borderRadius: 999 }} />
    </Row>
    <div className="wk-hand" style={{ fontSize: 26, lineHeight: 1.1 }}>Tell us where you play.</div>
    <div style={{ fontSize: 12, color: WK.ink70, marginTop: 4, marginBottom: 18 }}>
      Position helps us weight your role fairly.
    </div>

    <Col gap={10}>
      {[
        ['Guard', 'quick, shoots from outside'],
        ['Forward', 'does a bit of everything'],
        ['Center', 'lives in the paint'],
      ].map(([name, desc], i) => (
        <div key={name} className="wk-box" style={{
          padding: 14, display: 'flex', alignItems: 'center', gap: 12,
          ...(i === 0 ? { borderColor: WK.accent, borderWidth: 2, background: WK.accentSoft } : {}),
        }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${WK.ink}`,
            background: i === 0 ? WK.accent : 'transparent' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
            <div style={{ fontSize: 11, color: WK.ink70 }}>{desc}</div>
          </div>
        </div>
      ))}
    </Col>

    <div style={{ flex: 1 }} />
    <button className="wk-btn wk-btn-primary" style={{ width: '100%', height: 44, borderRadius: 10 }}>Finish setup</button>
  </div>
);

// ── Desktop login ──
const LoginDesktop = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', height: '100%' }}>
    <div style={{ background: WK.paperDeep, borderRight: `1.5px solid ${WK.ink}`, padding: 40, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="wk-hand" style={{ fontSize: 42, lineHeight: 1 }}>courtside.</div>
        <div style={{ fontSize: 13, color: WK.ink70, marginTop: 6 }}>Rec-league stats · one team · every game.</div>
      </div>

      <div className="wk-ph" style={{ height: 240, fontSize: 12 }}>court / team photo</div>

      <div className="wk-box" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: WK.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flex: '0 0 auto' }}>JR</div>
        <div>
          <div style={{ fontSize: 12, lineHeight: 1.4 }}>
            "Finally I can see my own numbers instead of guessing."
          </div>
          <div style={{ fontSize: 11, color: WK.ink70, marginTop: 4 }}>— player testimonial placeholder</div>
        </div>
      </div>
    </div>

    <div style={{ padding: '72px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="wk-label" style={{ marginBottom: 8 }}>Sign in</div>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 28 }}>Welcome back.</div>

      <Col gap={14}>
        <Col gap={6}>
          <div className="wk-label">Email</div>
          <div className="wk-box" style={{ height: 40, padding: '0 12px', display: 'flex', alignItems: 'center' }}>
            <div className="wk-mono" style={{ fontSize: 12, color: WK.ink50 }}>you@team.com</div>
          </div>
        </Col>
        <Col gap={6}>
          <Row style={{ justifyContent: 'space-between' }}>
            <div className="wk-label">Password</div>
            <div style={{ fontSize: 11, color: WK.accent }}>Forgot?</div>
          </Row>
          <div className="wk-box" style={{ height: 40, padding: '0 12px', display: 'flex', alignItems: 'center' }}>
            <div className="wk-mono" style={{ fontSize: 12, letterSpacing: 2 }}>••••••••</div>
          </div>
        </Col>
        <Row gap={8} style={{ fontSize: 11, color: WK.ink70 }}>
          <div style={{ width: 14, height: 14, border: `1.5px solid ${WK.ink}`, borderRadius: 3 }} />
          Keep me signed in on this device
        </Row>
        <button className="wk-btn wk-btn-primary" style={{ height: 44, borderRadius: 10 }}>Sign in →</button>
      </Col>

      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 11, color: WK.ink70, marginTop: 28, borderTop: `1px dashed ${WK.ink30}`, paddingTop: 14 }}>
        Only team members have access. Need an account? <span className="wk-underline">Ask your coach or admin.</span>
      </div>
    </div>
  </div>
);

Object.assign(window, { LoginMobileA, OnboardRolePick, OnboardProfile, LoginDesktop });
