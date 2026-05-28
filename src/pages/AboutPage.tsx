import { useEffect, useState, useCallback, useRef } from 'react';
import {
  useScrollReveal,
  useStaggerReveal,
  useScrollProgress,
} from '../hooks/useAnimations';

interface AboutPageProps {
  onNavigate: (page: 'home' | 'about') => void;
}

/* ============================================
   Teaching Method Icons
   ============================================ */
function UnderstandIcon() {
  return (
    <svg viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="14" />
      <path d="M14,20 L18,24 L26,16" />
    </svg>
  );
}

function AnalyzeIcon() {
  return (
    <svg viewBox="0 0 40 40">
      <rect x="6" y="6" width="28" height="28" rx="3" />
      <polyline points="10,28 16,20 22,24 28,14" />
    </svg>
  );
}

function PlanIcon() {
  return (
    <svg viewBox="0 0 40 40">
      <path d="M10,8 L30,8 L30,32 L10,32 Z" />
      <line x1="14" y1="14" x2="26" y2="14" />
      <line x1="14" y1="19" x2="26" y2="19" />
      <line x1="14" y1="24" x2="22" y2="24" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg viewBox="0 0 40 40">
      <circle cx="18" cy="18" r="10" />
      <line x1="25" y1="25" x2="34" y2="34" />
    </svg>
  );
}

/* Expertise icons */
function MarketStructureIcon() {
  return (
    <svg viewBox="0 0 44 44">
      <polyline points="6,34 14,22 22,28 30,14 38,10" />
      <line x1="6" y1="38" x2="38" y2="38" />
      <line x1="6" y1="6" x2="6" y2="38" />
    </svg>
  );
}

function PriceActionIcon() {
  return (
    <svg viewBox="0 0 44 44">
      <rect x="10" y="14" width="8" height="16" rx="1" />
      <line x1="14" y1="8" x2="14" y2="14" />
      <line x1="14" y1="30" x2="14" y2="36" />
      <rect x="26" y="10" width="8" height="18" rx="1" />
      <line x1="30" y1="6" x2="30" y2="10" />
      <line x1="30" y1="28" x2="30" y2="36" />
    </svg>
  );
}

function RiskPlanIcon() {
  return (
    <svg viewBox="0 0 44 44">
      <path d="M22,6 L38,14 L38,26 C38,34 30,40 22,42 C14,40 6,34 6,26 L6,14 Z" />
      <line x1="22" y1="16" x2="22" y2="26" />
      <circle cx="22" cy="31" r="2" />
    </svg>
  );
}

function TraderPsychIcon() {
  return (
    <svg viewBox="0 0 44 44">
      <circle cx="22" cy="16" r="10" />
      <path d="M14,34 C14,28 30,28 30,34" />
      <path d="M18,14 Q22,10 26,14" />
    </svg>
  );
}

/* ============================================
   Live Animated Candlestick Chart for About Hero
   ============================================ */
interface CandleData {
  id: number;
  o: number;
  c: number;
  h: number;
  l: number;
  age: number;
  fadingOut: boolean;
}

function generateCandle(id: number, prevClose: number): CandleData {
  const drift = (Math.random() - 0.45) * 12;
  const o = prevClose;
  const c = Math.max(10, Math.min(85, o + drift));
  const wickUp = Math.random() * 8 + 2;
  const wickDn = Math.random() * 8 + 2;
  const h = Math.min(o, c) - wickUp;
  const l = Math.max(o, c) + wickDn;
  return { id, o, c, h: Math.max(5, h), l: Math.min(90, l), age: 0, fadingOut: false };
}

function AboutHeroCandlestickChart({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const MAX_CANDLES = 18;
  const CANDLE_WIDTH = 14;
  const GAP = 32;
  const SVG_W = 620;
  const SVG_H = 280;
  const SCALE = SVG_H / 100;
  const nextId = useRef(0);
  const rafRef = useRef<number>(0);
  const frameCount = useRef(0);

  const [candles, setCandles] = useState<CandleData[]>(() => {
    const seed: CandleData[] = [];
    let prev = 50;
    for (let i = 0; i < MAX_CANDLES; i++) {
      const cd = generateCandle(nextId.current++, prev);
      cd.age = 999;
      seed.push(cd);
      prev = cd.c;
    }
    return seed;
  });

  useEffect(() => {
    const INTERVAL = 90;
    const tick = () => {
      frameCount.current++;
      setCandles(prev => {
        let updated = prev.map(c => ({ ...c, age: c.age + 1 }));
        if (frameCount.current % INTERVAL === 0) {
          const lastClose = updated.length > 0 ? updated[updated.length - 1].c : 50;
          const newCandle = generateCandle(nextId.current++, lastClose);
          updated = [...updated, newCandle];
        }
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

  const glowXPct = Math.max(0, Math.min(1, mouseX));
  const glowYPct = Math.max(0, Math.min(1, mouseY));
  const isHovering = mouseX >= 0 && mouseX <= 1 && mouseY >= 0 && mouseY <= 1;

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="none">
      <defs>
        <radialGradient id="aboutChartGlow" cx={glowXPct} cy={glowYPct} r="0.4">
          <stop offset="0%" stopColor="#F66142" stopOpacity={isHovering ? 0.45 : 0} />
          <stop offset="50%" stopColor="#F66142" stopOpacity={isHovering ? 0.12 : 0} />
          <stop offset="100%" stopColor="#F66142" stopOpacity="0" />
        </radialGradient>
        <filter id="aboutCandleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width={SVG_W} height={SVG_H}
        fill="url(#aboutChartGlow)"
        style={{ transition: 'opacity 0.4s ease', opacity: isHovering ? 1 : 0 }}
      />

      {[56, 112, 168, 224].map(y => (
        <line key={y} x1="0" y1={y} x2={SVG_W} y2={y}
          stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}

      {candles.map((c, i) => {
        const offset = candles.length - 1 - i;
        const x = SVG_W - 28 - offset * GAP;
        const bullish = c.c < c.o;
        const bodyTop = Math.min(c.o, c.c) * SCALE;
        const bodyH = Math.abs(c.o - c.c) * SCALE;
        const color = bullish ? '#F66142' : 'rgba(255,255,255,0.3)';
        const entryProgress = Math.min(c.age / 12, 1);
        const fadeOutOpacity = c.fadingOut ? Math.max(0, 1 - (c.age - 20) / 10) : 1;
        const opacity = entryProgress * fadeOutOpacity;
        const breathe = Math.sin((frameCount.current + i * 20) * 0.02) * 1.5;
        const candleCenterX = x + CANDLE_WIDTH / 2;
        const candleCenterY = ((c.o + c.c) / 2) * SCALE;
        const cursorSvgX = glowXPct * SVG_W;
        const cursorSvgY = glowYPct * SVG_H;
        const dist = Math.sqrt(
          (candleCenterX - cursorSvgX) ** 2 + (candleCenterY - cursorSvgY) ** 2
        );
        const proximityGlow = isHovering && dist < 130;

        return (
          <g key={c.id}
            style={{ opacity, transform: `translateY(${(1 - (0.3 + entryProgress * 0.7)) * 20 + breathe}px)`, transition: 'opacity 0.3s ease' }}
            filter={proximityGlow ? 'url(#aboutCandleGlow)' : undefined}
          >
            <line
              x1={x + CANDLE_WIDTH / 2} y1={c.h * SCALE + breathe}
              x2={x + CANDLE_WIDTH / 2} y2={c.l * SCALE + breathe}
              stroke={proximityGlow && bullish ? '#F66142' : color}
              strokeWidth={proximityGlow ? 2 : 1}
              style={{ transition: 'stroke-width 0.3s ease, stroke 0.3s ease' }}
            />
            <rect
              x={x} y={bodyTop + breathe}
              width={CANDLE_WIDTH} height={Math.max(bodyH, 2)}
              fill={proximityGlow && bullish ? '#F66142' : color}
              rx="1.5"
              style={{ transition: 'fill 0.3s ease', filter: proximityGlow ? `drop-shadow(0 0 8px rgba(246,97,66,${bullish ? 0.8 : 0.35}))` : 'none' }}
            />
            {proximityGlow && bullish && (
              <rect
                x={x - 3} y={bodyTop + breathe - 3}
                width={CANDLE_WIDTH + 6} height={Math.max(bodyH, 2) + 6}
                fill="none" stroke="#F66142" strokeWidth="0.5" rx="3" opacity="0.35"
              />
            )}
          </g>
        );
      })}

      {candles.length > 2 && (
        <polyline
          points={candles.slice(-12).map((c, i, arr) => {
            const offset = arr.length - 1 - i;
            const x = SVG_W - 28 - offset * GAP + CANDLE_WIDTH / 2;
            return `${x},${c.c * SCALE}`;
          }).join(' ')}
          stroke="rgba(246,97,66,0.25)" strokeWidth="1.5" fill="none" strokeDasharray="4,4"
        />
      )}
    </svg>
  );
}

function AboutFloatingMarketData() {
  const items = [
    { text: '3,842.15', x: '75%', y: '18%', delay: '0s' },
    { text: '-1.45%', x: '82%', y: '55%', delay: '3s' },
    { text: 'VOL 5.8M', x: '68%', y: '42%', delay: '5s' },
    { text: 'ATR 4.2', x: '88%', y: '70%', delay: '2s' },
    { text: '412.30', x: '78%', y: '32%', delay: '7s' },
    { text: 'EMA 21', x: '72%', y: '65%', delay: '4s' },
  ];
  return (
    <>
      {items.map((item, i) => (
        <span key={i} className="market-data-float"
          style={{ left: item.x, top: item.y, animationDelay: item.delay }}>
          {item.text}
        </span>
      ))}
    </>
  );
}

/* ============================================
   ABOUT PAGE
   ============================================ */
export default function AboutPage({ onNavigate }: AboutPageProps) {
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

  const mission = useScrollReveal(0.1);
  const teaching = useStaggerReveal(4, 150, 0.1);
  const expertise = useStaggerReveal(4, 120, 0.1);
  const timeline = useScrollProgress();
  const values = useStaggerReveal(4, 100, 0.1);
  const ctaReveal = useScrollReveal(0.15);

  const handleCardMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  }, [isTouchDevice]);

  const teachingMethods = [
    { icon: <UnderstandIcon />, step: 'Step 01', title: 'Understand', desc: 'Learn the foundation of stock markets and price behavior.' },
    { icon: <AnalyzeIcon />, step: 'Step 02', title: 'Analyze', desc: 'Break down charts using structure, trend, support, and resistance.' },
    { icon: <PlanIcon />, step: 'Step 03', title: 'Plan', desc: 'Build trade ideas with entry, stop loss, target, and risk/reward.' },
    { icon: <ReviewIcon />, step: 'Step 04', title: 'Review', desc: 'Study outcomes, improve decision-making, and refine your process.' },
  ];

  const expertiseCards = [
    { icon: <MarketStructureIcon />, title: 'Market Structure' },
    { icon: <PriceActionIcon />, title: 'Price Action' },
    { icon: <RiskPlanIcon />, title: 'Risk Planning' },
    { icon: <TraderPsychIcon />, title: 'Trader Psychology' },
  ];

  const timelineItems = [
    { step: 'Step 01', title: 'Learn the language of the market' },
    { step: 'Step 02', title: 'Understand chart behavior' },
    { step: 'Step 03', title: 'Build risk-controlled trade plans' },
    { step: 'Step 04', title: 'Develop discipline through repetition' },
  ];

  const valueItems = [
    'Education First',
    'Risk Awareness',
    'Emotional Control',
    'Long-Term Skill Building',
  ];

  // Determine active timeline items based on scroll progress
  const activeTimelineCount = Math.floor(timeline.progress * 5);

  return (
    <div>
      {/* ============ ABOUT HERO ============ */}
      <section className="hero about-hero" id="about-hero">
        <div className="hero-grid" />
        <div className="ticker-line" />
        <AboutFloatingMarketData />

        {/* Live animated candlestick chart */}
        <div
          className="hero-chart"
          ref={chartRef}
          onMouseMove={handleChartMouse}
          onMouseLeave={handleChartLeave}
          onTouchMove={handleChartTouch}
          onTouchEnd={handleChartLeave}
        >
          <AboutHeroCandlestickChart mouseX={chartMouse.x} mouseY={chartMouse.y} />
        </div>

        {/* Background line graph overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', opacity: 0.08, zIndex: 1, pointerEvents: 'none' }}>
          <svg viewBox="0 0 800 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path
              d="M0,180 L40,160 L80,170 L120,140 L160,150 L200,120 L240,130 L280,100 L320,110 L360,80 L400,95 L440,65 L480,80 L520,50 L560,65 L600,35 L640,50 L680,25 L720,40 L760,15 L800,30"
              stroke="#F66142" strokeWidth="2" fill="none"
              style={{
                strokeDasharray: 1200,
                strokeDashoffset: heroRevealed ? 0 : 1200,
                transition: 'stroke-dashoffset 2.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
              }}
            />
          </svg>
        </div>

        <div className="hero-content">
          <h1 className="hero-headline">
            <span className={`line ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.3s' }}>
              Stoxcom teaches traders
            </span>
            <span className={`line ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.5s' }}>
              how to <span className="accent">think</span>, <span className="accent">plan</span>, and execute
            </span>
            <span className={`line ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.7s' }}>
              with <span className="accent">discipline</span>.
            </span>
          </h1>

          <p className={`hero-subtext ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.9s' }}>
            Stoxcom was created to simplify stock trading education and help learners
            understand the market through structure, patience, and repeatable systems.
          </p>
        </div>
      </section>

      {/* ============ MISSION ============ */}
      <div className="section-divider" />
      <section className="section" id="mission-section" ref={mission.ref}>
        <div className={`mission-section`}>
          <div className={`mission-left fade-in-left ${mission.isVisible ? 'visible' : ''}`}>
            <h2>Our mission is to make trading education clear, practical, and disciplined.</h2>
          </div>

          <div className={`mission-right fade-in-right ${mission.isVisible ? 'visible' : ''}`}>
            <p>
              At Stoxcom, we believe successful trading starts with education, not prediction.
              Our training focuses on market structure, risk control, emotional discipline,
              and process-driven decision making.
            </p>

            <div className="mission-pillars">
              {['Clarity over confusion', 'Process over prediction', 'Discipline over emotion'].map((pillar, i) => (
                <div
                  key={i}
                  className="mission-pillar"
                  style={{ transitionDelay: `${0.6 + i * 0.15}s` }}
                >
                  <div className="pillar-accent" />
                  <span>{pillar}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TEACHING METHOD ============ */}
      <div className="section-divider" />
      <section className="section teaching-section" id="teaching-section" ref={teaching.containerRef}>
        <div className={`fade-in ${teaching.visibleItems[0] ? 'visible' : ''}`}>
          <h2 className="section-title">How Stoxcom teaches</h2>
          <p className="section-subtitle">
            A practical learning system designed around real chart behavior.
          </p>
        </div>

        <div className="teaching-cards">
          <div className="teaching-connector" aria-hidden="true">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="teaching-connector-dot" style={{ transitionDelay: `${0.1 + i * 0.12}s` }} />
            ))}
          </div>
          {teachingMethods.map((method, i) => (
            <div
              key={i}
              className={`glass-card teaching-card fade-in ${teaching.visibleItems[i] ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.1 + i * 0.12}s` }}
              onMouseMove={handleCardMouse}
            >
              <div className="card-icon">{method.icon}</div>
              <div className="step-number">{method.step}</div>
              <h3>{method.title}</h3>
              <p>{method.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ EXPERTISE ============ */}
      <div className="section-divider" />
      <section className="section expertise-section" id="expertise-section" ref={expertise.containerRef}>
        <div className={`fade-in ${expertise.visibleItems[0] ? 'visible' : ''}`}>
          <h2 className="section-title">
            Built by market educators focused on practical trading knowledge.
          </h2>
          <p className="section-subtitle">
            Stoxcom lessons are designed around real trading concepts, chart examples,
            risk planning, and psychological discipline. Every module is created to help
            students understand why price moves and how to respond with a plan.
          </p>
        </div>

        <div className="expertise-grid">
          {expertiseCards.map((card, i) => (
            <div
              key={i}
              className={`glass-card expertise-card fade-in ${expertise.visibleItems[i] ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
              onMouseMove={handleCardMouse}
            >
              <div className="expertise-icon">{card.icon}</div>
              <h3>{card.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ============ TIMELINE ============ */}
      <div className="section-divider" />
      <section className="section timeline-section" id="timeline-section">
        <div className="fade-in visible">
          <h2 className="section-title">From confusion to structure.</h2>
        </div>

        <div className="timeline-container" ref={timeline.ref}>
          <div className="timeline-track">
            <div
              className="timeline-track-fill"
              style={{ height: `${Math.min(timeline.progress * 140, 100)}%` }}
            />
          </div>
          {timelineItems.map((item, i) => (
            <div
              key={i}
              className={`timeline-item ${i < activeTimelineCount ? 'active' : ''}`}
            >
              <div className="timeline-marker" />
              <div className="step-label">{item.step}</div>
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ============ VALUES ============ */}
      <div className="section-divider" />
      <section className="section values-section" id="values-section" ref={values.containerRef}>
        <div className={`fade-in ${values.visibleItems[0] ? 'visible' : ''}`}>
          <h2 className="section-title">What Stoxcom stands for</h2>
        </div>

        <div className="values-grid">
          {valueItems.map((val, i) => (
            <div
              key={i}
              className={`glass-card value-card fade-in ${values.visibleItems[i] ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
              onMouseMove={handleCardMouse}
            >
              <div className="value-accent" />
              <h3>{val}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <div className="section-divider" />
      <section className="section cta-section" id="about-cta" ref={ctaReveal.ref}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', opacity: 0.04, zIndex: 0 }}>
          <svg viewBox="0 0 800 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path
              d="M0,160 L50,140 L100,150 L150,120 L200,130 L250,100 L300,110 L350,80 L400,90 L450,60 L500,75 L550,45 L600,60 L650,30 L700,50 L750,20 L800,35"
              stroke="rgba(246,97,66,0.2)" strokeWidth="2" fill="none"
            />
          </svg>
        </div>

        <div className={`fade-in ${ctaReveal.isVisible ? 'visible' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="section-title">
            Ready to understand the market with more clarity?
          </h2>
          <p className="section-subtitle">
            Start with structured stock trading education built around process, discipline,
            and real chart analysis through Stoxcom.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary" id="about-start-learning">Start Learning</button>
            <button className="btn btn-outline" id="about-back-home" onClick={() => onNavigate('home')}>
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
