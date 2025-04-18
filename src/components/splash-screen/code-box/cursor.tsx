import { motion } from 'framer-motion';

export function CodeBoxCursor({
  cursorPosition,
}: {
  cursorPosition: { top: number; left: number };
}) {
  return (
    <motion.div
      className="absolute inline-block w-[1.5px] h-[1.1rem] bg-primary"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      style={{
        top: `${cursorPosition.top}rem`,
        left: `${cursorPosition.left}rem`,
        marginTop: '0.2rem',
      }}
    />
  );
}
