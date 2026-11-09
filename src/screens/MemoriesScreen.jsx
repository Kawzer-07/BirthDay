import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import birthdayConfig from '../config/birthdayConfig';
import './MemoriesScreen.css';

/* ── decoration pattern per photo index ─────────────── */
const decorations = ['tape-top-left', 'pin', 'tape-center', 'tape-top-right', 'pin', 'tape-center'];

function getDecoration(index) {
  const type = decorations[index % decorations.length];
  if (type === 'pin') return <span className="polaroid-pin" />;
  if (type === 'tape-top-left') return <span className="polaroid-tape polaroid-tape--top-left" />;
  if (type === 'tape-top-right') return <span className="polaroid-tape polaroid-tape--top-right" />;
  return <span className="polaroid-tape polaroid-tape--center" />;
}

/* ── single Polaroid card ───────────────────────────── */
function PolaroidCard({ photo, index, onClick }) {
  const [imgError, setImgError] = useState(false);
  const rotation = photo.rotation || 0;
  const floatDelay = (index * 0.7) % 3;

  return (
    <motion.div
      className="polaroid-wrapper"
      initial={{ opacity: 0, y: 60, rotate: rotation * 2 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{
        duration: 0.6,
        delay: index * 0.18,
        type: 'spring',
        stiffness: 80,
        damping: 14,
      }}
      onClick={() => onClick(index)}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="polaroid polaroid-float"
        style={{
          transform: `rotate(${rotation}deg)`,
          animationDelay: `${floatDelay}s`,
        }}
      >
        {getDecoration(index)}

        <div className="polaroid-image-container">
          {!imgError ? (
            <img
              src={photo.src}
              alt={photo.caption}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="polaroid-placeholder">
              <Camera size={36} strokeWidth={1.5} />
              <span>Add your photo here</span>
            </div>
          )}
        </div>

        <p className="polaroid-caption">{photo.caption}</p>
      </div>
    </motion.div>
  );
}

/* ── Photo Modal ────────────────────────────────────── */
function PhotoModal({ photo, onClose }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      className="memories-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="memories-modal-content"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="memories-modal-close" onClick={onClose} aria-label="Close">
          <X size={28} />
        </button>

        <div className="memories-modal-polaroid">
          <div className="memories-modal-image-container">
            {!imgError ? (
              <img
                src={photo.src}
                alt={photo.caption}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="polaroid-placeholder">
                <Camera size={48} strokeWidth={1.5} />
                <span>Add your photo here</span>
              </div>
            )}
          </div>
          <p className="memories-modal-caption">{photo.caption}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────── */
export default function MemoriesScreen({ onNext }) {
  const { photos } = birthdayConfig;
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = useCallback((index) => setSelectedIndex(index), []);
  const closeModal = useCallback(() => setSelectedIndex(null), []);

  return (
    <div className="memories-screen">
      <motion.h2
        className="memories-title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Our Beautiful Memories
      </motion.h2>

      <div className="memories-gallery">
        {photos.map((photo, i) => (
          <PolaroidCard key={i} photo={photo} index={i} onClick={openModal} />
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <PhotoModal photo={photos[selectedIndex]} onClose={closeModal} />
        )}
      </AnimatePresence>

      <motion.button
        className="memories-continue-btn"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: photos.length * 0.18 + 0.5, duration: 0.5 }}
        onClick={onNext}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        Continue →
      </motion.button>
    </div>
  );
}
