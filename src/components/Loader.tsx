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
      <div className="absolute inset-0 grid-bg opacity-50" />

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at center, rgba(246, 97, 66, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at center, rgba(246, 97, 66, 0.25) 0%, transparent 60%)',
            'radial-gradient(circle at center, rgba(246, 97, 66, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div className="relative">
          <motion.img
            src="/STX-logo.png"
            alt="Stoxcom"
            className="w-32 h-32 md:w-48 md:h-48 object-contain glow-orange"
            initial={{
              filter: 'drop-shadow(0 0 20px rgba(246, 97, 66, 0.4)) drop-shadow(0 0 40px rgba(246, 97, 66, 0.2))',
            }}
            animate={{
              y: [0, -8, 0],
              filter: [
                'drop-shadow(0 0 20px rgba(246, 97, 66, 0.4)) drop-shadow(0 0 40px rgba(246, 97, 66, 0.2))',
                'drop-shadow(0 0 40px rgba(246, 97, 66, 0.8)) drop-shadow(0 0 60px rgba(246, 97, 66, 0.4))',
                'drop-shadow(0 0 20px rgba(246, 97, 66, 0.4)) drop-shadow(0 0 40px rgba(246, 97, 66, 0.2))',
              ],
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              filter: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
