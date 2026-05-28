import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

const centerFlex: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 99999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#000',
};

const gridBg: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  opacity: 0.2,
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
  pointerEvents: 'none',
};

const glowStyle: React.CSSProperties = {
  position: 'absolute',
  width: 96,
  height: 96,
  borderRadius: '50%',
};

const logoStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 10,
  width: 40,
  height: 40,
  objectFit: 'contain',
};

export default function Loader({ onComplete }: LoaderProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2200);
    const t2 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      style={centerFlex}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div style={gridBg} />

      <motion.div
        style={glowStyle}
        animate={{
          background: [
            'radial-gradient(circle, rgba(246, 97, 66, 0.1) 0%, transparent 60%)',
            'radial-gradient(circle, rgba(246, 97, 66, 0.18) 0%, transparent 65%)',
            'radial-gradient(circle, rgba(246, 97, 66, 0.1) 0%, transparent 60%)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <motion.img
        src="/STX-logo.png"
        alt="Stoxcom"
        style={logoStyle}
        animate={{
          y: [0, -4, 0],
          filter: [
            'drop-shadow(0 0 10px rgba(246, 97, 66, 0.25)) drop-shadow(0 0 20px rgba(246, 97, 66, 0.1))',
            'drop-shadow(0 0 20px rgba(246, 97, 66, 0.5)) drop-shadow(0 0 40px rgba(246, 97, 66, 0.2))',
            'drop-shadow(0 0 10px rgba(246, 97, 66, 0.25)) drop-shadow(0 0 20px rgba(246, 97, 66, 0.1))',
          ],
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          filter: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </motion.div>
  );
}
