import { useMemo } from 'react';

/**
 * Reusable particle system component.
 * Renders floating particles using pure CSS animations — no JS animation loops.
 *
 * @param {Object} props
 * @param {number}  [props.count=30]       Number of particles
 * @param {string}  [props.color='#d4a853'] Particle color
 * @param {string}  [props.size='4px']     Base size of particles
 * @param {number}  [props.speed=1]        Animation speed multiplier (lower = slower)
 * @param {'star'|'circle'|'heart'} [props.type='circle'] Particle shape
 */
export default function Particles({
  count = 30,
  color = '#d4a853',
  size = '4px',
  speed = 1,
  type = 'circle',
}) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = (4 + Math.random() * 6) / speed;
      const opacity = 0.2 + Math.random() * 0.6;
      const sizeMultiplier = 0.5 + Math.random() * 1;
      const driftX = (Math.random() - 0.5) * 40;

      return {
        key: i,
        left,
        top,
        delay,
        duration,
        opacity,
        sizeMultiplier,
        driftX,
      };
    });
  }, [count, speed]);

  const getShape = (particleType) => {
    switch (particleType) {
      case 'star':
        return '★';
      case 'heart':
        return '♥';
      case 'circle':
      default:
        return null;
    }
  };

  const shape = getShape(type);

  return (
    <div style={containerStyle} aria-hidden="true">
      {particles.map((p) => {
        const computedSize = `calc(${size} * ${p.sizeMultiplier})`;

        const particleStyle = {
          position: 'absolute',
          left: `${p.left}%`,
          top: `${p.top}%`,
          width: shape ? 'auto' : computedSize,
          height: shape ? 'auto' : computedSize,
          fontSize: shape ? computedSize : undefined,
          lineHeight: 1,
          color: shape ? color : undefined,
          backgroundColor: shape ? undefined : color,
          borderRadius: shape ? undefined : '50%',
          opacity: p.opacity,
          animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite alternate,
                      particle-twinkle ${p.duration * 0.7}s ease-in-out ${p.delay}s infinite alternate`,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          '--drift-x': `${p.driftX}px`,
        };

        return shape ? (
          <span key={p.key} style={particleStyle}>
            {shape}
          </span>
        ) : (
          <span key={p.key} style={particleStyle} />
        );
      })}

      {/* Inline keyframes for particle animations */}
      <style>{`
        @keyframes particle-float {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(var(--drift-x, 10px), -20px) scale(1.1);
          }
          100% {
            transform: translate(calc(var(--drift-x, 10px) * -0.5), 15px) scale(0.9);
          }
        }
        @keyframes particle-twinkle {
          0%, 100% {
            opacity: var(--tw-start, 0.3);
          }
          50% {
            opacity: var(--tw-end, 0.9);
          }
        }
      `}</style>
    </div>
  );
}

const containerStyle = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 0,
};
