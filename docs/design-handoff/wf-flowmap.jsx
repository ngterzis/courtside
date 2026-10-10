// Flow map — shows how pages connect

const FlowMap = () => {
  const Node = ({ x, y, w = 140, h = 80, label, sub, accent, onRef }) => (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      border: `1.5px solid ${WK.ink}`, borderRadius: 10,
      background: accent ? WK.accent : WK.paper,
      color: accent ? '#fff' : WK.ink,
      padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center',
      boxShadow: '2px 2px 0 rgba(27,26,23,.08)',
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.1 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, opacity: .75, marginTop: 4, lineHeight: 1.3 }}>{sub}</div>}
    </div>
  );

  // Arrow from (x1,y1) -> (x2,y2) with label
  const Arrow = ({ x1, y1, x2, y2, label, dashed, curve }) => {
    const path = curve
      ? `M${x1} ${y1} C${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`
      : `M${x1} ${y1} L${x2} ${y2}`;
    return (
      <>
        <path d={path} stroke={WK.ink} strokeWidth="1.5" fill="none"
          strokeDasharray={dashed ? '4 4' : undefined} markerEnd="url(#arrowhead)" />
        {label && (
          <text x={(x1+x2)/2} y={(y1+y2)/2 - 4} textAnchor="middle"
            fontSize="10" fontFamily={WK.hand} fill={WK.accent2} fontWeight="700">{label}</text>
        )}
      </>
    );
  };

  return (
    <div style={{ width: 1280, height: 720, background: WK.paper, position: 'relative', padding: 20 }}>
      <div className="wk-hand" style={{ fontSize: 32, lineHeight: 1, color: WK.accent }}>
        how the player navigates
      </div>
      <div style={{ fontSize: 12, color: WK.ink70, marginTop: 4 }}>
        Solid = primary path · dashed = secondary/modal · orange label = tap target
      </div>

      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={WK.ink} />
          </marker>
        </defs>

        {/* Login → Onboarding → Dashboard */}
        <Arrow x1={170} y1={170} x2={250} y2={170} label="sign in" />
        <Arrow x1={390} y1={170} x2={470} y2={170} label="first run" dashed />
        <Arrow x1={610} y1={170} x2={700} y2={250} label="done" />

        {/* Dashboard → spokes */}
        <Arrow x1={780} y1={290} x2={920} y2={170} label="tap card" curve />
        <Arrow x1={820} y1={340} x2={980} y2={340} label="tab · FAB" />
        <Arrow x1={780} y1={380} x2={920} y2={470} label="bottom nav" curve />
        <Arrow x1={720} y1={400} x2={640} y2={470} label="bottom nav" curve />
        <Arrow x1={640} y1={400} x2={460} y2={470} label="bottom nav" curve />
        <Arrow x1={700} y1={250} x2={380} y2={270} label="season ▾" dashed curve />
        <Arrow x1={720} y1={250} x2={700} y2={100} label="bell icon" dashed curve />

        {/* Archetype → AI */}
        <Arrow x1={1060} y1={210} x2={1060} y2={300} label="ask why" dashed />

        {/* Game log → Trends */}
        <Arrow x1={580} y1={520} x2={540} y2={520} label="swipe" dashed />
      </svg>

      {/* Column 1 — entry */}
      <Node x={30} y={140} label="Login" sub="email + password" />
      <Node x={250} y={140} label="Onboarding" sub="jersey · position (first run only)" />

      {/* Column 2 — dashboard HUB */}
      <Node x={610} y={250} w={200} h={160} label="Player Dashboard" sub="V2 archetype-first hero · season averages · last-game card · trajectory chart" accent />

      {/* Right spokes */}
      <Node x={920} y={130} w={160} h={90} label="Archetype detail" sub="card + radar + receipt (combined)" />
      <Node x={980} y={300} w={160} h={80} label="AI Agent · Chat" sub="B · suggested Qs launcher" />
      <Node x={920} y={450} w={160} h={80} label="Trends" sub="PTS · TS% · AST/TOV · REB" />

      {/* Left/bottom spokes */}
      <Node x={440} y={450} w={160} h={80} label="Game Log" sub="paginated · filterable · coach notes" />
      <Node x={220} y={240} w={160} h={60} label="Season switcher" sub="modal · history preserved" />
      <Node x={610} y={50} w={180} h={60} label="Notifications" sub="PB · stats ready · coach note" />

      {/* Legend */}
      <div style={{ position: 'absolute', left: 30, bottom: 24, fontSize: 11, color: WK.ink70, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div><span className="wk-hand" style={{ color: WK.accent2 }}>orange</span> = entry gesture</div>
        <div>Purple box = main hub (dashboard)</div>
        <div>Dashed arrow = modal / secondary path</div>
      </div>
    </div>
  );
};

Object.assign(window, { FlowMap });
