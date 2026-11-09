import { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import useAudio from '../hooks/useAudio';

/**
 * Persistent floating music control UI.
 * Exposes `startMusic` via ref so parent components can trigger playback.
 */
const MusicPlayer = forwardRef(function MusicPlayer(_, ref) {
  const { startMusic, togglePlay, toggleMute, setVolume, volume, isPlaying, isMuted, source } = useAudio();
  const [expanded, setExpanded] = useState(false);

  // Expose startMusic to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      startMusic,
    }),
    [startMusic]
  );

  return (
    <motion.div
      className="music-player"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5, ease: 'easeOut' }}
      style={styles.container}
    >
      {/* Expanded controls */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, width: 0, marginRight: 0 }}
            animate={{ opacity: 1, width: 'auto', marginRight: 8 }}
            exit={{ opacity: 0, width: 0, marginRight: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={styles.expandedControls}
          >
            <button
              onClick={toggleMute}
              style={styles.secondaryButton}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input className="music-volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Music volume" />
            {source === 'ambient' && <span className="music-source" aria-label="Using built-in ambient soundtrack">Ambient</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main play/pause button */}
      <button
        onClick={() => {
          if (!expanded) {
            setExpanded(true);
          }
          togglePlay();
        }}
        style={styles.mainButton}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <>
            <Pause size={18} style={{ position: 'relative', zIndex: 1 }} />
            {/* Animated equalizer bars */}
            <div style={styles.equalizerContainer}>
              <span style={{ ...styles.eqBar, animationDelay: '0s' }} />
              <span style={{ ...styles.eqBar, animationDelay: '0.15s' }} />
              <span style={{ ...styles.eqBar, animationDelay: '0.3s' }} />
              <span style={{ ...styles.eqBar, animationDelay: '0.1s' }} />
            </div>
          </>
        ) : (
          <Play size={18} style={{ marginLeft: 2 }} />
        )}
      </button>
    </motion.div>
  );
});

const styles = {
  container: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 50,
    background: 'rgba(20, 20, 30, 0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(212, 168, 83, 0.2)',
    padding: '4px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 12px rgba(212, 168, 83, 0.1)',
  },
  expandedControls: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  mainButton: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, rgba(212, 168, 83, 0.3), rgba(212, 168, 83, 0.15))',
    color: '#f0d68a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.3s ease, transform 0.2s ease',
  },
  secondaryButton: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(212, 168, 83, 0.1)',
    color: '#f0d68a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s ease',
    marginLeft: 4,
  },
  equalizerContainer: {
    position: 'absolute',
    bottom: 6,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'flex-end',
    gap: 2,
    height: 10,
    pointerEvents: 'none',
  },
  eqBar: {
    display: 'inline-block',
    width: 3,
    borderRadius: 1,
    background: '#d4a853',
    animation: 'eq-bounce 0.8s ease-in-out infinite alternate',
  },
};

export default MusicPlayer;
