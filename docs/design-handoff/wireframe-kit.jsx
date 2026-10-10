// Wireframe kit — sketchy-but-readable low-fi components for Courtside.
// Single orange accent (rec-league basketball); otherwise pencil on paper.

const WK = {
  ink: '#1b1a17',
  ink70: 'rgba(27,26,23,0.72)',
  ink50: 'rgba(27,26,23,0.5)',
  ink30: 'rgba(27,26,23,0.3)',
  ink15: 'rgba(27,26,23,0.15)',
  ink08: 'rgba(27,26,23,0.08)',
  paper: '#fbfaf6',
  paperDeep: '#f3f0e8',
  accent: '#974ca8', // primary purple
  accentSoft: '#f0e3f3',
  accent2: '#d7622c', // secondary orange
  accent2Soft: '#fbe3d3',
  hand: '"Caveat", "Patrick Hand", "Segoe Print", cursive',
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

// Inject fonts + base styles once
if (typeof document !== 'undefined' && !document.getElementById('wk-styles')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Patrick+Hand&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(link);
  const s = document.createElement('style');
  s.id = 'wk-styles';
  s.textContent = `
    .wk { font-family: ${WK.sans}; color: ${WK.ink}; }
    .wk-hand { font-family: ${WK.hand}; font-weight: 700; letter-spacing: .2px; }
    .wk-mono { font-family: ${WK.mono}; }
    .wk-box {
      background: ${WK.paper};
      border: 1.5px solid ${WK.ink};
      border-radius: 10px;
      position: relative;
    }
    .wk-box-dashed {
      background: ${WK.paper};
      border: 1.5px dashed ${WK.ink70};
      border-radius: 10px;
    }
    .wk-scribble::after {
      content: '';
      position: absolute; inset: 0;
      background-image: repeating-linear-gradient(-35deg, ${WK.ink15} 0 1px, transparent 1px 6px);
      border-radius: inherit;
      pointer-events: none;
    }
    .wk-btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 10px 16px; border-radius: 999px;
      border: 1.5px solid ${WK.ink}; background: ${WK.paper};
      font-family: ${WK.sans}; font-weight: 600; font-size: 13px;
      cursor: pointer;
    }
    .wk-btn-primary { background: ${WK.accent}; color: #fff; border-color: ${WK.ink}; }
    .wk-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 10px; border-radius: 999px;
      border: 1.5px solid ${WK.ink}; background: ${WK.paper};
      font-size: 11px; font-weight: 500;
    }
    .wk-chip-accent { background: ${WK.accent}; color: #fff; border-color: ${WK.ink}; }
    .wk-chip-soft { background: ${WK.accentSoft}; border-color: ${WK.ink}; }
    .wk-divider { height: 1.5px; background: ${WK.ink}; border: 0; }
    .wk-divider-dash { height: 0; border: 0; border-top: 1.5px dashed ${WK.ink50}; }
    .wk-anno {
      font-family: ${WK.hand}; color: ${WK.accent}; font-size: 15px;
      line-height: 1.1; display: inline-flex; align-items: center; gap: 4px;
    }
    .wk-label {
      font-family: ${WK.sans}; font-size: 10px; font-weight: 600;
      letter-spacing: .08em; text-transform: uppercase; color: ${WK.ink70};
    }
    .wk-ph {
      background-color: ${WK.paperDeep};
      background-image: repeating-linear-gradient(-35deg, ${WK.ink08} 0 2px, transparent 2px 9px);
      border: 1.5px dashed ${WK.ink50};
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-family: ${WK.mono}; font-size: 10px; color: ${WK.ink70};
      text-align: center; padding: 6px;
    }
    .wk-sparkline { stroke: ${WK.ink}; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .wk-sparkline-accent { stroke: ${WK.accent}; stroke-width: 2.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .wk-bar { background: ${WK.ink}; }
    .wk-bar-accent { background: ${WK.accent}; }
    .wk-underline {
      background-image: linear-gradient(transparent 85%, ${WK.accent} 85%);
      padding-bottom: 1px;
    }
    .wk-arrow { font-family: ${WK.hand}; color: ${WK.accent}; font-size: 22px; line-height: 1; }
    .wk-status-bar {
      height: 22px; display: flex; align-items: center; justify-content: space-between;
      padding: 0 16px; font-family: ${WK.sans}; font-size: 11px; font-weight: 600;
      color: ${WK.ink};
    }
    .wk-nav-item { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 10px; flex:1; padding: 6px 0; }
    .wk-nav-item.active { color: ${WK.accent}; font-weight: 600; }
  `;
  document.head.appendChild(s);
}

// ───────────── Primitives ─────────────

const Row = ({ children, gap = 8, style, ...rest }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap, ...style }} {...rest}>{children}</div>
);
const Col = ({ children, gap = 8, style, ...rest }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }} {...rest}>{children}</div>
);

const Anno = ({ children, style }) => (
  <div className="wk-anno" style={style}>{children}</div>
);

const Placeholder = ({ label, height = 80, style }) => (
  <div className="wk-ph" style={{ height, ...style }}>{label}</div>
);

const Scribble = ({ width = 40, height = 12, color = WK.ink }) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <path d={`M2 ${height/2} Q${width*.2} 2 ${width*.4} ${height/2} T${width*.8} ${height/2} T${width-2} ${height/2}`}
      stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

// Simple sparkline from an array of numbers (0..10-ish scale)
const Spark = ({ data, width = 140, height = 40, accent, withAvg }) => {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2;
    const y = height - 4 - (v / max) * (height - 8);
    return `${x},${y}`;
  }).join(' ');
  // 3-game rolling avg
  const avgData = data.map((_, i) => {
    const slice = data.slice(Math.max(0, i - 2), i + 1);
    return slice.reduce((a,b)=>a+b,0) / slice.length;
  });
  const avgPts = avgData.map((v, i) => {
    const x = (i / (avgData.length - 1)) * (width - 4) + 2;
    const y = height - 4 - (v / max) * (height - 8);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height}>
      {withAvg && <polyline points={avgPts} stroke={WK.ink30} strokeWidth="1.5" fill="none" strokeDasharray="3 3" />}
      <polyline points={pts} className={accent ? 'wk-sparkline-accent' : 'wk-sparkline'} />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * (width - 4) + 2;
        const y = height - 4 - (v / max) * (height - 8);
        return <circle key={i} cx={x} cy={y} r="2" fill={accent ? WK.accent : WK.ink} />;
      })}
    </svg>
  );
};

// Horizontal bar (for team percentile rank, etc.)
const RankBar = ({ pct, label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <Row gap={8} style={{ justifyContent: 'space-between' }}>
      <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
      <span className="wk-mono" style={{ fontSize: 11, color: WK.ink70 }}>{value}</span>
    </Row>
    <div style={{ height: 8, background: WK.paperDeep, border: `1.25px solid ${WK.ink}`, borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: WK.accent }} />
    </div>
  </div>
);

// Radar chart for archetype profile
const Radar = ({ size = 180, values, labels }) => {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.38;
  const n = values.length;
  const pt = (v, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * r * v, cy + Math.sin(a) * r * v];
  };
  const poly = values.map((v, i) => pt(v, i).join(',')).join(' ');
  return (
    <svg width={size} height={size}>
      {[0.25, 0.5, 0.75, 1].map((s, i) => (
        <polygon key={i}
          points={values.map((_, k) => {
            const a = (Math.PI * 2 * k) / n - Math.PI / 2;
            return `${cx + Math.cos(a) * r * s},${cy + Math.sin(a) * r * s}`;
          }).join(' ')}
          fill="none" stroke={WK.ink30} strokeWidth="1" />
      ))}
      {values.map((_, i) => {
        const [x, y] = pt(1, i);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={WK.ink30} strokeWidth="1" />;
      })}
      <polygon points={poly} fill={WK.accent} fillOpacity="0.25" stroke={WK.accent} strokeWidth="2" strokeLinejoin="round" />
      {labels && labels.map((l, i) => {
        const [x, y] = pt(1.18, i);
        return <text key={i} x={x} y={y} fontSize="9" fontFamily={WK.sans} fill={WK.ink} textAnchor="middle" dominantBaseline="middle" fontWeight="600">{l}</text>;
      })}
      {values.map((v, i) => {
        const [x, y] = pt(v, i);
        return <circle key={i} cx={x} cy={y} r="2.5" fill={WK.accent} />;
      })}
    </svg>
  );
};

// Sketchy jersey number avatar
const JerseyAvatar = ({ num = 23, size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    border: `1.5px solid ${WK.ink}`, background: WK.accentSoft,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: WK.sans, fontWeight: 700, fontSize: size * 0.42,
    flex: '0 0 auto',
  }}>{num}</div>
);

// Simple phone frame
const PhoneFrame = ({ children, width = 320, height = 640, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
    <div style={{
      width, height,
      border: `2px solid ${WK.ink}`,
      borderRadius: 32,
      background: WK.paper,
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '4px 4px 0 rgba(27,26,23,0.1)',
    }}>
      <div className="wk-status-bar">
        <span>9:41</span>
        <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
          <span>􀟁</span><span>􀛨</span><span>100%</span>
        </span>
      </div>
      <div style={{ height: height - 22, overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
    </div>
    {label && <div className="wk-hand" style={{ fontSize: 14, color: WK.ink70, paddingLeft: 6 }}>{label}</div>}
  </div>
);

// Simple desktop/browser frame
const DesktopFrame = ({ children, width = 900, height = 560, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
    <div style={{
      width, height,
      border: `2px solid ${WK.ink}`,
      borderRadius: 10,
      background: WK.paper,
      overflow: 'hidden',
      boxShadow: '4px 4px 0 rgba(27,26,23,0.1)',
    }}>
      <div style={{ height: 24, borderBottom: `1.5px solid ${WK.ink}`, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6, background: WK.paperDeep }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', border: `1px solid ${WK.ink}` }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', border: `1px solid ${WK.ink}` }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', border: `1px solid ${WK.ink}` }} />
        <span className="wk-mono" style={{ fontSize: 10, color: WK.ink70, marginLeft: 10 }}>courtside.app</span>
      </div>
      <div style={{ height: height - 24, overflow: 'hidden' }}>{children}</div>
    </div>
    {label && <div className="wk-hand" style={{ fontSize: 14, color: WK.ink70, paddingLeft: 6 }}>{label}</div>}
  </div>
);

// Bottom nav stub
const BottomNav = ({ active = 'home' }) => (
  <div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 56, borderTop: `1.5px solid ${WK.ink}`,
    background: WK.paper,
    display: 'flex', alignItems: 'stretch',
  }}>
    {[['home', 'Home'], ['log', 'Games'], ['trends', 'Trends'], ['role', 'Role']].map(([k, l]) => (
      <div key={k} className={`wk-nav-item ${active === k ? 'active' : ''}`}>
        <div style={{ width: 18, height: 18, border: `1.5px solid currentColor`, borderRadius: 4 }} />
        <span>{l}</span>
      </div>
    ))}
  </div>
);

// FAB
const FAB = ({ style }) => (
  <div style={{
    position: 'absolute', bottom: 72, right: 14,
    width: 52, height: 52, borderRadius: '50%',
    background: WK.accent, border: `1.5px solid ${WK.ink}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', boxShadow: '2px 3px 0 rgba(27,26,23,0.25)',
    ...style,
  }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  </div>
);

Object.assign(window, {
  WK, Row, Col, Anno, Placeholder, Scribble, Spark, RankBar, Radar,
  JerseyAvatar, PhoneFrame, DesktopFrame, BottomNav, FAB,
});
