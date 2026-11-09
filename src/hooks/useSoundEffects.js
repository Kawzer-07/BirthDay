import { useState, useRef, useCallback, useEffect } from 'react';
import birthdayConfig from '../config/birthdayConfig';

/**
 * Custom hook for sound effects playback.
 * Pre-creates Audio objects for each sound defined in birthdayConfig.audio.sounds.
 */
export default function useSoundEffects() {
  const soundsRef = useRef({});
  const [sfxEnabled, setSfxEnabled] = useState(true);

  // Pre-create Audio objects for each sound
  useEffect(() => {
    const sounds = birthdayConfig.audio.sounds || {};
    const audioMap = {};

    Object.entries(sounds).forEach(([name, path]) => {
      try {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = birthdayConfig.audio.sfxVolume ?? 0.6;
        audio.addEventListener('error', () => {
          // Silently ignore missing sound files
        });
        audioMap[name] = audio;
      } catch {
        // Silently ignore creation errors
      }
    });

    soundsRef.current = audioMap;

    // Cleanup on unmount
    return () => {
      Object.values(soundsRef.current).forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      soundsRef.current = {};
    };
  }, []);

  // Play a named sound effect
  const playSound = useCallback(
    (soundName) => {
      if (!sfxEnabled) return;

      const audio = soundsRef.current[soundName];
      if (!audio) return;

      try {
        // Reset to start so rapid replays work
        audio.currentTime = 0;
        audio.volume = birthdayConfig.audio.sfxVolume ?? 0.6;
        audio.playbackRate = birthdayConfig.audio.soundPlaybackRates?.[soundName] ?? (soundName === 'unwrap' ? 2.25 : 1);
        if ('preservesPitch' in audio) audio.preservesPitch = false;
        audio.play().catch(() => {
          // Silently ignore playback errors (user hasn't interacted yet, etc.)
        });
      } catch {
        // Silently ignore
      }
    },
    [sfxEnabled]
  );

  // Toggle SFX on/off
  const toggleSfx = useCallback(() => {
    setSfxEnabled((prev) => !prev);
  }, []);

  return {
    playSound,
    sfxEnabled,
    toggleSfx,
  };
}
