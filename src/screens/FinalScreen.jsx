import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import birthdayConfig from '../config/birthdayConfig';
import './ExperienceScreens.css';

export default function FinalScreen({ onReplay, playSound }) {
  const confetti = useMemo(() => Array.from({ length: 42 }, (_, i) => ({ id: i, left: `${(i * 37) % 100}%`, delay: (i % 10) * .16, color: ['#f4cf7c','#ed7792','#83c6c0','#a69add'][i % 4] })), []);
  return <section className="screen chapter finale-chapter">{confetti.map(c => <i key={c.id} className="final-confetti" style={{ left: c.left, animationDelay: `${c.delay}s`, background: c.color }} />)}<motion.div className="final-content" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} onAnimationComplete={() => playSound?.('celebrate')}><p className="chapter-kicker">A WHOLE NEW YEAR OF YOU</p><span className="final-star">✦</span><h1>{birthdayConfig.finale.title}</h1><p>{birthdayConfig.finale.message}</p><button className="replay-button" onClick={onReplay}><RotateCcw size={16}/>{birthdayConfig.finale.replayText}</button></motion.div></section>;
}
