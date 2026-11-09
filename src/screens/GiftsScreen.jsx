import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import birthdayConfig from '../config/birthdayConfig';
import './GiftsScreen.css';

/* ── helpers ──────────────────────────────────────────── */

function lighten(hex, amount = 30) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `rgb(${r},${g},${b})`;
}

const SPARKLE_COLORS = ['#f5d9a0', '#fff', '#ff9ff3', '#feca57', '#48dbfb'];
const CONFETTI_COLORS = ['#f5d9a0', '#e74c3c', '#ff6b9d', '#3498db', '#9b59b6', '#2ecc71'];

function createSparkles(count = 12) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 140,
    y: (Math.random() - 0.5) * 120,
    color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
    delay: Math.random() * 0.4,
    size: 4 + Math.random() * 6,
  }));
}

function createConfetti(count = 50) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 1.5,
    size: 6 + Math.random() * 8,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
    duration: 2 + Math.random() * 2,
  }));
}

function GiftArtwork({ gift }) {
  if (gift.type === 'teddy') return <svg className="gift-art-teddy" viewBox="0 0 320 340" role="img" aria-label="A big cuddly teddy bear">
    <defs><linearGradient id="teddyFur" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d59b67"/><stop offset="1" stopColor="#a95f43"/></linearGradient></defs>
    <ellipse cx="160" cy="292" rx="116" ry="22" fill="#86273b" opacity=".18"/>
    <circle cx="82" cy="76" r="48" fill="url(#teddyFur)"/><circle cx="238" cy="76" r="48" fill="url(#teddyFur)"/><circle cx="82" cy="76" r="23" fill="#f2c5b5"/><circle cx="238" cy="76" r="23" fill="#f2c5b5"/>
    <ellipse cx="160" cy="219" rx="103" ry="105" fill="url(#teddyFur)"/><ellipse cx="160" cy="126" rx="91" ry="86" fill="url(#teddyFur)"/>
    <ellipse cx="160" cy="148" rx="49" ry="39" fill="#f5d9c4"/><ellipse cx="160" cy="140" rx="16" ry="12" fill="#51302e"/><path d="M145 162q15 19 30 0" fill="none" stroke="#75433b" strokeWidth="6" strokeLinecap="round"/>
    <circle cx="127" cy="113" r="8" fill="#2d2222"/><circle cx="193" cy="113" r="8" fill="#2d2222"/><ellipse cx="160" cy="232" rx="48" ry="55" fill="#f5d9c4"/><path d="M160 213l9 12-9 10-9-10z" fill="#c43a55"/>
    <ellipse cx="70" cy="223" rx="37" ry="59" transform="rotate(26 70 223)" fill="url(#teddyFur)"/><ellipse cx="250" cy="223" rx="37" ry="59" transform="rotate(-26 250 223)" fill="url(#teddyFur)"/>
    <ellipse cx="112" cy="302" rx="54" ry="31" fill="url(#teddyFur)"/><ellipse cx="208" cy="302" rx="54" ry="31" fill="url(#teddyFur)"/>
  </svg>;
  if (gift.type === 'flowers') return <svg className="gift-art-flowers" viewBox="0 0 340 360" role="img" aria-label="A bright birthday bouquet">
    <ellipse cx="170" cy="320" rx="112" ry="20" fill="#86273b" opacity=".16"/>
    <path d="M88 166l72 150 92-150" fill="#f4bfc6" stroke="#be3354" strokeWidth="5"/><path d="M109 195l60 117 69-117" fill="#ffe2d8"/>
    <path d="M165 296Q111 205 92 112M172 296Q148 190 156 89M177 296Q196 184 217 105M180 298Q232 215 262 148" fill="none" stroke="#4b9971" strokeWidth="9" strokeLinecap="round"/>
    <path d="M135 226q-50-45-69-4 33 32 69 4M196 231q40-49 77-22-20 43-77 22M146 181q-44-48-68-19 25 38 68 19M205 186q47-38 69-6-31 37-69 6" fill="#6db584"/>
    {[[91,105,'#e94f72'],[155,82,'#f5bb3b'],[217,98,'#a66bd1'],[263,141,'#ee718b'],[123,158,'#f1a43d']].map(([x,y,c],i)=><g key={i} className="gift-flower-head" style={{transformOrigin:`${x}px ${y}px`}}><circle cx={x} cy={y-17} r="15" fill={c}/><circle cx={x+16} cy={y-5} r="15" fill={c}/><circle cx={x+10} cy={y+13} r="15" fill={c}/><circle cx={x-10} cy={y+13} r="15" fill={c}/><circle cx={x-16} cy={y-5} r="15" fill={c}/><circle cx={x} cy={y} r="11" fill="#ffd76b"/></g>)}
    <path d="M130 236q40 36 80 0l-14 38q-26 17-52 0z" fill="#d83254"/><path d="M162 254q-59 6-36 60l31-20M180 254q62 7 34 60l-31-20" fill="#ea5670"/>
  </svg>;
  return <div className="gift-art-actor" aria-label="Actor surprise"><span>🎭</span></div>;
}

function GiftSurprise({ gift, onClose }) {
  const fallbackGif = gift.type === 'flowers' ? '/assets/gifts/flowers.gif' : gift.type === 'teddy' ? '/assets/gifts/teddy.gif' : null;
  const mediaSources = [gift.gif, gift.animation, fallbackGif, gift.image].filter(Boolean);
  const [mediaIndex, setMediaIndex] = useState(0);
  const image = mediaSources[mediaIndex];
  const actor = gift.type === 'sampoornesh_babu';

  return <motion.div className="gift-surprise-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.section className={`gift-surprise gift-surprise-${gift.type}`} initial={{ opacity: 0, scale: .72, y: 35 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .85, y: 20 }} transition={{ type: 'spring', damping: 20, stiffness: 170 }} onClick={(event) => event.stopPropagation()}>
      <button className="gift-surprise-close" onClick={onClose} aria-label="Close surprise"><X size={22}/></button>
      <div className={`gift-surprise-visual ${actor ? 'gift-actor-walk' : ''}`}>
        {image ? <img src={image} alt={gift.title} onError={() => setMediaIndex((index) => index + 1)} /> : <GiftArtwork gift={gift} />}
      </div>
    </motion.section>
  </motion.div>;
}

/* ── single gift box ──────────────────────────────────── */

function GiftBox({ gift, index, onOpen, isOpened, playSound }) {
  const [sparkles, setSparkles] = useState([]);
  const floatDelay = (index * 0.6) % 3;
  const previewImage = gift.image || gift.gif || gift.animation;

  const handleClick = () => {
    if (isOpened) return;
    setSparkles(createSparkles());
    playSound?.('unwrap');
    onOpen(gift);
  };

  const lidColor = lighten(gift.color, 35);

  return (
    <motion.div
      className={`gift-box-container ${isOpened ? 'opened' : ''}`}
      role="button"
      tabIndex={isOpened ? -1 : 0}
      aria-label={`Open ${gift.title}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5, type: 'spring', stiffness: 70 }}
      onClick={handleClick}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleClick(); } }}
    >
      <div
        className={`gift-box ${!isOpened ? 'gift-float' : ''}`}
        style={{ animationDelay: `${floatDelay}s` }}
      >
        {/* Soft glow underneath */}
        <div className="gift-glow" style={{ background: gift.color }} />

        {/* Inner glow on open */}
        <div className="gift-inner-glow" style={{ background: gift.color }} />

        {/* Box body */}
        <div className="gift-box-body" style={{ background: gift.color }}>
          <div className="gift-ribbon-v" style={{ background: gift.ribbonColor }} />
          <div className="gift-ribbon-h" style={{ background: gift.ribbonColor }} />
        </div>

        {/* Lid */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div
              className="gift-box-lid"
              style={{ background: lidColor }}
              exit={{
                y: -92,
                rotateX: -40,
                opacity: 0,
                transition: { duration: 0.32, ease: 'easeOut' },
              }}
            >
              <div className="gift-lid-ribbon" style={{ background: gift.ribbonColor }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bow */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div
              className="gift-bow"
              exit={{ y: -102, opacity: 0, transition: { duration: 0.28, ease: 'easeOut' } }}
            >
              <div
                className="gift-bow-loop gift-bow-loop--left"
                style={{ borderColor: gift.ribbonColor }}
              />
              <div
                className="gift-bow-loop gift-bow-loop--right"
                style={{ borderColor: gift.ribbonColor }}
              />
              <div className="gift-bow-knot" style={{ background: gift.ribbonColor }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sparkles on open */}
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="gift-sparkle"
            style={{
              left: `calc(50% + ${s.x}px)`,
              top: `calc(50% + ${s.y}px)`,
              background: s.color,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Revealed content */}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            className="gift-content"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          >
            {previewImage && <img className="gift-reveal-image" src={previewImage} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
            <span className="gift-content-icon">{gift.icon}</span>
            <h4 className="gift-content-title">{gift.title}</h4>
            <p className="gift-content-message">{gift.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────── */

export default function GiftsScreen({ onNext, playSound }) {
  const { gifts } = birthdayConfig;
  const [openedIds, setOpenedIds] = useState(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const confettiRef = useRef([]);
  const [selectedGift, setSelectedGift] = useState(null);

  const handleOpen = useCallback(
    (gift) => {
      setOpenedIds((prev) => {
        const next = new Set(prev);
        next.add(gift.id);
        return next;
      });
      setSelectedGift(gift);
    },
    []
  );

  useEffect(() => {
    if (gifts.length > 0 && openedIds.size === gifts.length) {
      const confettiTimer = setTimeout(() => {
        confettiRef.current = createConfetti();
        setShowConfetti(true);
      }, 600);
      const btnTimer = setTimeout(() => setShowContinue(true), 2000);
      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(btnTimer);
      };
    }
    return undefined;
  }, [openedIds, gifts.length]);

  return (
    <div className="gifts-screen">
      <motion.h2
        className="gifts-title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Your Special Surprises
      </motion.h2>

      <motion.p
        className="gifts-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Tap each gift to open it!
      </motion.p>

      <div className="gifts-grid">
        {gifts.map((gift, i) => (
          <GiftBox
            key={gift.id}
            gift={gift}
            index={i}
            onOpen={handleOpen}
            isOpened={openedIds.has(gift.id)}
            playSound={playSound}
          />
        ))}
      </div>

      {/* Confetti burst */}
      {showConfetti &&
        confettiRef.current.map((c) => (
          <div
            key={c.id}
            className="gifts-confetti-piece"
            style={{
              left: `${c.x}%`,
              top: '-20px',
              width: c.size,
              height: c.shape === 'circle' ? c.size : c.size * 1.5,
              borderRadius: c.shape === 'circle' ? '50%' : '2px',
              background: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}

      <AnimatePresence>
        {showContinue && <motion.button className="gifts-continue-btn" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} onClick={onNext}>Continue to your last surprise</motion.button>}
        {selectedGift && <GiftSurprise key={selectedGift.id} gift={selectedGift} onClose={() => setSelectedGift(null)} />}
      </AnimatePresence>
    </div>
  );
}
