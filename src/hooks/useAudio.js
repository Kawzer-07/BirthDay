import { useCallback, useEffect, useRef, useState } from 'react';
import birthdayConfig from '../config/birthdayConfig';

const FADE_DURATION = 1200;
const FADE_STEPS = 24;

export default function useAudio() {
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const volumeRef = useRef(birthdayConfig.audio.musicVolume ?? 0.4);
  const mutedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(volumeRef.current);
  const [source, setSource] = useState('idle');

  const clearFade = useCallback(() => {
    if (fadeIntervalRef.current) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const getFileAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(birthdayConfig.audio.backgroundMusic);
      audio.loop = birthdayConfig.audio.loop !== false;
      audio.preload = 'auto';
      audio.volume = mutedRef.current ? 0 : volumeRef.current;
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('error', () => setIsPlaying(false));
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const fadeInFile = useCallback((audio) => {
    clearFade();
    const target = mutedRef.current ? 0 : volumeRef.current;
    let step = 0;
    audio.volume = 0;
    fadeIntervalRef.current = window.setInterval(() => {
      step += 1;
      audio.volume = Math.min(target, (target / FADE_STEPS) * step);
      if (step >= FADE_STEPS) clearFade();
    }, FADE_DURATION / FADE_STEPS);
  }, [clearFade]);

  const startMusic = useCallback(async () => {
    if (source === 'file' && audioRef.current && !audioRef.current.paused) return;

    const audio = getFileAudio();
    audio.muted = mutedRef.current;
    try {
      await audio.play();
      fadeInFile(audio);
      setSource('file');
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [fadeInFile, getFileAudio, source]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current || getFileAudio();

    if (audio.paused) {
      try {
        audio.muted = mutedRef.current;
        await audio.play();
        fadeInFile(audio);
        setSource('file');
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    clearFade();
    audio.pause();
    setIsPlaying(false);
  }, [clearFade, fadeInFile, getFileAudio]);

  const toggleMute = useCallback(() => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      audioRef.current.volume = nextMuted ? 0 : volumeRef.current;
    }
  }, []);

  const setVolume = useCallback((nextVolume) => {
    const safeVolume = Math.max(0, Math.min(1, nextVolume));
    volumeRef.current = safeVolume;
    setVolumeState(safeVolume);
    if (audioRef.current && !mutedRef.current) {
      audioRef.current.volume = safeVolume;
    }
  }, []);

  useEffect(() => () => {
    clearFade();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  }, [clearFade]);

  return { startMusic, togglePlay, toggleMute, setVolume, volume, isPlaying, isMuted, source };
}
