import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import birthdayConfig from '../config/birthdayConfig';
import './ExperienceScreens.css';

export default function LetterScreen({ onNext, playSound }) {
  const [open, setOpen] = useState(false);
  const openLetter = () => { if (!open) { setOpen(true); playSound?.('envelope'); } };
  return <section className="screen chapter letter-chapter">
    <p className="chapter-kicker">CHAPTER FIVE · A NOTE FOR YOU</p>
    <AnimatePresence mode="wait">{!open ? <motion.button className="letter-envelope" key="env" onClick={openLetter} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.12 }}><span className="envelope-flap-letter"/><span className="wax">♥</span><small>Tap to open</small></motion.button> : <motion.article className="letter-paper" key="letter" initial={{ opacity: 0, rotateX: -25, y: 35 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ duration: .65 }}><p className="letter-greeting">{birthdayConfig.letter.greeting}</p>{birthdayConfig.letter.paragraphs.map((p, i) => <motion.p key={p} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 + i * .45 }}>{p}</motion.p>)}<motion.p className="letter-closing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>{birthdayConfig.letter.closing}<span>{birthdayConfig.letter.signature}</span></motion.p><button className="primary-button letter-next" onClick={onNext}>One last thing <span>→</span></button></motion.article>}</AnimatePresence>
  </section>;
}
