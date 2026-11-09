import { Volume2, VolumeX } from 'lucide-react';

export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button className="sfx-toggle" onClick={onToggle} aria-label={enabled ? 'Mute sound effects' : 'Enable sound effects'}>
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}<span>SFX</span>
    </button>
  );
}
