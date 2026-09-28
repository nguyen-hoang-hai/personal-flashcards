import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakText } from '../utils/tts';

interface TTSButtonProps {
  text: string;
  language: 'en' | 'ja';
  className?: string;
  size?: number;
}

export const TTSButton: React.FC<TTSButtonProps> = ({
  text,
  language,
  className = '',
  size = 20,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    speakText(text, language);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      className={`p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800 ${
        isPlaying ? 'text-indigo-600 animate-pulse bg-indigo-50' : ''
      } ${className}`}
      title="Nghe phát âm"
      aria-label="Phát âm"
    >
      <Volume2 size={size} />
    </button>
  );
};
