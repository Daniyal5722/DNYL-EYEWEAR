import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    // Detect touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    setIsTouch(isTouchDevice);

    if (isTouchDevice || prefersReducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest('button, a, input, textarea, [role="button"], .cursor-pointer, label');
      setIsHovered(Boolean(clickable));
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
    };
  }, [isVisible, prefersReducedMotion]);

  if (isTouch || prefersReducedMotion || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Precision cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
        animate={{
          x: position.x - (isHovered ? 18 : 3),
          y: position.y - (isHovered ? 18 : 3),
          width: isHovered ? 36 : 6,
          height: isHovered ? 36 : 6,
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
          border: isHovered ? '1px solid rgba(255, 255, 255, 0.8)' : 'none',
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 400,
          mass: 0.2,
        }}
      />
    </>
  );
}
