import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import birthdayConfig from '../config/birthdayConfig';
import './ExperienceScreens.css';

export default function CakeScreen({ onNext, playSound }) {
  const [blown, setBlown] = useState(false);

  const blow = () => {
    if (blown) return;

    setBlown(true);

    window.setTimeout(() => {
      playSound?.('blow');
    }, 150);

    window.setTimeout(() => {
      playSound?.('clap');
    }, 500);
  };

  return (
    <section className="screen chapter cake-chapter">
      <div className="cake-ambient" />
      <p className="chapter-kicker">CHAPTER TWO · ONE LITTLE WISH</p>
      <h1 className="wish-title">{birthdayConfig.cake.wishPrompt}</h1>

      <motion.div
        className="cake-scene"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <button type="button" className={'candle ' + (blown ? 'is-out' : '')} onClick={blow} aria-label="Blow out the candle">
          <span className="flame" />
          <span className="wick" />
        </button>

        <AnimatePresence>
          {blown && (
            <motion.span
              className="smoke"
              initial={{ opacity: 0.8, y: 0, x: 0 }}
              animate={{ opacity: 0, y: -72, x: 18 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            >
              〰
            </motion.span>
          )}
        </AnimatePresence>

        <div className="cake-top"><i /><i /><i /><i /><i /></div>
        <div className="cake-layer cake-layer-one" />
        <div className="cake-cream" />
        <div className="cake-layer cake-layer-two" />
        <div className="cake-plate" />
      </motion.div>

      <AnimatePresence>
        {blown && (
          <motion.div
            className="wish-reveal"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          >
            <p>{birthdayConfig.cake.afterWish}</p>
            <button type="button" className="primary-button" onClick={() => window.setTimeout(onNext, 500)}>
              {birthdayConfig.cake.continueText}
              <span>→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!blown && <p className="soft-instruction">Tap the candle to make a wish</p>}
    </section>
  );
}
