// Player dashboard — THREE variants × (mobile + desktop)
// V1: Classic card stack (safe)
// V2: Hero archetype-first (bold, role is the lead visual)
// V3: "Newspaper" horizontal layout with inline sparkline everywhere (data-dense)

const pointsData = [8, 14, 11, 18, 9, 22, 16, 19];
const tsData = [0.4, 0.48, 0.52, 0.5, 0.56, 0.61, 0.58, 0.63];
const astData = [3, 5, 4, 6, 4, 7, 5, 8];
const tovData = [4, 3, 3, 2, 3, 2, 2, 1];
const rebData = [5, 7, 8, 6, 9, 10, 8, 11];

// ─────────── V1: Mobile — Classic card stack ───────────
const DashV1Mobile = () => (
  <div style={{ height: '100%', overflow: 'hidden', position: 'relative', background: WK.paper }}>
    <div style={{ padding: '12px 16px 80px', overflowY: 'auto', height: '100%' }}>
      {/* Top bar */}
      <Row style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <div className="wk-hand" style={{ fontSize: 22, lineHeight: 1 }}>courtside.</div>
        <div className="wk-chip" style={{ fontSize: 10 }}>Spring '26 ▾</div>
      </Row>

      {/* Profile header */}
      <div className="wk-box" style={{ padding: 14, marginBottom: 12 }}>
        <Row gap={12}>
          <JerseyAvatar num={23} size={54} />
          <Col gap={2} style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Jordan R.</div>
            <div style={{ fontSize: 11, color: WK.ink70 }}>Guard · #23</div>
            <Row gap={6} style={{ marginTop: 6, flexWrap: 'wrap' }}>
              <span className="wk-chip wk-chip-accent">Playmaker</span>
              <span className="wk-chip wk-chip-soft">Efficient Scorer</span>
            </Row>
          </Col>
        </Row>
        <Anno style={{ marginTop: 8 }}>primary + secondary archetype</Anno>
      </div>

      {/* Season averages */}
      <div className="wk-label" style={{ marginBottom: 6 }}>Season Averages · 8 games</div>
      <div className="wk-box" style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[['PTS','15.4'],['REB','8.1'],['AST','5.3'],['STL','1.8'],['TOV','2.4'],['PF','2.1']].map(([k,v]) => (
            <Col key={k} gap={0} style={{ alignItems: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: WK.sans }}>{v}</div>
              <div className="wk-label">{k}</div>
            </Col>
          ))}
        </div>
        <hr className="wk-divider-dash" style={{ margin: '12px 0' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[['FG%','48'],['3PT%','37'],['FT%','81'],['TS%','56']].map(([k,v]) => (
            <Col key={k} gap={0} style={{ alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{v}<span style={{fontSize: 9}}>%</span></div>
              <div className="wk-label" style={{ fontSize: 9 }}>{k}</div>
            </Col>
          ))}
        </div>
      </div>

      {/* Trend */}
      <div className="wk-label" style={{ marginBottom: 6 }}>Points Trend</div>
      <div className="wk-box" style={{ padding: 12, marginBottom: 12 }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 11, color: WK.ink70 }}>last 8 games</div>
          <div style={{ fontSize: 10, color: WK.ink50 }}>— 3-gm avg</div>
        </Row>
        <Spark data={pointsData} width={256} height={64} accent withAvg />
      </div>

      {/* Game log preview */}
      <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <div className="wk-label">Recent Games</div>
        <div style={{ fontSize: 11, color: WK.accent }}>See all →</div>
      </Row>
      <div className="wk-box" style={{ padding: 0, marginBottom: 12 }}>
        {[
          { op: 'vs Ravens', date: 'Apr 18', pts: 22, best: true },
          { op: '@ Hawks', date: 'Apr 11', pts: 16 },
          { op: 'vs Kings', date: 'Apr 4', pts: 19 },
        ].map((g, i) => (
          <div key={i} style={{
            padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: i < 2 ? `1px dashed ${WK.ink30}` : 'none',
            background: g.best ? WK.accentSoft : 'transparent',
          }}>
            <Col gap={1}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{g.op}</div>
              <div className="wk-mono" style={{ fontSize: 10, color: WK.ink70 }}>{g.date}</div>
            </Col>
            <Row gap={10}>
              <Col gap={0} style={{ alignItems: 'flex-end' }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{g.pts}</div>
                <div className="wk-label" style={{ fontSize: 9 }}>PTS</div>
              </Col>
              {g.best && <span className="wk-anno" style={{ fontSize: 12 }}>★ PB</span>}
            </Row>
          </div>
        ))}
      </div>

      {/* Rank */}
      <div className="wk-label" style={{ marginBottom: 6 }}>You vs. Team</div>
      <div className="wk-box" style={{ padding: 12 }}>
        <Col gap={10}>
          <RankBar label="Assists" pct={92} value="#1 on team" />
          <RankBar label="Rebounds" pct={64} value="above avg" />
          <RankBar label="3PT%" pct={38} value="below avg" />
        </Col>
        <Anno style={{ marginTop: 8 }}>teammates never named</Anno>
      </div>
    </div>
    <FAB />
    <BottomNav active="home" />
  </div>
);

// ─────────── V2: Mobile — Hero archetype-first ───────────
const DashV2Mobile = () => (
  <div style={{ height: '100%', overflow: 'hidden', position: 'relative', background: WK.paper }}>
    <div style={{ padding: '12px 16px 80px', overflowY: 'auto', height: '100%' }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="wk-hand" style={{ fontSize: 20 }}>hi, Jordan ↘</div>
        <div style={{ fontSize: 11, color: WK.ink70 }}>Spring '26</div>
      </Row>

      {/* BIG archetype hero */}
      <div className="wk-box" style={{ padding: 16, marginBottom: 14, background: WK.accent, borderColor: WK.ink, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div className="wk-label" style={{ color: 'rgba(255,255,255,.7)', marginBottom: 6 }}>You are a</div>
        <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1 }}>Playmaker</div>
        <div style={{ fontSize: 14, marginTop: 4, opacity: .85 }}>/ Efficient Scorer</div>
        <hr style={{ border: 0, borderTop: `1px dashed rgba(255,255,255,.35)`, margin: '12px 0' }} />
        <div style={{ fontSize: 12, lineHeight: 1.4 }}>
          You drive the offense cleanly — 5.3 AST with just 2.4 TOV/game, and you score efficiently (TS 56%).
        </div>
        <Row style={{ marginTop: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="wk-mono" style={{ fontSize: 10, opacity: .7 }}>AI-generated · updated today</div>
          <div style={{ fontSize: 11, fontWeight: 600 }}>Why? →</div>
        </Row>
      </div>

      {/* Quick stat strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
        {[['15.4','PTS'],['5.3','AST'],['8.1','REB'],['56%','TS']].map(([v,k]) => (
          <div key={k} className="wk-box" style={{ padding: '10px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{v}</div>
            <div className="wk-label" style={{ fontSize: 9 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Trend feature */}
      <div className="wk-box" style={{ padding: 14, marginBottom: 12 }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div className="wk-label">Your trajectory</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Assists vs Turnovers</div>
          </div>
          <Row gap={4} style={{ fontSize: 10 }}>
            <span className="wk-chip" style={{ padding: '2px 6px', fontSize: 9, background: WK.accent, color: '#fff' }}>AST</span>
            <span className="wk-chip" style={{ padding: '2px 6px', fontSize: 9 }}>TOV</span>
          </Row>
        </Row>
        <div style={{ position: 'relative' }}>
          <Spark data={astData} width={256} height={60} accent />
          <div style={{ position: 'absolute', inset: 0 }}>
            <Spark data={tovData} width={256} height={60} />
          </div>
        </div>
        <Anno style={{ marginTop: 6 }}>AST up, TOV down = beautiful</Anno>
      </div>

      {/* Recent game headline */}
      <div className="wk-box" style={{ padding: 14, marginBottom: 12, background: WK.accentSoft }}>
        <div className="wk-label">Your last game · Apr 18</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>vs Ravens · 22 PTS</div>
        <div style={{ fontSize: 11, color: WK.ink70, marginTop: 2 }}>★ personal best · 7 AST / 9 REB / 0 TOV</div>
        <Row gap={6} style={{ marginTop: 10 }}>
          <button className="wk-btn" style={{ fontSize: 11, padding: '6px 12px' }}>Full line</button>
          <button className="wk-btn" style={{ fontSize: 11, padding: '6px 12px' }}>Coach note</button>
        </Row>
      </div>

      <Anno>FAB = chat w/ AI ↘</Anno>
    </div>
    <FAB />
    <BottomNav active="home" />
  </div>
);

// ─────────── V3: Mobile — Dense newspaper ───────────
const DashV3Mobile = () => (
  <div style={{ height: '100%', overflow: 'hidden', position: 'relative', background: WK.paper }}>
    <div style={{ padding: 12, overflowY: 'auto', height: 'calc(100% - 56px)', paddingBottom: 80 }}>
      {/* Masthead */}
      <div style={{ borderBottom: `2px solid ${WK.ink}`, paddingBottom: 6, marginBottom: 10 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <div className="wk-hand" style={{ fontSize: 26, lineHeight: 1 }}>The Jordan Post</div>
          <div className="wk-mono" style={{ fontSize: 9, color: WK.ink70 }}>VOL.8 · SPRING '26</div>
        </Row>
      </div>

      <Row gap={10} style={{ alignItems: 'flex-start', marginBottom: 10 }}>
        <JerseyAvatar num={23} size={42} />
        <Col gap={2} style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Jordan R. · Guard</div>
          <div style={{ fontSize: 10, color: WK.ink70 }}>Playmaker / Efficient Scorer</div>
        </Col>
      </Row>

      {/* Headline card */}
      <div style={{ borderTop: `1px solid ${WK.ink}`, borderBottom: `1px solid ${WK.ink}`, padding: '8px 0', marginBottom: 10 }}>
        <div className="wk-hand" style={{ fontSize: 20, lineHeight: 1.1 }}>
          "Streaky becomes <span style={{ color: WK.accent }}>steady</span>: 4 straight over 15 PTS."
        </div>
      </div>

      {/* Inline stat rows with sparklines */}
      <Col gap={8}>
        {[
          ['Points', '15.4', pointsData, true],
          ['Assists', '5.3', astData, true],
          ['Rebounds', '8.1', rebData, false],
          ['TS %', '56', tsData.map(x=>x*100), false],
        ].map(([label, v, data, accent]) => (
          <Row key={label} gap={10} style={{ alignItems: 'center' }}>
            <Col gap={0} style={{ width: 64 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{v}</div>
              <div className="wk-label" style={{ fontSize: 9 }}>{label}</div>
            </Col>
            <div style={{ flex: 1 }}>
              <Spark data={data} width={200} height={28} accent={accent} />
            </div>
          </Row>
        ))}
      </Col>

      <hr className="wk-divider-dash" style={{ margin: '12px 0' }} />

      {/* Agate-style table */}
      <div className="wk-label" style={{ marginBottom: 4 }}>Last 4 Box Scores</div>
      <div style={{ fontFamily: WK.mono, fontSize: 10, lineHeight: 1.7 }}>
        <Row style={{ borderBottom: `1px solid ${WK.ink}`, padding: '2px 0', fontWeight: 600 }}>
          <div style={{ flex: 2 }}>OPP</div>
          <div style={{ flex: 1, textAlign: 'right' }}>PTS</div>
          <div style={{ flex: 1, textAlign: 'right' }}>AST</div>
          <div style={{ flex: 1, textAlign: 'right' }}>REB</div>
          <div style={{ flex: 1, textAlign: 'right' }}>TS</div>
        </Row>
        {[
          ['vs Ravens', 22, 7, 9, 68, true],
          ['@ Hawks', 16, 5, 6, 54],
          ['vs Kings', 19, 6, 8, 61],
          ['@ Jets', 9, 3, 7, 42],
        ].map((r,i) => (
          <Row key={i} style={{
            padding: '2px 4px', borderBottom: `1px dashed ${WK.ink15}`,
            background: r[5] ? WK.accentSoft : 'transparent',
          }}>
            <div style={{ flex: 2 }}>{r[0]}{r[5] && ' ★'}</div>
            <div style={{ flex: 1, textAlign: 'right' }}>{r[1]}</div>
            <div style={{ flex: 1, textAlign: 'right' }}>{r[2]}</div>
            <div style={{ flex: 1, textAlign: 'right' }}>{r[3]}</div>
            <div style={{ flex: 1, textAlign: 'right' }}>{r[4]}</div>
          </Row>
        ))}
      </div>
      <Anno style={{ marginTop: 8 }}>dense · data-first</Anno>
    </div>
    <FAB />
    <BottomNav active="home" />
  </div>
);

// ─────────── Desktop V1: Classic 3-column ───────────
const DashV1Desktop = () => (
  <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '220px 1fr', background: WK.paper }}>
    {/* Sidebar */}
    <div style={{ borderRight: `1.5px solid ${WK.ink}`, padding: 16, background: WK.paperDeep }}>
      <div className="wk-hand" style={{ fontSize: 22, marginBottom: 18 }}>courtside.</div>
      <Col gap={4}>
        {[['Home', true], ['Game Log'], ['Trends'], ['My Role'], ['Chat']].map(([l, a]) => (
          <div key={l} style={{
            padding: '8px 10px', borderRadius: 6, fontSize: 13,
            ...(a ? { background: WK.accent, color: '#fff', fontWeight: 600 } : { color: WK.ink70 }),
          }}>{l}</div>
        ))}
      </Col>
      <hr className="wk-divider-dash" style={{ margin: '16px 0' }} />
      <Row gap={8}>
        <JerseyAvatar num={23} size={32} />
        <Col gap={0} style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Jordan R.</div>
          <div style={{ fontSize: 10, color: WK.ink70 }}>Guard · #23</div>
        </Col>
      </Row>
    </div>

    {/* Main */}
    <div style={{ padding: 20, overflow: 'auto' }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <Col gap={2}>
          <div className="wk-label">Your dashboard</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Spring 2026 Season</div>
        </Col>
        <Row gap={8}>
          <span className="wk-chip">Spring '26 ▾</span>
          <span className="wk-chip">8 games</span>
        </Row>
      </Row>

      {/* Hero row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div className="wk-box" style={{ padding: 16 }}>
          <Row gap={12} style={{ alignItems: 'flex-start' }}>
            <JerseyAvatar num={23} size={56} />
            <Col gap={2} style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Jordan R.</div>
              <div style={{ fontSize: 11, color: WK.ink70, marginBottom: 4 }}>Guard · #23</div>
              <Row gap={6}>
                <span className="wk-chip wk-chip-accent">Playmaker</span>
                <span className="wk-chip wk-chip-soft">Efficient Scorer</span>
              </Row>
              <Anno style={{ marginTop: 8 }}>primary + secondary</Anno>
            </Col>
          </Row>
        </div>
        <div className="wk-box" style={{ padding: 16 }}>
          <div className="wk-label">Season Averages</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
            {[['PTS','15.4'],['AST','5.3'],['REB','8.1']].map(([k,v]) => (
              <Col key={k} gap={0} style={{ alignItems: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{v}</div>
                <div className="wk-label" style={{ fontSize: 9 }}>{k}</div>
              </Col>
            ))}
          </div>
          <hr className="wk-divider-dash" style={{ margin: '10px 0' }} />
          <Row style={{ justifyContent: 'space-between', fontSize: 11 }}>
            <span>FG 48% · 3PT 37%</span><span>TS 56%</span>
          </Row>
        </div>
        <div className="wk-box" style={{ padding: 16 }}>
          <div className="wk-label">You vs. Team</div>
          <Col gap={8} style={{ marginTop: 8 }}>
            <RankBar label="Assists" pct={92} value="#1" />
            <RankBar label="Rebounds" pct={64} value="above" />
            <RankBar label="3PT%" pct={38} value="below" />
          </Col>
        </div>
      </div>

      {/* Trend row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div className="wk-box" style={{ padding: 16 }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Points per game</div>
            <div style={{ fontSize: 10, color: WK.ink50 }}>— 3-gm avg</div>
          </Row>
          <Spark data={pointsData} width={380} height={80} accent withAvg />
        </div>
        <div className="wk-box" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>AST vs TOV</div>
          <div style={{ position: 'relative', height: 80 }}>
            <Spark data={astData} width={380} height={80} accent />
            <div style={{ position: 'absolute', inset: 0 }}>
              <Spark data={tovData} width={380} height={80} />
            </div>
          </div>
        </div>
      </div>

      {/* Game log */}
      <div className="wk-box" style={{ padding: 0 }}>
        <Row style={{ padding: '10px 14px', borderBottom: `1.5px solid ${WK.ink}`, justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Game log</div>
          <div style={{ fontSize: 11, color: WK.ink70 }}>8 games · 1 personal best</div>
        </Row>
        <div style={{ fontFamily: WK.mono, fontSize: 11 }}>
          <Row style={{ padding: '6px 14px', background: WK.paperDeep, color: WK.ink70, fontWeight: 600 }}>
            {['DATE','OPP','H/A','PTS','REB','AST','STL','TOV','FG%'].map(h => (
              <div key={h} style={{ flex: h==='OPP'?2:1 }}>{h}</div>
            ))}
          </Row>
          {[
            ['Apr 18','Ravens','H', 22, 9, 7, 2, 0, 64, true],
            ['Apr 11','Hawks','A', 16, 6, 5, 1, 2, 48],
            ['Apr 4','Kings','H', 19, 8, 6, 2, 2, 52],
            ['Mar 28','Jets','A', 9, 7, 3, 0, 3, 31],
          ].map((r, i) => (
            <Row key={i} style={{
              padding: '6px 14px', borderBottom: `1px dashed ${WK.ink15}`,
              background: r[9] ? WK.accentSoft : 'transparent',
            }}>
              {r.slice(0,9).map((c, j) => (
                <div key={j} style={{ flex: j===1?2:1 }}>{c}{j===1 && r[9] && ' ★'}</div>
              ))}
            </Row>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─────────── Desktop V2: Archetype-hero ───────────
const DashV2Desktop = () => (
  <div style={{ height: '100%', background: WK.paper, padding: 20, overflow: 'auto' }}>
    <Row style={{ justifyContent: 'space-between', marginBottom: 14 }}>
      <div className="wk-hand" style={{ fontSize: 26 }}>courtside.</div>
      <Row gap={8}>
        <span className="wk-chip">Spring '26 ▾</span>
        <span className="wk-chip">#23 Jordan R.</span>
      </Row>
    </Row>

    {/* Big role hero */}
    <div className="wk-box" style={{
      padding: '28px 32px', marginBottom: 14, background: WK.accent, color: '#fff',
      display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20,
    }}>
      <div>
        <div className="wk-label" style={{ color: 'rgba(255,255,255,.7)' }}>You are a</div>
        <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1, marginTop: 4 }}>Playmaker</div>
        <div style={{ fontSize: 18, marginTop: 4, opacity: .8 }}>/ Efficient Scorer</div>
        <div style={{ fontSize: 14, marginTop: 14, lineHeight: 1.5, maxWidth: 420 }}>
          You drive the offense cleanly — elite assist rate for a guard, and you score
          efficiently without forcing shots (TS 56%, PTS/FGA 1.14).
        </div>
        <Row gap={8} style={{ marginTop: 16 }}>
          <button className="wk-btn" style={{ background: '#fff', borderColor: '#fff', fontSize: 11 }}>How did I earn this? →</button>
          <button className="wk-btn" style={{ background: 'transparent', borderColor: '#fff', color: '#fff', fontSize: 11 }}>Ask the agent</button>
        </Row>
      </div>
      <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ filter: 'invert(1) brightness(1.2)' }}>
          <Radar size={200} values={[0.95, 0.7, 0.85, 0.75, 0.45, 0.65]} labels={['AST','STL','TS%','PTS','REB','3PT%']} />
        </div>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
      {[['PTS','15.4','+2 vs prior'],['AST','5.3','#1 on team'],['REB','8.1','above avg'],['TS%','56','+4%']].map(([k,v,sub]) => (
        <div key={k} className="wk-box" style={{ padding: 14 }}>
          <div className="wk-label">{k}</div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{v}</div>
          <div style={{ fontSize: 10, color: WK.accent, fontWeight: 600 }}>{sub}</div>
        </div>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div className="wk-box" style={{ padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Trajectory · PTS</div>
        <Spark data={pointsData} width={380} height={80} accent withAvg />
      </div>
      <div className="wk-box" style={{ padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Recent</div>
        <div style={{ fontFamily: WK.mono, fontSize: 11, lineHeight: 1.8 }}>
          <div>Apr 18  vs Ravens  22-9-7  ★</div>
          <div>Apr 11  @ Hawks   16-6-5</div>
          <div>Apr 4   vs Kings  19-8-6</div>
        </div>
      </div>
    </div>
  </div>
);

// ─────────── Desktop V3: Wide newspaper ───────────
const DashV3Desktop = () => (
  <div style={{ height: '100%', background: WK.paper, padding: 24, overflow: 'auto', fontFamily: WK.sans }}>
    <div style={{ borderBottom: `3px double ${WK.ink}`, paddingBottom: 8, marginBottom: 14 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <div className="wk-hand" style={{ fontSize: 42, lineHeight: 1 }}>The Jordan Post</div>
        <div className="wk-mono" style={{ fontSize: 10, color: WK.ink70, textAlign: 'right' }}>
          <div>VOLUME VIII · SPRING '26</div>
          <div>UPDATED APR 18, 2026</div>
        </div>
      </Row>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 2fr 1fr', gap: 18 }}>
      {/* Left column — profile + rank */}
      <Col gap={14}>
        <div className="wk-box" style={{ padding: 14 }}>
          <Row gap={10}><JerseyAvatar num={23} size={48} />
            <Col gap={0}><div style={{ fontSize: 14, fontWeight: 700 }}>Jordan R.</div>
              <div style={{ fontSize: 10, color: WK.ink70 }}>Guard · #23</div></Col>
          </Row>
          <hr className="wk-divider-dash" style={{ margin: '10px 0' }} />
          <div className="wk-label" style={{ marginBottom: 4 }}>Role</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Playmaker</div>
          <div style={{ fontSize: 12, color: WK.ink70 }}>/ Efficient Scorer</div>
        </div>

        <div className="wk-box" style={{ padding: 14 }}>
          <div className="wk-label" style={{ marginBottom: 8 }}>You vs. Team</div>
          <Col gap={8}>
            <RankBar label="AST" pct={92} value="#1" />
            <RankBar label="STL" pct={78} value="top 3" />
            <RankBar label="REB" pct={64} value="above" />
            <RankBar label="TS%" pct={58} value="above" />
            <RankBar label="3PT%" pct={38} value="below" />
          </Col>
        </div>
      </Col>

      {/* Middle column — headline, chart, agate table */}
      <Col gap={14}>
        <div style={{ borderTop: `1px solid ${WK.ink}`, borderBottom: `1px solid ${WK.ink}`, padding: '10px 0' }}>
          <div className="wk-hand" style={{ fontSize: 30, lineHeight: 1.1 }}>
            "Streaky becomes <span style={{ color: WK.accent }}>steady</span>. Four straight over 15 PTS."
          </div>
          <div style={{ fontSize: 11, color: WK.ink70, marginTop: 4 }}>— AI highlight, generated weekly</div>
        </div>

        <div className="wk-box" style={{ padding: 16 }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Points trend · last 8</div>
            <Row gap={10} style={{ fontSize: 10, color: WK.ink70 }}>
              <span>● game</span><span style={{ color: WK.ink30 }}>— 3-gm avg</span>
            </Row>
          </Row>
          <Spark data={pointsData} width={460} height={120} accent withAvg />
        </div>

        <div>
          <Row style={{ borderBottom: `2px solid ${WK.ink}`, paddingBottom: 4, marginBottom: 6, fontFamily: WK.mono, fontSize: 10, fontWeight: 700 }}>
            {['DATE','OPP','H/A','PTS','REB','AST','STL','TOV','FG%','TS%'].map(h=>(
              <div key={h} style={{ flex: h==='OPP'?2:1 }}>{h}</div>
            ))}
          </Row>
          <div style={{ fontFamily: WK.mono, fontSize: 11 }}>
            {[
              ['Apr 18','Ravens','H', 22, 9, 7, 2, 0, 64, 68, true],
              ['Apr 11','Hawks','A', 16, 6, 5, 1, 2, 48, 54],
              ['Apr 4','Kings','H', 19, 8, 6, 2, 2, 52, 61],
              ['Mar 28','Jets','A', 9, 7, 3, 0, 3, 31, 42],
              ['Mar 21','Stars','H', 18, 10,4, 3, 2, 55, 60],
            ].map((r,i) => (
              <Row key={i} style={{ padding: '4px 0', borderBottom: `1px dashed ${WK.ink15}`, background: r[10]?WK.accentSoft:'transparent' }}>
                {r.slice(0,10).map((c,j)=><div key={j} style={{ flex: j===1?2:1 }}>{c}{j===1&&r[10]&&' ★'}</div>)}
              </Row>
            ))}
          </div>
        </div>
      </Col>

      {/* Right column — notes, quick facts */}
      <Col gap={14}>
        <div className="wk-box" style={{ padding: 14, background: WK.accentSoft }}>
          <div className="wk-label">Coach's note · Apr 18</div>
          <div style={{ fontFamily: WK.hand, fontSize: 16, lineHeight: 1.3, marginTop: 6 }}>
            "Best floor-general game all season. Keep attacking middle gaps."
          </div>
          <div style={{ fontSize: 10, color: WK.ink70, marginTop: 6 }}>— Coach Mel</div>
        </div>
        <div className="wk-box" style={{ padding: 14 }}>
          <div className="wk-label" style={{ marginBottom: 8 }}>Quick facts</div>
          <div style={{ fontSize: 12, lineHeight: 1.5 }}>
            · 1 personal best this season<br/>
            · Longest 15+ PTS streak: 4<br/>
            · Best shooting night: TS 68%<br/>
            · Cleanest AST/TO: 7:0
          </div>
        </div>
        <Anno>(newspaper vibe · data-dense)</Anno>
      </Col>
    </div>
  </div>
);

Object.assign(window, {
  DashV1Mobile, DashV2Mobile, DashV3Mobile,
  DashV1Desktop, DashV2Desktop, DashV3Desktop,
});
