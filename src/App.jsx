import { useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useExperience from './hooks/useExperience';
import MusicPlayer from './components/MusicPlayer';
import SoundToggle from './components/SoundToggle';
import useSoundEffects from './hooks/useSoundEffects';
import WelcomeScreen from './screens/WelcomeScreen';
import CameraScreen from './screens/CameraScreen';
import CakeScreen from './screens/CakeScreen';
import GiftsScreen from './screens/GiftsScreen';
import DeliveryScreen from './screens/DeliveryScreen';
import birthdayConfig from './config/birthdayConfig';

/**
 * Screen transition variants for framer-motion.
 * Fade + slight vertical slide for a cinematic feel.
 */
const screenVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: [0.65, 0, 0.35, 1],
    },
  },
};

export default function App() {
  const { currentScreen, goToNext } = useExperience();
  const { playSound, sfxEnabled, toggleSfx } = useSoundEffects();
  const musicPlayerRef = useRef(null);

  // Called by WelcomeScreen when the password is correct
  const handleMusicStart = useCallback(() => {
    musicPlayerRef.current?.startMusic();
  }, []);

  /**
   * Renders the active screen based on currentScreen index.
   */
  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return (
          <WelcomeScreen
            key="welcome"
            onUnlock={goToNext}
            onMusicStart={handleMusicStart}
          />
        );
      case 1:
        return (
          <CameraScreen
            key="camera"
            onNext={goToNext} playSound={playSound}
          />
        );
      case 2:
        return (
          <CakeScreen
            key="cake"
            onNext={goToNext} playSound={playSound}
          />
        );
      case 3:
        return (
          <GiftsScreen
            key="gifts"
            onNext={goToNext}
            playSound={playSound}
          />
        );
      case 4:
        if (!birthdayConfig.sections?.delivery) return null;
        return (
          <DeliveryScreen key="delivery" playSound={playSound} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Persistent music player across all screens */}
      <MusicPlayer ref={musicPlayerRef} />
      {currentScreen > 0 && <SoundToggle enabled={sfxEnabled} onToggle={toggleSfx} />}

      {/* Screen content with animated transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            width: '100%',
            minHeight: '100dvh',
          }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
