import { useRef, MouseEvent, ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;   // tilt strength, default 12
  glare?: boolean;      // show glare reflection
}

/**
 * Wraps any card in a 3-D perspective tilt that follows the mouse.
 * Works with any child content.
 */
export function TiltCard({
  children,
  className = '',
  style = {},
  intensity = 12,
  glare = true,
}: TiltCardProps) {
  const ref  = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / (rect.height / 2)) * -intensity;
    const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  intensity;

    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
    el.style.transition = 'transform 0.08s ease-out';

    if (glare && glareRef.current) {
      // angle the glare based on mouse position within card
      const glareX = ((e.clientX - rect.left) / rect.width ) * 100;
      const glareY = ((e.clientY - rect.top ) / rect.height) * 100;
      glareRef.current.style.background =
        `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.1) 0%, transparent 65%)`;
      glareRef.current.style.opacity = '1';
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    if (glare && glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transformStyle: 'preserve-3d', willChange: 'transform', position: 'relative' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position:      'absolute',
            inset:         0,
            borderRadius:  'inherit',
            pointerEvents: 'none',
            opacity:       0,
            transition:    'opacity 0.3s ease',
            zIndex:        5,
          }}
        />
      )}
    </div>
  );
}
