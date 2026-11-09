import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';
import birthdayConfig from '../config/birthdayConfig';
import Particles from '../components/Particles';
import './WelcomeScreen.css';

/* ── Starfield background ─────────────────────────────── */
function Starfield({ count = 60 }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2.5 + 0.5,
        duration: `${Math.random() * 4 + 2}s`,
        delay: `${Math.random() * 5}s`,
      })),
    [count]
  );

  return (
    <div className="welcome-starfield">
      {stars.map((s) => (
        <div
          key={s.id}
          className="welcome-star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            '--duration': s.duration,
            '--delay': s.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ── Inline envelope SVG with heart seal ──────────────── */
function EnvelopeSVG({ isOpen }) {
  return (
    <div className={`welcome-envelope-wrap ${isOpen ? 'envelope-open' : ''}`}>
      <div className="welcome-envelope-glow" />
      <svg
        className="welcome-envelope-svg"
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Envelope body */}
        <rect
          x="8"
          y="28"
          width="104"
          height="66"
          rx="6"
          fill="#fff7f7"
          stroke="#c51e43"
          strokeWidth="1.5"
        />
        {/* Inner shadow */}
        <rect
          x="12"
          y="32"
          width="96"
          height="58"
          rx="4"
          fill="#ffe5e9"
          opacity="0.8"
        />
        {/* Flap (triangle) */}
        <path
          className="envelope-flap"
          d="M8 28 L60 65 L112 28 Z"
          fill="#fff0f2"
          stroke="#c51e43"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Bottom V fold line */}
        <path
          d="M8 94 L60 62 L112 94"
          stroke="rgba(197,30,67,0.22)"
          strokeWidth="0.8"
          fill="none"
        />
        {/* Heart seal */}
        <g transform="translate(60, 48)">
          <circle r="11" fill="#c51e43" opacity="0.12" />
          <circle
            r="9"
            fill="none"
            stroke="#c51e43"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M0-3 C-2-7 -7-7 -7-3 C-7 0 0 5 0 5 C0 5 7 0 7-3 C7-7 2-7 0-3Z"
            fill="#c51e43"
            opacity="0.8"
          />
        </g>
        {/* Subtle edge highlights */}
        <line
          x1="10"
          y1="30"
          x2="10"
          y2="92"
          stroke="rgba(212,168,83,0.08)"
          strokeWidth="0.5"
        />
        <line
          x1="110"
          y1="30"
          x2="110"
          y2="92"
          stroke="rgba(212,168,83,0.08)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

/* ── WelcomeScreen Component ──────────────────────────── */
export default function WelcomeScreen({ onUnlock, onMusicStart }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const inputRef = useRef(null);
  const [shakeKey, setShakeKey] = useState(0);

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      if (isUnlocking) return;

      if (password.toLowerCase() === birthdayConfig.password.toLowerCase()) {
        setError('');
        setIsUnlocking(true);

        // Start music
        if (onMusicStart) onMusicStart();

        // Show envelope opening + burst
        setTimeout(() => setShowBurst(true), 400);

        // Transition out
        setTimeout(() => {
          if (onUnlock) onUnlock();
        }, 1500);
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 3) {
          setShowPassword(true);
          setPassword('');
          setError('The password is shown below. Type it in to continue.');
        } else {
          const remaining = 3 - nextAttempts;
          setError(`Incorrect password. ${remaining} ${remaining === 1 ? 'try' : 'tries'} remaining.`);
        }
        setShakeKey((k) => k + 1);
        if (inputRef.current) inputRef.current.focus();
      }
    },
    [password, isUnlocking, onUnlock, onMusicStart, failedAttempts]
  );

  return (
    <div className="welcome-screen">
      <Starfield count={60} />
      <Particles count={35} color="#d4a853" />

      <AnimatePresence>
        {!isUnlocking && (
          <motion.div
            className="welcome-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <EnvelopeSVG isOpen={false} />

            <h1 className="welcome-title">
              {birthdayConfig.welcome.title}
            </h1>
            <p className="welcome-subtitle">
              {birthdayConfig.welcome.subtitle}
            </p>

            <form className="welcome-form" onSubmit={handleSubmit}>
              <motion.div
                className="welcome-input-wrap"
                key={shakeKey}
                animate={
                  shakeKey > 0
                    ? {
                        x: [0, -12, 12, -10, 10, -6, 6, 0],
                        transition: { duration: 0.5 },
                      }
                    : {}
                }
              >
                <input
                  ref={inputRef}
                  className="welcome-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter the secret password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  autoComplete="off"
                  autoFocus
                />
                <button
                  type="button"
                  className="welcome-toggle-pw"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>

              <AnimatePresence>
                {failedAttempts >= 3 && (
                  <motion.p
                    className="welcome-password-reveal"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    aria-live="polite"
                  >
                    <span>Password</span>
                    <strong>{birthdayConfig.password}</strong>
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                className="welcome-unlock-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Lock size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                Unlock
              </motion.button>

              <p className="welcome-hint">{birthdayConfig.welcome.hint}</p>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    className="welcome-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlocking: Envelope opens + golden light burst */}
      <AnimatePresence>
        {isUnlocking && (
          <motion.div
            className="welcome-unlock-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.2, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <EnvelopeSVG isOpen={true} />
            </motion.div>
            <div className={`welcome-light-burst ${showBurst ? 'active' : ''}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
