import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera as CameraIcon } from 'lucide-react';
import birthdayConfig from '../config/birthdayConfig';
import './ExperienceScreens.css';

export default function CameraScreen({ onNext, playSound }) {
  const [shot, setShot] = useState(false);
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    if (!shot || !imageReady) return undefined;
    const transitionTimer = window.setTimeout(onNext, 3200);
    return () => window.clearTimeout(transitionTimer);
  }, [shot, imageReady, onNext]);

  const takeShot = () => {
    if (shot) return;

    setShot(true);
    if (birthdayConfig.camera.playShutterSound !== false) {
      playSound?.('shutter');
    }

    if (!birthdayConfig.camera.capturedImage) {
      setImageReady(true);
    }
  };

  return (
    <section className="screen chapter camera-chapter">
      <div className="grain" />
      <motion.p className="chapter-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        CHAPTER ONE · A MOMENT TO KEEP
      </motion.p>

      <motion.div
        className="camera-body"
        initial={{ opacity: 0, scale: 0.86, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18 }}
      >
        <div className="camera-top">
          <span className="camera-brand">LUMINA 2004</span>
          <span className="camera-flash-lamp" />
        </div>

        <div className="camera-lens" />
        <div className="camera-lens-inner" />

        <div className="lcd">
          <span className="lcd-date">TODAY · {birthdayConfig.recipient.name.toUpperCase()}</span>

          <AnimatePresence mode="wait">
            {!shot ? (
              <motion.div
                key="before"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="camera-preview"
              >
                <p>{birthdayConfig.camera.message1}</p>
                <strong>{birthdayConfig.camera.message2}</strong>
                <small>{birthdayConfig.camera.message3}</small>
              </motion.div>
            ) : (
              <motion.div
                key="after"
                className="captured"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {birthdayConfig.camera.capturedImage && !imageUnavailable ? (
                  <div className="captured-photo-wrap">
                    <img
                      className="captured-photo"
                      src={birthdayConfig.camera.capturedImage}
                      alt={`Birthday surprise for ${birthdayConfig.recipient.name}`}
                      onLoad={() => setImageReady(true)}
                      onError={() => {
                        setImageUnavailable(true);
                        setImageReady(true);
                      }}
                    />
                  </div>
                ) : (
                  <div className="captured-placeholder">
                    <CameraIcon size={27} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="shutter" onClick={takeShot} aria-label="Take birthday photo">
          <span />
        </button>

        <span className="camera-hint">{shot ? 'Developing a little magic...' : 'Press the shutter'}</span>
      </motion.div>

      <AnimatePresence>
        {shot && birthdayConfig.camera.showFlashEffect !== false && (
          <motion.div
            className="camera-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
