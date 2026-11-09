import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Send, Heart } from 'lucide-react';
import birthdayConfig from '../config/birthdayConfig';
import './ExperienceScreens.css';

export default function DeliveryScreen({ playSound }) {
  const interaction = birthdayConfig.giftInteraction;
  const [noAttempts, setNoAttempts] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [address, setAddress] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const maxAttempts = interaction.noButtonBehavior.maxAttempts;
  const noIsVisible = noAttempts < maxAttempts;
  const yesScale = 1 + noAttempts * interaction.noButtonBehavior.yesButtonScaleIncrement;
  const noScale = Math.max(.38, 1 - noAttempts * interaction.noButtonBehavior.noButtonScaleDecrement);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!address.trim() || sending) return;
    playSound?.('click');
    setSending(true);
    setError('');
    try {
      const response = await fetch(interaction.deliveryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim() }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'The address could not be sent. Please try again.');
      setSubmitted(true);
    } catch (sendError) {
      setError(sendError.message || 'Could not reach the birthday host. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return <section className="screen chapter delivery-chapter">
    <motion.div className="delivery-card" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .55, ease: [0.16, 1, 0.3, 1] }}>
      <div className="delivery-icon"><MapPin size={25} strokeWidth={1.6}/></div>
      <p className="chapter-kicker">ONE LAST LITTLE THING</p>
      <h1>Can you share your address so I can send the gifts?</h1>

      <AnimatePresence mode="wait">
        {submitted ? <motion.div className="delivery-success" key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Heart size={30} fill="currentColor"/><p>{interaction.addressInput.successMessage}</p><small>Your address was sent to the birthday host’s terminal.</small>
        </motion.div> : !accepted ? <motion.div className="delivery-choice" key="choice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
          <p className="delivery-prompt">{interaction.question}</p>
          <div className="delivery-buttons">
            <motion.button type="button" className="delivery-yes" style={{ transformOrigin: 'center' }} animate={{ scale: yesScale }} transition={{ type: 'tween', duration: .18, ease: 'easeOut' }} whileTap={{ scale: yesScale - .04 }} onClick={() => { playSound?.('click'); setAccepted(true); }}>
              {interaction.yesButton}
            </motion.button>
            <AnimatePresence>
              {noIsVisible && <motion.button type="button" className="delivery-no" style={{ transformOrigin: 'center' }} animate={{ scale: noScale, opacity: 1 }} transition={{ type: 'tween', duration: .18, ease: 'easeOut' }} exit={{ opacity: 0, scale: .2, transition: { duration: .2 } }} onClick={() => { playSound?.('click'); setNoAttempts((count) => Math.min(count + 1, maxAttempts)); }}>
                {interaction.noButton}
              </motion.button>}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            {noAttempts >= maxAttempts ? <motion.p key="final-no" className="delivery-choice-note" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{interaction.onlyOptionMessage}</motion.p> : noAttempts > 0 ? <motion.p key="retry" className="delivery-choice-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{interaction.noButtonBehavior.message}</motion.p> : null}
          </AnimatePresence>
        </motion.div> : <motion.form className="delivery-form" key="address" onSubmit={handleSubmit} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <label htmlFor="delivery-address">Where should the gifts go?</label>
          <textarea id="delivery-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder={interaction.addressInput.placeholder} required minLength={5} maxLength={1500} rows={4} autoFocus />
          <p className="delivery-privacy">{interaction.privacyNote}</p>
          {error && <p className="delivery-error" role="alert">{error}</p>}
          <button className="delivery-submit" type="submit" disabled={sending || !address.trim()}>{sending ? 'Sending…' : <>{interaction.addressInput.submitButton}<Send size={16}/></>}</button>
        </motion.form>}
      </AnimatePresence>
    </motion.div>
  </section>;
}
