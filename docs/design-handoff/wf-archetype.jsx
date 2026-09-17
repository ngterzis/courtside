// Archetype detail — 3 directions
// A: Trading card (big character art vibe, stat profile on back)
// B: Radar chart profile (analyst view)
// C: "Receipt" / how-you-earned-it breakdown

// ── A: Trading card ──
const ArchetypeCardMobile = () => (
  <div style={{ height: '100%', padding: 16, background: WK.paperDeep, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
    <Row style={{ justifyContent: 'space-between' }}>
      <div style={{ fontSize: 14 }}>←</div>
      <div className="wk-label">Your Role</div>
      <div style={{ fontSize: 14 }}>⋯</div>
    </Row>

    {/* Card */}
    <div style={{
      border: `2px solid ${WK.ink}`, borderRadius: 14, padding: 14,
      backgroundColor: WK.accent,
      backgroundImage: `linear-gradient(160deg, ${WK.accent} 0%, #6f2b80 100%)`,
      color: '#fff', position: 'relative', overflow: 'hidden',
    }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <div className="wk-label" style={{ color: 'rgba(255,255,255,.7)' }}>PRIMARY</div>
        <div className="wk-mono" style={{ fontSize: 10, opacity: .7 }}>#23 · G</div>
      </Row>
      <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>Playmaker</div>
      <div className="wk-ph" style={{ height: 130, marginTop: 10, background: 'rgba(255,255,255,.12)', border: '1.5px dashed rgba(255,255,255,.5)', color: 'rgba(255,255,255,.75)' }}>
        illustration · player-shaped silhouette dishing a pass
      </div>
      <hr style={{ border: 0, borderTop: '1px dashed rgba(255,255,255,.35)', margin: '12px 0' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[['5.3','AST/g'],['2.4','TOV/g'],['2.2','A/T']].map(([v,k])=>(
          <Col key={k} gap={0} style={{ alignItems: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{v}</div>
            <div className="wk-label" style={{ color: 'rgba(255,255,255,.7)', fontSize: 9 }}>{k}</div>
          </Col>
        ))}
      </div>
    </div>

    <Anno>trading-card energy</Anno>

    <div className="wk-box" style={{ padding: 14 }}>
      <div className="wk-label">Secondary</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>Efficient Scorer</div>
      <div style={{ fontSize: 11, color: WK.ink70, marginTop: 4 }}>TS 56% · PTS/FGA 1.14</div>
    </div>

    <div className="wk-box" style={{ padding: 14 }}>
      <div className="wk-label">AI says</div>
      <div style={{ fontFamily: WK.hand, fontSize: 17, lineHeight: 1.25, marginTop: 6 }}>
        "You drive offense without bleeding possessions — and you finish what you create."
      </div>
    </div>
  </div>
);

// ── B: Radar ──
const ArchetypeRadarMobile = () => (
  <div style={{ height: '100%', padding: 16, background: WK.paper, overflow: 'auto' }}>
    <Row style={{ justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ fontSize: 14 }}>←</div>
      <div className="wk-label">Your Role</div>
      <div style={{ fontSize: 14 }}>⋯</div>
    </Row>
    <div style={{ fontSize: 12, color: WK.ink70 }}>Primary</div>
    <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>Playmaker</div>
    <div style={{ fontSize: 13, color: WK.ink70 }}>+ Efficient Scorer</div>

    <div className="wk-box" style={{ padding: 14, marginTop: 14, display: 'flex', justifyContent: 'center' }}>
      <Radar size={240} values={[0.95, 0.7, 0.85, 0.75, 0.45, 0.65]} labels={['AST','STL','TS%','PTS','REB','3PT%']} />
    </div>
    <Anno style={{ marginTop: 6 }}>position-weighted percentiles</Anno>

    <div className="wk-box" style={{ padding: 14, marginTop: 12 }}>
      <div className="wk-label" style={{ marginBottom: 8 }}>Archetype scores</div>
      <Col gap={6}>
        {[['Playmaker',94],['Efficient Scorer',81],['Defensive Spec.',64],['Perimeter Scorer',42],['Rebounder',38]].map(([n,s],i)=>(
          <Row key={n} gap={8}>
            <div style={{ width: 120, fontSize: 11 }}>{n}</div>
            <div style={{ flex: 1, height: 8, background: WK.paperDeep, border: `1px solid ${WK.ink}`, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${s}%`, height: '100%', background: i<2?WK.accent:WK.ink }} />
            </div>
            <div className="wk-mono" style={{ fontSize: 10, width: 24, textAlign: 'right' }}>{s}</div>
          </Row>
        ))}
      </Col>
    </div>
  </div>
);

// ── C: Receipt / breakdown ──
const ArchetypeReceiptMobile = () => (
  <div style={{ height: '100%', padding: 16, background: WK.paper, overflow: 'auto', fontFamily: WK.sans }}>
    <Row style={{ justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ fontSize: 14 }}>←</div>
      <div className="wk-label">How you earned it</div>
      <div style={{ fontSize: 14 }}>⋯</div>
    </Row>

    <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>Playmaker</div>
    <div style={{ fontSize: 12, color: WK.ink70 }}>+ Efficient Scorer · updated today</div>

    <div style={{
      marginTop: 14, padding: 16,
      background: WK.paperDeep, border: `1.5px dashed ${WK.ink}`,
      borderRadius: 8, fontFamily: WK.mono, fontSize: 11, lineHeight: 1.9,
    }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <span>─── RECEIPT ───</span><span>#23 · G</span>
      </Row>
      <hr className="wk-divider-dash" style={{ margin: '6px 0' }} />
      <Row style={{ justifyContent: 'space-between' }}><span>AST (91st pctl.)</span><span>× 0.9 guard</span></Row>
      <Row style={{ justifyContent: 'space-between' }}><span>AST/TO 2.2</span><span>+ bonus</span></Row>
      <Row style={{ justifyContent: 'space-between' }}><span>TOV (low, 28th)</span><span>+ bonus</span></Row>
      <Row style={{ justifyContent: 'space-between' }}><span>TS% 56</span><span>above avg</span></Row>
      <hr className="wk-divider-dash" style={{ margin: '6px 0' }} />
      <Row style={{ justifyContent: 'space-between', fontWeight: 700 }}>
        <span>PLAYMAKER SCORE</span><span style={{ color: WK.accent }}>94 ★</span>
      </Row>
      <Row style={{ justifyContent: 'space-between' }}>
        <span>EFFICIENT SCORER</span><span>81</span>
      </Row>
      <hr className="wk-divider-dash" style={{ margin: '6px 0' }} />
      <div style={{ textAlign: 'center', color: WK.ink70 }}>— passes 60th-pctl gate —</div>
    </div>

    <div className="wk-box" style={{ padding: 14, marginTop: 12 }}>
      <div className="wk-label">What this means</div>
      <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 6 }}>
        You're the team's engine — a lot of your value is creating shots for others
        without coughing the ball up. AST/TO ratio is your signature stat.
      </div>
      <Row gap={8} style={{ marginTop: 10 }}>
        <button className="wk-btn" style={{ fontSize: 11, padding: '6px 12px' }}>See all archetypes</button>
        <button className="wk-btn" style={{ fontSize: 11, padding: '6px 12px' }}>Ask AI</button>
      </Row>
    </div>
    <Anno style={{ marginTop: 8 }}>transparent · audit-feel</Anno>
  </div>
);

// Desktop — shows all 3 directions side-by-side compactly
const ArchetypeDesktop = () => (
  <div style={{ height: '100%', padding: 20, background: WK.paper, overflow: 'auto' }}>
    <Row style={{ justifyContent: 'space-between', marginBottom: 14 }}>
      <Col gap={2}>
        <div className="wk-label">Your Role</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Playmaker <span style={{ color: WK.ink70, fontWeight: 400, fontSize: 16 }}>/ Efficient Scorer</span></div>
      </Col>
      <Row gap={8}>
        <span className="wk-chip">Spring '26</span>
        <span className="wk-chip wk-chip-soft">★ evolving</span>
      </Row>
    </Row>

    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 14 }}>
      {/* Hero card */}
      <div style={{ border: `2px solid ${WK.ink}`, borderRadius: 14, padding: 18, background: WK.accent, color: '#fff' }}>
        <div className="wk-label" style={{ color: 'rgba(255,255,255,.7)' }}>PRIMARY</div>
        <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>Playmaker</div>
        <div className="wk-ph" style={{ height: 150, marginTop: 12, background: 'rgba(255,255,255,.12)', border: '1.5px dashed rgba(255,255,255,.5)', color: 'rgba(255,255,255,.75)' }}>
          illustration
        </div>
        <div style={{ fontFamily: WK.hand, fontSize: 18, lineHeight: 1.25, marginTop: 12 }}>
          "You drive offense without bleeding possessions."
        </div>
      </div>

      {/* Radar */}
      <div className="wk-box" style={{ padding: 16 }}>
        <div className="wk-label" style={{ marginBottom: 8 }}>Your profile</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Radar size={220} values={[0.95, 0.7, 0.85, 0.75, 0.45, 0.65]} labels={['AST','STL','TS%','PTS','REB','3PT%']} />
        </div>
      </div>

      {/* Receipt */}
      <div className="wk-box" style={{ padding: 16 }}>
        <div className="wk-label" style={{ marginBottom: 8 }}>How you earned it</div>
        <div style={{ fontFamily: WK.mono, fontSize: 11, lineHeight: 1.8 }}>
          AST 91st pctl · 0.9x guard<br/>
          AST/TO 2.2 · + bonus<br/>
          TOV low 28th · + bonus<br/>
          TS% 56 · above avg<br/>
          <hr className="wk-divider-dash" style={{ margin: '6px 0' }} />
          <Row style={{ justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Playmaker</span><span style={{ color: WK.accent }}>94 ★</span>
          </Row>
          <Row style={{ justifyContent: 'space-between' }}>
            <span>Eff. Scorer</span><span>81</span>
          </Row>
          <Row style={{ justifyContent: 'space-between', color: WK.ink50 }}>
            <span>Def. Spec.</span><span>64</span>
          </Row>
        </div>
      </div>
    </div>

    <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
      <div className="wk-box" style={{ padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>AI description</div>
        <div style={{ fontSize: 13, lineHeight: 1.5 }}>
          You drive the offense cleanly — 5.3 AST with just 2.4 TOV/game (2.2 A/T ratio,
          best on the team for your position) and you finish what you create at a TS% of 56.
          Your secondary archetype, <b>Efficient Scorer</b>, reflects your points-per-shot
          efficiency despite a guard-typical shot volume.
        </div>
        <div style={{ fontSize: 10, color: WK.ink70, marginTop: 10 }}>
          regenerated when archetype changes · pinned model claude-sonnet-4
        </div>
      </div>
      <div className="wk-box" style={{ padding: 16 }}>
        <div className="wk-label" style={{ marginBottom: 8 }}>All 8 archetypes</div>
        <div style={{ fontSize: 11, lineHeight: 1.9 }}>
          Inside Scorer · Perimeter Scorer<br/>
          <b>Efficient Scorer</b> · High-Volume Scorer<br/>
          <b style={{ color: WK.accent }}>Playmaker</b> · Rebounder<br/>
          Defensive Specialist · Glue Guy
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { ArchetypeCardMobile, ArchetypeRadarMobile, ArchetypeReceiptMobile, ArchetypeDesktop });
