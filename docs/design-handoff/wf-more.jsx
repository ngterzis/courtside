// Remaining player screens — V2 style (purple primary, orange secondary)
// Game log · Trends · Season switcher · Notifications

const pointsData2 = [8, 14, 11, 18, 9, 22, 16, 19];
const tsData2 = [40, 48, 52, 50, 56, 61, 58, 63];
const astData2 = [3, 5, 4, 6, 4, 7, 5, 8];
const tovData2 = [4, 3, 3, 2, 3, 2, 2, 1];
const rebData2 = [5, 7, 8, 6, 9, 10, 8, 11];

// ────────── Game Log (mobile) ──────────
const GameLogMobile = () => (
  <div style={{ height: '100%', background: WK.paper, overflow: 'hidden', position: 'relative' }}>
    <div style={{ padding: '12px 16px 80px', height: '100%', overflowY: 'auto' }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 14 }}>←</div>
        <div className="wk-label">Game Log</div>
        <div style={{ fontSize: 14 }}>⋯</div>
      </Row>

      <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>8 games</div>
      <div style={{ fontSize: 12, color: WK.ink70, marginTop: 2 }}>Spring '26 · 1 personal best</div>

      {/* Filter pills */}
      <Row gap={6} style={{ marginTop: 12, marginBottom: 12, overflowX: 'auto' }}>
        <span className="wk-chip wk-chip-accent">All</span>
        <span className="wk-chip">Home</span>
        <span className="wk-chip">Away</span>
        <span className="wk-chip">★ Best</span>
        <span className="wk-chip">W/L ▾</span>
      </Row>

      {/* Rows */}
      <Col gap={8}>
        {[
          { d: 'Apr 18', op: 'vs Ravens', ha: 'H', line: [22,9,7,2,0], fg: '64%', best: true },
          { d: 'Apr 11', op: '@ Hawks',  ha: 'A', line: [16,6,5,1,2], fg: '48%' },
          { d: 'Apr 4',  op: 'vs Kings', ha: 'H', line: [19,8,6,2,2], fg: '52%' },
          { d: 'Mar 28', op: '@ Jets',   ha: 'A', line: [9,7,3,0,3],  fg: '31%' },
          { d: 'Mar 21', op: 'vs Stars', ha: 'H', line: [18,10,4,3,2],fg: '55%' },
          { d: 'Mar 14', op: '@ Bears',  ha: 'A', line: [11,7,5,1,1], fg: '45%' },
        ].map((g, i) => (
          <div key={i} className="wk-box" style={{ padding: 12, background: g.best ? WK.accentSoft : WK.paper, borderColor: g.best ? WK.accent : WK.ink }}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
              <Col gap={1}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{g.op} {g.best && <span style={{ color: WK.accent2 }}>★</span>}</div>
                <div className="wk-mono" style={{ fontSize: 10, color: WK.ink70 }}>{g.d} · {g.ha}</div>
              </Col>
              <Col gap={0} style={{ alignItems: 'flex-end' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: g.best ? WK.accent : WK.ink }}>{g.line[0]}</div>
                <div className="wk-label" style={{ fontSize: 9 }}>PTS</div>
              </Col>
            </Row>
            <Row style={{ fontFamily: WK.mono, fontSize: 11, color: WK.ink70, gap: 14 }}>
              <span>{g.line[1]} REB</span>
              <span>{g.line[2]} AST</span>
              <span>{g.line[3]} STL</span>
              <span>{g.line[4]} TOV</span>
              <span>{g.fg} FG</span>
            </Row>
            {i === 0 && (
              <div style={{ marginTop: 10, padding: 8, borderTop: `1px dashed ${WK.ink30}`, fontFamily: WK.hand, fontSize: 14, color: WK.ink }}>
                Coach: "Best floor-general game all season."
              </div>
            )}
          </div>
        ))}
      </Col>
      <div style={{ textAlign: 'center', padding: 16, fontSize: 11, color: WK.ink70 }}>— end of season so far —</div>
    </div>
    <FAB />
    <BottomNav active="log" />
  </div>
);

// ────────── Trends (mobile) ──────────
const TrendsMobile = () => {
  const charts = [
    { title: 'Points', data: pointsData2, accent: true, unit: 'pts' },
    { title: 'True Shooting %', data: tsData2, accent: true, unit: '%' },
    { title: 'Rebounds', data: rebData2, accent: false, unit: 'reb' },
  ];
  return (
    <div style={{ height: '100%', background: WK.paper, overflow: 'hidden', position: 'relative' }}>
      <div style={{ padding: '12px 16px 80px', height: '100%', overflowY: 'auto' }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 14 }}>←</div>
          <div className="wk-label">Trends</div>
          <div style={{ fontSize: 14 }}>⋯</div>
        </Row>

        <div style={{ fontSize: 22, fontWeight: 700 }}>Your trajectory</div>
        <div style={{ fontSize: 12, color: WK.ink70 }}>game-by-game · dashed = 3-gm rolling avg</div>

        <Row gap={6} style={{ marginTop: 12, marginBottom: 12, overflowX: 'auto' }}>
          {['Season', 'Last 5', 'Home', 'Away'].map((t, i) => (
            <span key={t} className={i === 0 ? 'wk-chip wk-chip-accent' : 'wk-chip'}>{t}</span>
          ))}
        </Row>

        <Col gap={10}>
          {charts.map(c => (
            <div key={c.title} className="wk-box" style={{ padding: 14 }}>
              <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.title}</div>
                <div className="wk-mono" style={{ fontSize: 10, color: WK.ink70 }}>
                  avg {Math.round(c.data.reduce((a,b)=>a+b,0)/c.data.length)}{c.unit === '%' ? '%' : ''}
                </div>
              </Row>
              <Spark data={c.data} width={256} height={60} accent={c.accent} withAvg />
            </div>
          ))}

          {/* Combined AST vs TOV */}
          <div className="wk-box" style={{ padding: 14 }}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Assists vs Turnovers</div>
              <Row gap={6} style={{ fontSize: 10 }}>
                <span className="wk-chip" style={{ padding: '2px 6px', fontSize: 9, background: WK.accent, color: '#fff', borderColor: WK.ink }}>AST</span>
                <span className="wk-chip" style={{ padding: '2px 6px', fontSize: 9 }}>TOV</span>
              </Row>
            </Row>
            <div style={{ position: 'relative' }}>
              <Spark data={astData2} width={256} height={60} accent />
              <div style={{ position: 'absolute', inset: 0 }}>
                <Spark data={tovData2} width={256} height={60} />
              </div>
            </div>
            <Anno style={{ marginTop: 6 }}>AST climbing, TOV falling — growth</Anno>
          </div>
        </Col>
      </div>
      <FAB />
      <BottomNav active="trends" />
    </div>
  );
};

// ────────── Season switcher (mobile modal) ──────────
const SeasonSwitcher = () => (
  <div style={{ height: '100%', background: WK.paper, position: 'relative' }}>
    <div style={{ position: 'absolute', inset: 0, opacity: .25, pointerEvents: 'none' }}>
      <DashV2Mobile />
    </div>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(27,26,23,.4)' }} />
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, top: 120,
      background: WK.paper, borderTop: `2px solid ${WK.ink}`, borderRadius: '18px 18px 0 0',
      padding: 18, display: 'flex', flexDirection: 'column',
    }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Switch season</div>
        <div style={{ fontSize: 16 }}>×</div>
      </Row>

      <Col gap={8}>
        {[
          { s: 'Spring 2026', games: 8, current: true, ptg: 15.4, role: 'Playmaker' },
          { s: 'Fall 2025', games: 14, ptg: 12.1, role: 'Efficient Scorer' },
          { s: 'Spring 2025', games: 12, ptg: 9.8, role: 'Glue Guy' },
          { s: 'Fall 2024', games: 10, ptg: 7.2, role: 'Glue Guy' },
        ].map(s => (
          <div key={s.s} className="wk-box" style={{
            padding: 14, display: 'flex', alignItems: 'center', gap: 12,
            ...(s.current ? { borderColor: WK.accent, borderWidth: 2, background: WK.accentSoft } : {}),
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${WK.ink}`,
              background: s.current ? WK.accent : 'transparent', flex: '0 0 auto',
            }} />
            <Col gap={0} style={{ flex: 1 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.s}</div>
                {s.current && <span className="wk-chip" style={{ fontSize: 9, padding: '1px 6px', background: WK.accent, color: '#fff', borderColor: WK.ink }}>current</span>}
              </Row>
              <div className="wk-mono" style={{ fontSize: 10, color: WK.ink70, marginTop: 2 }}>
                {s.games} games · {s.ptg} ppg · {s.role}
              </div>
            </Col>
          </div>
        ))}
      </Col>
      <Anno style={{ marginTop: 10 }}>historical seasons preserved</Anno>

      <div style={{ flex: 1 }} />
      <button className="wk-btn wk-btn-primary" style={{ height: 44, borderRadius: 10 }}>View Spring 2026 →</button>
    </div>
  </div>
);

// ────────── Notifications (mobile) ──────────
const NotificationsMobile = () => (
  <div style={{ height: '100%', background: WK.paper, overflow: 'hidden', position: 'relative' }}>
    <div style={{ padding: '12px 16px 80px', height: '100%', overflowY: 'auto' }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 14 }}>←</div>
        <div className="wk-label">Notifications</div>
        <div style={{ fontSize: 12, color: WK.accent, fontWeight: 600 }}>Mark all read</div>
      </Row>

      <div className="wk-label" style={{ marginBottom: 6 }}>Today</div>
      <Col gap={8} style={{ marginBottom: 14 }}>
        <div className="wk-box" style={{ padding: 12, borderColor: WK.accent, borderWidth: 2, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: WK.accent2 }} />
          <Row gap={10}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: WK.accent2, border: `1.5px solid ${WK.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>★</div>
            <Col gap={2} style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>New personal best!</div>
              <div style={{ fontSize: 12, color: WK.ink70 }}>22 PTS vs Ravens — your highest this season.</div>
              <div className="wk-mono" style={{ fontSize: 9, color: WK.ink50, marginTop: 2 }}>2h ago</div>
            </Col>
          </Row>
        </div>
        <div className="wk-box" style={{ padding: 12, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: WK.accent }} />
          <Row gap={10}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: WK.accent, border: `1.5px solid ${WK.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>📊</div>
            <Col gap={2} style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Stats from vs Ravens are ready</div>
              <div style={{ fontSize: 12, color: WK.ink70 }}>Check your game log for the full line.</div>
              <div className="wk-mono" style={{ fontSize: 9, color: WK.ink50, marginTop: 2 }}>2h ago</div>
            </Col>
          </Row>
        </div>
      </Col>

      <div className="wk-label" style={{ marginBottom: 6 }}>Earlier this week</div>
      <Col gap={8} style={{ marginBottom: 14 }}>
        <div className="wk-box" style={{ padding: 12 }}>
          <Row gap={10}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: WK.paperDeep, border: `1.5px solid ${WK.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✉︎</div>
            <Col gap={2} style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Note from Coach Mel</div>
              <div style={{ fontFamily: WK.hand, fontSize: 14, color: WK.ink, lineHeight: 1.3, marginTop: 2 }}>
                "Keep attacking the middle — your reads are sharp lately."
              </div>
              <div className="wk-mono" style={{ fontSize: 9, color: WK.ink50, marginTop: 4 }}>Mon · vs Ravens</div>
            </Col>
          </Row>
        </div>
        <div className="wk-box" style={{ padding: 12 }}>
          <Row gap={10}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: WK.accentSoft, border: `1.5px solid ${WK.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: WK.accent }}>↗</div>
            <Col gap={2} style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Your role is evolving</div>
              <div style={{ fontSize: 12, color: WK.ink70 }}>Primary shifted: Efficient Scorer → Playmaker.</div>
              <div className="wk-mono" style={{ fontSize: 9, color: WK.ink50, marginTop: 2 }}>Sun</div>
            </Col>
          </Row>
        </div>
      </Col>

      <div className="wk-label" style={{ marginBottom: 6 }}>Weekly summary</div>
      <div className="wk-box" style={{ padding: 14, background: WK.accentSoft, borderColor: WK.accent }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Week of Apr 12 · AI highlight</div>
        <div style={{ fontFamily: WK.hand, fontSize: 15, lineHeight: 1.3, marginTop: 6 }}>
          "Four straight games over 15 PTS — you're not just scoring, you're scoring efficiently (TS 61%)."
        </div>
      </div>
      <Anno style={{ marginTop: 8 }}>per spec §11 triggers</Anno>
    </div>
    <FAB />
    <BottomNav active="home" />
  </div>
);

// ────────── Desktop: Game Log + Trends combined view ──────────
const GameLogDesktop = () => (
  <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '220px 1fr', background: WK.paper }}>
    <div style={{ borderRight: `1.5px solid ${WK.ink}`, padding: 16, background: WK.paperDeep }}>
      <div className="wk-hand" style={{ fontSize: 22, marginBottom: 18 }}>courtside.</div>
      <Col gap={4}>
        {[['Home'], ['Game Log', true], ['Trends'], ['My Role'], ['Chat']].map(([l, a]) => (
          <div key={l} style={{
            padding: '8px 10px', borderRadius: 6, fontSize: 13,
            ...(a ? { background: WK.accent, color: '#fff', fontWeight: 600 } : { color: WK.ink70 }),
          }}>{l}</div>
        ))}
      </Col>
    </div>
    <div style={{ padding: 20, overflow: 'auto' }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <Col gap={2}>
          <div className="wk-label">Game log</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Every game, every stat</div>
        </Col>
        <Row gap={8}>
          <span className="wk-chip">Spring '26 ▾</span>
          <span className="wk-chip wk-chip-accent">All</span>
          <span className="wk-chip">Home</span>
          <span className="wk-chip">Away</span>
          <span className="wk-chip">★ Best</span>
        </Row>
      </Row>

      <div className="wk-box" style={{ padding: 0 }}>
        <Row style={{ padding: '8px 14px', background: WK.paperDeep, borderBottom: `1.5px solid ${WK.ink}`, fontFamily: WK.mono, fontSize: 10, fontWeight: 700, color: WK.ink70 }}>
          {['DATE','OPP','H/A','PTS','REB','AST','STL','TOV','PF','2PT%','3PT%','FT%','TS%','NOTE'].map(h => (
            <div key={h} style={{ flex: h==='OPP'?2:h==='NOTE'?2:1 }}>{h}</div>
          ))}
        </Row>
        {[
          ['Apr 18','Ravens','H', 22, 9, 7, 2, 0, 1, 72, 50, 80, 68, 'Coach note ✉︎', true],
          ['Apr 11','Hawks','A', 16, 6, 5, 1, 2, 2, 55, 33, 100, 54, ''],
          ['Apr 4','Kings','H', 19, 8, 6, 2, 2, 3, 60, 40, 75, 61, 'Coach note ✉︎'],
          ['Mar 28','Jets','A', 9, 7, 3, 0, 3, 4, 30, 25, 50, 42, ''],
          ['Mar 21','Stars','H', 18, 10, 4, 3, 2, 2, 58, 43, 80, 60, ''],
          ['Mar 14','Bears','A', 11, 7, 5, 1, 1, 2, 48, 33, 75, 52, ''],
          ['Mar 7','Owls','H', 14, 5, 4, 2, 2, 1, 52, 37, 80, 56, ''],
          ['Feb 28','Wolves','A', 14, 6, 4, 1, 3, 3, 44, 30, 66, 48, ''],
        ].map((r,i) => (
          <Row key={i} style={{
            padding: '8px 14px', fontFamily: WK.mono, fontSize: 11,
            borderBottom: i < 7 ? `1px dashed ${WK.ink15}` : 'none',
            background: r[14] ? WK.accentSoft : 'transparent',
          }}>
            {r.slice(0,14).map((c,j) => (
              <div key={j} style={{
                flex: j===1?2:j===13?2:1,
                fontWeight: j===3?700:400,
                color: j===13?WK.accent:'inherit',
              }}>
                {c}{j===1 && r[14] && ' ★'}
              </div>
            ))}
          </Row>
        ))}
      </div>

      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="wk-box" style={{ padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Points per game</div>
          <Spark data={pointsData2} width={380} height={70} accent withAvg />
        </div>
        <div className="wk-box" style={{ padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>TS% trend</div>
          <Spark data={tsData2} width={380} height={70} accent withAvg />
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { GameLogMobile, TrendsMobile, SeasonSwitcher, NotificationsMobile, GameLogDesktop });
