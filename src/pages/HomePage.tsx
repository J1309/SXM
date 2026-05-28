import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  useScrollReveal,
  useStaggerReveal,
  useCountUp,
  useTilt,
} from '../hooks/useAnimations';

interface HomePageProps {
  onNavigate: (page: 'home' | 'about') => void;
}

/* ============================================
   SVG Icon components
   ============================================ */
function ChartIcon() {
  return (
    <svg viewBox="0 0 48 48">
      <polyline points="4,40 14,28 22,34 32,18 42,8" />
      <line x1="4" y1="44" x2="44" y2="44" />
      <line x1="4" y1="4" x2="4" y2="44" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 48 48">
      <path d="M24,4 L40,12 L40,24 C40,34 32,42 24,44 C16,42 8,34 8,24 L8,12 Z" />
      <polyline points="16,24 22,30 32,18" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 48 48">
      <path d="M24,44 L24,20" />
      <path d="M24,20 C24,12 16,8 12,12 C8,16 8,24 12,24" />
      <path d="M24,20 C24,12 32,8 36,12 C40,16 40,24 36,24" />
      <circle cx="16" cy="18" r="2" />
      <circle cx="32" cy="18" r="2" />
    </svg>
  );
}

/* Module icons */
function BookIcon() {
  return (
    <svg viewBox="0 0 36 36">
      <path d="M4,4 L18,8 L32,4 L32,28 L18,32 L4,28 Z" />
      <line x1="18" y1="8" x2="18" y2="32" />
    </svg>
  );
}

function CandleIcon() {
  return (
    <svg viewBox="0 0 36 36">
      <rect x="8" y="10" width="6" height="14" rx="1" />
      <line x1="11" y1="6" x2="11" y2="10" />
      <line x1="11" y1="24" x2="11" y2="30" />
      <rect x="22" y="14" width="6" height="10" rx="1" />
      <line x1="25" y1="8" x2="25" y2="14" />
      <line x1="25" y1="24" x2="25" y2="30" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 36 36">
      <line x1="4" y1="24" x2="32" y2="24" />
      <line x1="4" y1="12" x2="32" y2="12" />
      <polyline points="6,28 14,20 22,26 30,14" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 36 36">
      <polyline points="4,28 12,20 20,24 28,10 34,6" />
      <polyline points="26,6 34,6 34,14" />
    </svg>
  );
}

function RiskIcon() {
  return (
    <svg viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" />
      <path d="M18,10 L18,20" />
      <circle cx="18" cy="25" r="1.5" />
    </svg>
  );
}

function PsychIcon() {
  return (
    <svg viewBox="0 0 36 36">
      <circle cx="18" cy="14" r="10" />
      <path d="M12,30 C12,24 24,24 24,30" />
      <path d="M14,12 Q18,8 22,12" />
    </svg>
  );
}

const moduleIcons = [BookIcon, CandleIcon, SupportIcon, TrendIcon, RiskIcon, PsychIcon];

/* ============================================
   Candlestick Chart SVG for hero — LIVE ANIMATED
   ============================================ */
interface CandleData {
  id: number;
  o: number;
  c: number;
  h: number;
  l: number;
  age: number;          // frames since birth
  fadingOut: boolean;
}

function generateCandle(id: number, prevClose: number): CandleData {
  const drift = (Math.random() - 0.45) * 12;   // slight upward bias
  const o = prevClose;
  const c = Math.max(10, Math.min(85, o + drift));
  const wickUp = Math.random() * 8 + 2;
  const wickDn = Math.random() * 8 + 2;
  const h = Math.min(o, c) - wickUp;
  const l = Math.max(o, c) + wickDn;
  return { id, o, c, h: Math.max(5, h), l: Math.min(90, l), age: 0, fadingOut: false };
}

function HeroCandlestickChart({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const MAX_CANDLES = 18;
  const CANDLE_WIDTH = 16;
  const GAP = 34;
  const SVG_W = 650;
  const SVG_H = 300;
  const SCALE = SVG_H / 100;
  const nextId = useRef(0);
  const rafRef = useRef<number>(0);
  const frameCount = useRef(0);

  const [candles, setCandles] = useState<CandleData[]>(() => {
    const seed: CandleData[] = [];
    let prev = 50;
    for (let i = 0; i < MAX_CANDLES; i++) {
      const cd = generateCandle(nextId.current++, prev);
      cd.age = 999; // already visible
      seed.push(cd);
      prev = cd.c;
    }
    return seed;
  });


  useEffect(() => {
    const INTERVAL = 80; // new candle every ~80 frames (~1.3s at 60fps)
    const tick = () => {
      frameCount.current++;

      setCandles(prev => {
        // Age every candle
        let updated = prev.map(c => ({ ...c, age: c.age + 1 }));

        // Add a new candle periodically
        if (frameCount.current % INTERVAL === 0) {
          const lastClose = updated.length > 0 ? updated[updated.length - 1].c : 50;
          const newCandle = generateCandle(nextId.current++, lastClose);
          updated = [...updated, newCandle];
        }

        // Mark oldest for fade-out & remove fully faded
        if (updated.length > MAX_CANDLES + 2) {
          updated[0] = { ...updated[0], fadingOut: true };
        }
        updated = updated.filter(c => !(c.fadingOut && c.age > 30));

        return updated;
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Compute glow position relative to SVG (0-1 range)
  const glowXPct = Math.max(0, Math.min(1, mouseX));
  const glowYPct = Math.max(0, Math.min(1, mouseY));
  const isHovering = mouseX >= 0 && mouseX <= 1 && mouseY >= 0 && mouseY <= 1;

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="none">
      <defs>
        {/* Glow filter for the radial hover effect */}
        <radialGradient id="chartGlow" cx={glowXPct} cy={glowYPct} r="0.35">
          <stop offset="0%" stopColor="#F66142" stopOpacity={isHovering ? 0.35 : 0} />
          <stop offset="60%" stopColor="#F66142" stopOpacity={isHovering ? 0.08 : 0} />
          <stop offset="100%" stopColor="#F66142" stopOpacity="0" />
        </radialGradient>
        {/* Candle glow filter */}
        <filter id="candleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Radial glow overlay that follows the cursor */}
      <rect
        x="0" y="0" width={SVG_W} height={SVG_H}
        fill="url(#chartGlow)"
        style={{ transition: 'opacity 0.4s ease', opacity: isHovering ? 1 : 0 }}
      />

      {/* Subtle horizontal grid lines */}
      {[60, 120, 180, 240].map(y => (
        <line key={y} x1="0" y1={y} x2={SVG_W} y2={y}
          stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}

      {/* Candles */}
      {candles.map((c, i) => {
        // Position: newest on the right, sliding left as new ones arrive
        const offset = candles.length - 1 - i;
        const x = SVG_W - 30 - offset * GAP;

        const bullish = c.c < c.o;
        const bodyTop = Math.min(c.o, c.c) * SCALE;
        const bodyH = Math.abs(c.o - c.c) * SCALE;
        const color = bullish ? '#F66142' : 'rgba(255,255,255,0.3)';

        // Entry animation: scale up & fade in
        const entryProgress = Math.min(c.age / 12, 1);
        const fadeOutOpacity = c.fadingOut ? Math.max(0, 1 - (c.age - 20) / 10) : 1;
        const opacity = entryProgress * fadeOutOpacity;
        const scaleY = 0.3 + entryProgress * 0.7;

        // Subtle idle breathing animation
        const breathe = Math.sin((frameCount.current + i * 20) * 0.02) * 1.5;

        // Proximity glow: if cursor is near this candle, intensify it
        const candleCenterX = x + CANDLE_WIDTH / 2;
        const candleCenterY = ((c.o + c.c) / 2) * SCALE;
        const cursorSvgX = glowXPct * SVG_W;
        const cursorSvgY = glowYPct * SVG_H;
        const dist = Math.sqrt(
          (candleCenterX - cursorSvgX) ** 2 + (candleCenterY - cursorSvgY) ** 2
        );
        const proximityGlow = isHovering && dist < 120;

        return (
          <g
            key={c.id}
            style={{
              opacity,
              transform: `translateY(${(1 - scaleY) * 20 + breathe}px)`,
              transition: 'opacity 0.3s ease',
            }}
            filter={proximityGlow ? 'url(#candleGlow)' : undefined}
          >
            {/* Wick */}
            <line
              x1={x + CANDLE_WIDTH / 2}
              y1={c.h * SCALE + breathe}
              x2={x + CANDLE_WIDTH / 2}
              y2={c.l * SCALE + breathe}
              stroke={proximityGlow && bullish ? '#F66142' : color}
              strokeWidth={proximityGlow ? 2 : 1}
              style={{ transition: 'stroke-width 0.3s ease, stroke 0.3s ease' }}
            />
            {/* Body */}
            <rect
              x={x}
              y={bodyTop + breathe}
              width={CANDLE_WIDTH}
              height={Math.max(bodyH, 2)}
              fill={proximityGlow && bullish ? '#F66142' : color}
              rx="1.5"
              style={{
                transition: 'fill 0.3s ease',
                filter: proximityGlow ? `drop-shadow(0 0 6px rgba(246,97,66,${bullish ? 0.7 : 0.3}))` : 'none',
              }}
            />
            {/* Extra glow rect behind bullish candles on hover */}
            {proximityGlow && bullish && (
              <rect
                x={x - 3}
                y={bodyTop + breathe - 3}
                width={CANDLE_WIDTH + 6}
                height={Math.max(bodyH, 2) + 6}
                fill="none"
                stroke="#F66142"
                strokeWidth="0.5"
                rx="3"
                opacity="0.3"
              />
            )}
          </g>
        );
      })}

      {/* Moving price line connecting latest closes */}
      {candles.length > 2 && (
        <polyline
          points={candles
            .slice(-12)
            .map((c, i, arr) => {
              const offset = arr.length - 1 - i;
              const x = SVG_W - 30 - offset * GAP + CANDLE_WIDTH / 2;
              return `${x},${c.c * SCALE}`;
            })
            .join(' ')}
          stroke="rgba(246,97,66,0.2)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4,4"
        />
      )}
    </svg>
  );
}



/* ============================================
   Dashboard Chart SVG
   ============================================ */
function DashboardChart() {
  return (
    <svg viewBox="0 0 500 200" preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 50, 100, 150, 200].map(y => (
        <line key={y} x1="0" y1={y} x2="500" y2={y}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {/* Candlesticks */}
      {[
        { x: 30, o: 120, c: 90, h: 80, l: 135 },
        { x: 65, o: 90, c: 110, h: 75, l: 120 },
        { x: 100, o: 110, c: 85, h: 70, l: 125 },
        { x: 135, o: 85, c: 100, h: 65, l: 110 },
        { x: 170, o: 100, c: 75, h: 60, l: 115 },
        { x: 205, o: 75, c: 95, h: 55, l: 105 },
        { x: 240, o: 95, c: 70, h: 50, l: 100 },
        { x: 275, o: 70, c: 88, h: 45, l: 95 },
        { x: 310, o: 88, c: 65, h: 42, l: 95 },
        { x: 345, o: 65, c: 80, h: 40, l: 90 },
        { x: 380, o: 80, c: 55, h: 35, l: 85 },
        { x: 415, o: 55, c: 72, h: 30, l: 80 },
        { x: 450, o: 72, c: 48, h: 28, l: 78 },
      ].map((c, i) => {
        const bullish = c.c < c.o;
        const bodyTop = Math.min(c.o, c.c);
        const bodyH = Math.abs(c.o - c.c);
        const color = bullish ? '#F66142' : 'rgba(255,255,255,0.25)';
        return (
          <g key={i}>
            <line x1={c.x + 10} y1={c.h} x2={c.x + 10} y2={c.l}
              stroke={color} strokeWidth="1" />
            <rect x={c.x} y={bodyTop} width="20" height={Math.max(bodyH, 2)}
              fill={color} rx="1" />
          </g>
        );
      })}
      {/* Entry line */}
      <line x1="0" y1="80" x2="500" y2="80"
        stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4,4" />
      {/* Stop loss */}
      <line x1="0" y1="135" x2="500" y2="135"
        stroke="rgba(246,97,66,0.3)" strokeWidth="1" strokeDasharray="4,4" />
      {/* Target */}
      <line x1="0" y1="35" x2="500" y2="35"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />
    </svg>
  );
}

/* ============================================
   Floating market data numbers
   ============================================ */
function FloatingMarketData() {
  const items = useMemo(() => [
    { text: '182.45', x: '80%', y: '20%', delay: '0s' },
    { text: '+2.38%', x: '70%', y: '60%', delay: '2s' },
    { text: 'VOL 3.2M', x: '85%', y: '40%', delay: '4s' },
    { text: 'RSI 62', x: '75%', y: '75%', delay: '6s' },
    { text: '245.80', x: '90%', y: '30%', delay: '8s' },
    { text: 'MACD +0.4', x: '65%', y: '50%', delay: '3s' },
    { text: 'R:R 1:3', x: '88%', y: '65%', delay: '5s' },
  ], []);

  return (
    <>
      {items.map((item, i) => (
        <span
          key={i}
          className="market-data-float"
          style={{
            left: item.x,
            top: item.y,
            animationDelay: item.delay,
          }}
        >
          {item.text}
        </span>
      ))}
    </>
  );
}

/* ============================================
   HOME PAGE
   ============================================ */
export default function HomePage({ onNavigate }: HomePageProps) {
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [chartMouse, setChartMouse] = useState({ x: -1, y: -1 });
  const chartRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  useEffect(() => {
    const t = setTimeout(() => setHeroRevealed(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleChartMouse = useCallback((e: React.MouseEvent) => {
    const el = chartRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setChartMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleChartTouch = useCallback((e: React.TouchEvent) => {
    const el = chartRef.current;
    if (!el) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = el.getBoundingClientRect();
    setChartMouse({
      x: (touch.clientX - rect.left) / rect.width,
      y: (touch.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleChartLeave = useCallback(() => {
    setChartMouse({ x: -1, y: -1 });
  }, []);

  // Section reveals
  const promise = useScrollReveal(0.1);
  const modules = useStaggerReveal(6, 100, 0.1);
  const simulation = useScrollReveal(0.1);
  const stats = useScrollReveal(0.1);
  const cta = useScrollReveal(0.15);

  // Counters
  const count1 = useCountUp(12, 1200);
  const count2 = useCountUp(50, 1200);
  const count3 = useCountUp(100, 1200);

  // Dashboard tilt — disabled on touch devices
  const tilt = useTilt(5);

  // Card mouse tracking for glow — skip on touch (CSS handles it)
  const handleCardMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  }, [isTouchDevice]);

  const moduleData = [
    { title: 'Stock Market Basics', desc: 'Understand how markets function, key terminology, and how prices move.' },
    { title: 'Candlestick Patterns', desc: 'Read bullish and bearish candlestick patterns with precision.' },
    { title: 'Support & Resistance', desc: 'Identify key price levels where markets tend to react and reverse.' },
    { title: 'Trend Analysis', desc: 'Recognize market direction using trend lines and price structure.' },
    { title: 'Risk Management', desc: 'Control position sizing, stop losses, and protect your capital.' },
    { title: 'Trading Psychology', desc: 'Build emotional discipline and consistent decision-making habits.' },
  ];

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="hero" id="hero-section">
        <div className="hero-grid" />
        <div className="ticker-line" />
        <FloatingMarketData />

        <div
          className="hero-chart"
          ref={chartRef}
          onMouseMove={handleChartMouse}
          onMouseLeave={handleChartLeave}
          onTouchMove={handleChartTouch}
          onTouchEnd={handleChartLeave}
        >
          <HeroCandlestickChart mouseX={chartMouse.x} mouseY={chartMouse.y} />
        </div>

        <div className="hero-content">
          <h1 className="hero-headline">
            <span className={`line ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.3s' }}>
              Learn Stock Trading
            </span>
            <span className={`line ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.5s' }}>
              With <span className="accent">Strategy</span>, Discipline
            </span>
            <span className={`line ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.7s' }}>
              And <span className="accent">Confidence</span>
            </span>
          </h1>

          <p className={`hero-subtext ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.9s' }}>
            Master chart reading, price action, risk management, and trading psychology
            through structured lessons built for beginners and growing traders.
          </p>

          <div className={`hero-ctas ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '1.1s' }}>
            <button className="btn btn-primary" id="hero-start-learning">Start Learning</button>
            <button className="btn btn-outline" id="hero-explore-training">Explore Training</button>
          </div>
        </div>
      </section>

      {/* ============ LEARNING PROMISE ============ */}
      <div className="section-divider" />
      <section className="section promise-section" id="promise-section" ref={promise.ref}>
        <div className={`fade-in ${promise.isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">Trading education built for real market decisions.</h2>
          <p className="section-subtitle">
            At Stoxcom, we teach you how to read charts, understand market structure, manage risk,
            control emotions, and build a repeatable trading process.
          </p>
        </div>

        <div className="promise-grid">
          {[
            {
              icon: <ChartIcon />,
              title: 'Chart Reading',
              desc: 'Learn candlesticks, support, resistance, trendlines, and price action.',
            },
            {
              icon: <ShieldIcon />,
              title: 'Risk Management',
              desc: 'Understand position sizing, stop loss placement, and capital protection.',
            },
            {
              icon: <BrainIcon />,
              title: 'Trading Psychology',
              desc: 'Build discipline, patience, and emotional control in live market conditions.',
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`glass-card promise-card fade-in ${promise.isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.3 + i * 0.15}s` }}
              onMouseMove={handleCardMouse}
            >
              <div className="promise-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ COURSE MODULES ============ */}
      <div className="section-divider" />
      <section className="section modules-section" id="modules-section" ref={modules.containerRef}>
        <div className={`fade-in ${modules.visibleItems[0] ? 'visible' : ''}`}>
          <h2 className="section-title">What you will learn at Stoxcom</h2>
          <p className="section-subtitle">
            A structured path from beginner concepts to confident market execution.
          </p>
        </div>

        <div className="modules-grid">
          {moduleData.map((mod, i) => {
            const IconComponent = moduleIcons[i];
            return (
              <div
                key={i}
                className={`glass-card module-card fade-in ${modules.visibleItems[i] ? 'visible' : ''}`}
                style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
                onMouseMove={handleCardMouse}
              >
                <div className="module-icon"><IconComponent /></div>
                <div className="module-number">{String(i + 1).padStart(2, '0')}</div>
                <h3>{mod.title}</h3>
                <p>{mod.desc}</p>
                <div className="module-chart-line">
                  <svg viewBox="0 0 60 24">
                    <path d="M0,18 L10,14 L20,20 L30,8 L40,12 L50,4 L60,10" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ MARKET SIMULATION ============ */}
      <div className="section-divider" />
      <section className="section" id="simulation-section" ref={simulation.ref}>
        <div className={`simulation-section fade-in ${simulation.isVisible ? 'visible' : ''}`}>
          <div className="simulation-text">
            <h2>Practice reading the market before risking real capital.</h2>
            <p>
              Stoxcom helps students learn through examples, chart breakdowns,
              case studies, and simulated trade planning.
            </p>
          </div>

          <div
            className="dashboard-mockup"
            ref={tilt.ref}
            onMouseMove={isTouchDevice ? undefined : tilt.handleMove}
            onMouseLeave={isTouchDevice ? undefined : tilt.handleLeave}
          >
            <div className="dashboard-header">
              <span>STOXCOM TRADE PLANNER</span>
              <span style={{ color: '#F66142' }}>● LIVE SIMULATION</span>
            </div>

            <div className="dashboard-chart-area">
              <DashboardChart />
              <div className="trade-line entry" style={{ top: '38%' }}>
                <span>ENTRY 182.45</span>
              </div>
              <div className="trade-line stop-loss" style={{ top: '68%' }}>
                <span>STOP 176.20</span>
              </div>
              <div className="trade-line target" style={{ top: '15%' }}>
                <span>TARGET 194.80</span>
              </div>
            </div>

            <div className="dashboard-panels">
              <div className="dashboard-panel">
                <div className="panel-label">Risk / Reward</div>
                <div className="panel-value accent-val">1 : 2.8</div>
              </div>
              <div className="dashboard-panel">
                <div className="panel-label">Position Size</div>
                <div className="panel-value">150 shares</div>
              </div>
              <div className="dashboard-panel">
                <div className="panel-label">Risk Amount</div>
                <div className="panel-value">$937.50</div>
              </div>
            </div>

            <div className="watchlist">
              {['AAPL 182.45 +1.2%', 'TSLA 245.80 -0.8%', 'MSFT 412.30 +0.5%', 'NVDA 875.60 +2.1%', 'AMZN 178.90 -0.3%'].map((item, i) => (
                <span key={i} className="watchlist-item" style={{ animationDelay: `${i * 0.3}s` }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <div className="section-divider" />
      <section className="section stats-section" id="stats-section" ref={stats.ref}>
        <div className={`fade-in ${stats.isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">
            Designed to help traders build process, not guesswork.
          </h2>
        </div>

        <div className="stats-grid">
          <div className={`stat-item fade-in ${stats.isVisible ? 'visible' : ''}`} ref={count1.ref} style={{ transitionDelay: '0.2s' }}>
            <div className="stat-dot" />
            <div className="stat-number">{count1.count}<span className="plus">+</span></div>
            <div className="stat-label">Structured learning modules</div>
          </div>
          <div className={`stat-item fade-in ${stats.isVisible ? 'visible' : ''}`} ref={count2.ref} style={{ transitionDelay: '0.35s' }}>
            <div className="stat-dot" />
            <div className="stat-number">{count2.count}<span className="plus">+</span></div>
            <div className="stat-label">Chart breakdown examples</div>
          </div>
          <div className={`stat-item fade-in ${stats.isVisible ? 'visible' : ''}`} ref={count3.ref} style={{ transitionDelay: '0.5s' }}>
            <div className="stat-dot" />
            <div className="stat-number">{count3.count}<span className="plus">+</span></div>
            <div className="stat-label">Trading concepts explained</div>
          </div>
          <div className={`stat-item fade-in ${stats.isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.65s' }}>
            <div className="stat-dot" />
            <div className="stat-number">1</div>
            <div className="stat-label">Disciplined trading framework</div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <div className="section-divider" />
      <section className="section cta-section" id="home-cta" ref={cta.ref}>
        <div className="cta-bg-chart">
          <svg viewBox="0 0 800 200" preserveAspectRatio="none">
            <path
              d="M0,150 L50,130 L100,140 L150,110 L200,120 L250,90 L300,100 L350,70 L400,85 L450,55 L500,70 L550,40 L600,60 L650,30 L700,45 L750,20 L800,35"
              stroke="rgba(246,97,66,0.15)" strokeWidth="2" fill="none"
            />
          </svg>
        </div>

        <div className={`fade-in ${cta.isVisible ? 'visible' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="section-title">
            Start learning the market with a clear trading framework.
          </h2>
          <p className="section-subtitle">
            Build the knowledge, discipline, and confidence needed to understand
            stock price movement with Stoxcom.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary" id="cta-start-learning">Start Learning</button>
            <button className="btn btn-outline" id="cta-about" onClick={() => onNavigate('about')}>
              About Stoxcom
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
