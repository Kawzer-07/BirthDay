import { useCallback, useState } from 'react';

const TOTAL_SCREENS = 5;

export default function useExperience() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [progress, setProgress] = useState({ gifts: [] });
  const goToNext = useCallback(() => setCurrentScreen((screen) => Math.min(screen + 1, TOTAL_SCREENS - 1)), []);
  const reset = useCallback(() => { setCurrentScreen(0); setProgress({ gifts: [] }); }, []);
  return { currentScreen, goToNext, reset, progress, setProgress, totalScreens: TOTAL_SCREENS };
}
