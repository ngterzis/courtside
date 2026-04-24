// AI chat — 2 variants, both FAB-entry

// ── A: Full-screen modal sheet, mostly conversational ──
const ChatSheetMobile = () => (
  <div style={{ height: '100%', background: WK.paperDeep, position: 'relative' }}>
    {/* Faded dashboard behind */}
    <div style={{ position: 'absolute', inset: 0, opacity: .25, pointerEvents: 'none' }}>
      <DashV1Mobile />
    </div>
    {/* Scrim */}
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(27,26,23,.4)' }} />
    {/* Sheet */}
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, top: 40,
      background: WK.paper, borderTop: `2px solid ${WK.ink}`,
      borderRadius: '18px 18px 0 0',
      padding: 14, display: 'flex', flexDirection: 'column',
    }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <Row gap={8}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: WK.accent, border: `1.5px solid ${WK.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>CA</div>
          <Col gap={0}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Courtside Agent</div>
            <div style={{ fontSize: 10, color: WK.ink70 }}>● answers about your stats</div>
          </Col>
        </Row>
        <div style={{ fontSize: 16 }}>×</div>
      </Row>
      <hr className="wk-divider-dash" style={{ margin: '6px -14px 10px' }} />

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', paddingRight: 2 }}>
        <div style={{ alignSelf: 'flex-start', maxWidth: '86%', padding: 10, border: `1.5px solid ${WK.ink}`, borderRadius: '10px 10px 10px 2px', background: WK.paper, fontSize: 12, marginBottom: 10 }}>
          Hey Jordan 👋 ask me anything about your Spring '26 numbers.
        </div>

        <div style={{ alignSelf: 'flex-end', marginLeft: 'auto', maxWidth: '82%', padding: 10, border: `1.5px solid ${WK.ink}`, background: WK.accent, color: '#fff', borderRadius: '10px 10px 2px 10px', fontSize: 12, marginBottom: 10 }}>
          How's my shooting this season?
        </div>

        <div style={{ maxWidth: '88%', padding: 10, border: `1.5px solid ${WK.ink}`, borderRadius: '10px 10px 10px 2px', background: WK.paper, fontSize: 12, marginBottom: 6, lineHeight: 1.4 }}>
          Trending up. Your True Shooting % has climbed from 40% (game 1) to 63% (last 2). That's comfortably above the team average of 52%.
          <div style={{ marginTop: 8, padding: 6, background: WK.paperDeep, borderRadius: 6 }}>
            <div className="wk-label" style={{ fontSize: 9 }}>TS% trend</div>
            <Spark data={[0.4,0.48,0.52,0.5,0.56,0.61,0.58,0.63]} width={220} height={28} accent />
          </div>
        </div>
        <Row gap={6} style={{ marginBottom: 10, fontSize: 10, color: WK.ink50 }}>
          <span>👍</span><span>👎</span><span style={{ marginLeft: 'auto' }} className="wk-mono">via get_season_averages()</span>
        </Row>

        <Anno>suggested follow-ups ↓</Anno>
        <Row gap={6} style={{ flexWrap: 'wrap', marginTop: 6 }}>
          {['What\'s my weakest area?', 'Explain TS%', 'AST vs team?'].map(t=>(
            <span key={t} className="wk-chip" style={{ fontSize: 10 }}>{t}</span>
          ))}
        </Row>
      </div>

      {/* Input */}
      <div style={{ border: `1.5px solid ${WK.ink}`, borderRadius: 999, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <div className="wk-mono" style={{ fontSize: 11, color: WK.ink50, flex: 1 }}>Ask about your stats…</div>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: WK.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>↑</div>
      </div>
    </div>
  </div>
);

// ── B: Inline chat-on-dashboard (hybrid) ──
const ChatInlineMobile = () => (
  <div style={{ height: '100%', background: WK.paper, overflow: 'hidden', position: 'relative' }}>
    <div style={{ padding: '12px 16px 80px', height: '100%', overflowY: 'auto' }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 14 }}>←</div>
        <div className="wk-label">Ask the Agent</div>
        <div style={{ fontSize: 14 }}>⋯</div>
      </Row>

      {/* Suggested cards — each is pre-contextualized */}
      <div className="wk-label" style={{ marginBottom: 6 }}>Based on your last game</div>
      <Col gap={8} style={{ marginBottom: 12 }}>
        {[
          ['How did I rack up 7 assists?', 'drill into passing patterns'],
          ['Why was this a personal best?', 'contributing factors'],
        ].map(([q, hint])=>(
          <div key={q} className="wk-box" style={{ padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{q}</div>
            <div style={{ fontSize: 10, color: WK.ink70, marginTop: 2 }}>{hint}</div>
          </div>
        ))}
      </Col>

      <div className="wk-label" style={{ marginBottom: 6 }}>Season questions</div>
      <Col gap={8} style={{ marginBottom: 12 }}>
        {[
          'How has my shooting improved?',
          'What\'s my weakest area?',
          'How do I compare to the team in assists?',
          'What does Playmaker mean for me?',
        ].map(q=>(
          <div key={q} className="wk-box-dashed" style={{ padding: 10, fontSize: 12 }}>{q}</div>
        ))}
      </Col>

      <Anno>suggested Qs on tap</Anno>

      {/* Persistent input */}
      <div style={{ border: `1.5px solid ${WK.ink}`, borderRadius: 10, padding: 10, marginTop: 12, background: WK.paperDeep }}>
        <div style={{ fontSize: 12, color: WK.ink50 }}>Or type your own question…</div>
        <Row style={{ justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="wk-btn wk-btn-primary" style={{ fontSize: 11, padding: '6px 14px' }}>Ask →</button>
        </Row>
      </div>

      <div className="wk-box" style={{ padding: 10, marginTop: 12, fontSize: 11, color: WK.ink70, lineHeight: 1.5 }}>
        <b>Guardrails:</b> teammates never named · no off-topic · no playing-time speculation.
      </div>
    </div>
    <BottomNav active="home" />
  </div>
);

// Desktop — chat as sidebar that can expand
const ChatDesktop = () => (
  <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 360px', background: WK.paper }}>
    {/* Main (dim) */}
    <div style={{ padding: 20, opacity: .55, pointerEvents: 'none', overflow: 'hidden' }}>
      <DashV1Desktop />
    </div>
    {/* Panel */}
    <div style={{ borderLeft: `1.5px solid ${WK.ink}`, display: 'flex', flexDirection: 'column', background: WK.paper }}>
      <Row style={{ padding: 14, borderBottom: `1.5px solid ${WK.ink}`, justifyContent: 'space-between', background: WK.paperDeep }}>
        <Row gap={8}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: WK.accent, border: `1.5px solid ${WK.ink}`, color: '#fff', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>CA</div>
          <Col gap={0}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Courtside Agent</div>
            <div style={{ fontSize: 10, color: WK.ink70 }}>● online</div>
          </Col>
        </Row>
        <Row gap={8} style={{ fontSize: 13, color: WK.ink70 }}>
          <span>⤢</span><span>×</span>
        </Row>
      </Row>

      <div style={{ flex: 1, padding: 14, overflow: 'auto' }}>
        <div style={{ padding: 10, border: `1.5px solid ${WK.ink}`, borderRadius: '10px 10px 10px 2px', fontSize: 12, marginBottom: 10 }}>
          Hey Jordan 👋 ask about your Spring '26 season.
        </div>
        <Row gap={6} style={{ flexWrap: 'wrap', marginBottom: 14 }}>
          {['Shooting trend?', 'Weakest area?', 'vs team in AST', 'What is Playmaker?'].map(t=>(
            <span key={t} className="wk-chip" style={{ fontSize: 10 }}>{t}</span>
          ))}
        </Row>

        <div style={{ marginLeft: 'auto', width: 'fit-content', padding: 10, border: `1.5px solid ${WK.ink}`, background: WK.accent, color: '#fff', borderRadius: '10px 10px 2px 10px', fontSize: 12, marginBottom: 10 }}>
          What's my weakest area?
        </div>
        <div style={{ padding: 10, border: `1.5px solid ${WK.ink}`, borderRadius: '10px 10px 10px 2px', fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>
          Your lowest percentile-rank stat right now is 3-point shooting — 37% on low volume. That's a growth area: a few more reps per game could turn this into a real weapon.
          <div style={{ marginTop: 8 }}>
            <RankBar label="3PT%" pct={38} value="growth area" />
          </div>
        </div>
        <div className="wk-mono" style={{ fontSize: 9, color: WK.ink50 }}>via get_team_percentiles()</div>
      </div>

      <div style={{ padding: 12, borderTop: `1.5px solid ${WK.ink}` }}>
        <div style={{ border: `1.5px solid ${WK.ink}`, borderRadius: 999, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="wk-mono" style={{ fontSize: 11, color: WK.ink50, flex: 1 }}>Ask about your stats…</div>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: WK.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>↑</div>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { ChatSheetMobile, ChatInlineMobile, ChatDesktop });
