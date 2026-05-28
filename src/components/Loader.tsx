import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2200);
    const t2 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Pulsing glow behind logo */}
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        animate={{
          background: [
            'radial-gradient(circle, rgba(246, 97, 66, 0.1) 0%, transparent 60%)',
            'radial-gradient(circle, rgba(246, 97, 66, 0.18) 0%, transparent 65%)',
            'radial-gradient(circle, rgba(246, 97, 66, 0.1) 0%, transparent 60%)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Logo */}
      <div className="relative z-10">
        <motion.img
          src="/STX-logo.png"
          alt="Stoxcom"
          className="w-10 h-10 object-contain"
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
      </div>
    </motion.div>
  );
}
