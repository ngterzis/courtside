// Archetype detail — COMBINED (A+B+C stacked) using purple primary, orange accent

const ArchetypeCombinedMobile = () => (
  <div style={{ height: '100%', background: WK.paper, overflow: 'auto' }}>
    {/* Header */}
    <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: 14 }}>←</div>
      <div className="wk-label">Your Role</div>
      <div style={{ fontSize: 14 }}>⋯</div>
    </div>

    {/* A — Trading card hero */}
    <div style={{ padding: '0 16px 14px' }}>
      <div style={{
        border: `2px solid ${WK.ink}`, borderRadius: 14, padding: 14, color: '#fff',
        backgroundColor: WK.accent,
        backgroundImage: `linear-gradient(160deg, ${WK.accent} 0%, #6f2b80 100%)`,
      }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
          <div className="wk-label" style={{ color: 'rgba(255,255,255,.7)' }}>PRIMARY</div>
          <div className="wk-mono" style={{ fontSize: 10, opacity: .7 }}>#23 · G</div>
        </Row>
        <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>Playmaker</div>
        <div style={{ fontSize: 13, opacity: .85, marginTop: 2 }}>+ Efficient Scorer</div>
        <div className="wk-ph" style={{ height: 110, marginTop: 10, backgroundColor: 'rgba(255,255,255,.12)', backgroundImage: 'none', border: '1.5px dashed rgba(255,255,255,.5)', color: 'rgba(255,255,255,.75)' }}>
          illustration
        </div>
        <hr style={{ border: 0, borderTop: '1px dashed rgba(255,255,255,.35)', margin: '12px 0' }} />
        <div style={{ fontFamily: WK.hand, fontSize: 16, lineHeight: 1.25 }}>
          "You drive offense without bleeding possessions — and you finish what you create."
        </div>
      </div>
    </div>

    {/* B — Radar + scores */}
    <div style={{ padding: '0 16px 14px' }}>
      <div className="wk-label" style={{ marginBottom: 6 }}>Your profile · shape of your game</div>
      <div className="wk-box" style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Radar size={200} values={[0.95, 0.7, 0.85, 0.75, 0.45, 0.65]} labels={['AST','STL','TS%','PTS','REB','3PT%']} />
        </div>
        <hr className="wk-divider-dash" style={{ margin: '12px 0' }} />
        <Col gap={6}>
          {[['Playmaker',94,true],['Efficient Scorer',81,true],['Defensive Spec.',64],['Perimeter Scorer',42],['Rebounder',38]].map(([n,s,top],i) => (
            <Row key={n} gap={8}>
              <div style={{ width: 120, fontSize: 11, fontWeight: top ? 600 : 400 }}>{n}</div>
              <div style={{ flex: 1, height: 8, background: WK.paperDeep, border: `1px solid ${WK.ink}`, borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${s}%`, height: '100%', background: top ? WK.accent : WK.ink }} />
              </div>
              <div className="wk-mono" style={{ fontSize: 10, width: 24, textAlign: 'right' }}>{s}</div>
            </Row>
          ))}
        </Col>
      </div>
    </div>

    {/* C — Receipt drawer */}
    <div style={{ padding: '0 16px 20px' }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <div className="wk-label">How you earned it</div>
        <div style={{ fontSize: 11, color: WK.accent2, fontWeight: 600 }}>▾ expand</div>
      </Row>
      <div style={{
        padding: 14, background: WK.paperDeep, border: `1.5px dashed ${WK.ink}`,
        borderRadius: 8, fontFamily: WK.mono, fontSize: 11, lineHeight: 1.9,
      }}>
        <Row style={{ justifyContent: 'space-between' }}><span>─── RECEIPT ───</span><span>#23</span></Row>
        <hr className="wk-divider-dash" style={{ margin: '4px 0' }} />
        <Row style={{ justifyContent: 'space-between' }}><span>AST 91st pctl.</span><span>× 0.9 guard</span></Row>
        <Row style={{ justifyContent: 'space-between' }}><span>AST/TO 2.2</span><span>+ bonus</span></Row>
        <Row style={{ justifyContent: 'space-between' }}><span>TOV low 28th</span><span>+ bonus</span></Row>
        <Row style={{ justifyContent: 'space-between' }}><span>TS% 56</span><span>above avg</span></Row>
        <hr className="wk-divider-dash" style={{ margin: '4px 0' }} />
        <Row style={{ justifyContent: 'space-between', fontWeight: 700 }}>
          <span>PLAYMAKER</span><span style={{ color: WK.accent }}>94 ★</span>
        </Row>
        <Row style={{ justifyContent: 'space-between' }}>
          <span>EFFICIENT SCORER</span><span>81</span>
        </Row>
      </div>

      <Row gap={8} style={{ marginTop: 12 }}>
        <button className="wk-btn" style={{ fontSize: 11, padding: '8px 12px', flex: 1 }}>See all 8 archetypes</button>
        <button className="wk-btn" style={{ fontSize: 11, padding: '8px 12px', flex: 1, background: WK.accent2, color: '#fff', borderColor: WK.ink }}>Ask AI why</button>
      </Row>
      <Anno style={{ marginTop: 10 }}>A → B → C in one scroll</Anno>
    </div>
  </div>
);

Object.assign(window, { ArchetypeCombinedMobile });
