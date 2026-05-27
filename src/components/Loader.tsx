import { useEffect, useState, useMemo } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2200);
    const removeTimer = setTimeout(() => onComplete(), 2800);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${2 + Math.random() * 2}s`,
        color: i % 3 === 0 ? '#F66142' : 'rgba(255,255,255,0.4)',
        size: `${1 + Math.random() * 2}px`,
      })),
    []
  );

  return (
    <div className={`loader-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* Background particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="loader-particle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            background: p.color,
            width: p.size,
            height: p.size,
          }}
        />
      ))}

      {/* Candlestick line behind logo */}
      <div className="loader-candlestick-line">
        <svg viewBox="0 0 300 60">
          <path d="M0,40 L30,35 L50,42 L70,28 L90,32 L110,20 L130,25 L150,15 L170,22 L190,12 L210,18 L230,8 L250,14 L270,6 L300,10" />
        </svg>
      </div>

      {/* Logo container */}
      <div className="loader-logo-container">
        <div className="loader-glow" />
        <div className="loader-ring" />
        <img
          src="/STX-logo.png"
          alt="Stoxcom"
          className="loader-logo"
        />
      </div>
    </div>
  );
}
