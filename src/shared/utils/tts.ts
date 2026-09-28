export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Preload and cache voices
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  if ('onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  }
}

export function speakText(
  text: string,
  language: 'en' | 'ja',
  options: { rate?: number; pitch?: number; volume?: number } = {}
): boolean {
  if (!isTTSSupported() || !text.trim()) {
    return false;
  }

  try {
    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
    utterance.rate = options.rate ?? (language === 'ja' ? 0.9 : 0.95);
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    // Retrieve freshest voices
    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices();
    }

    const langPrefix = language === 'ja' ? 'ja' : 'en';
    // Prioritize natural or local voices
    const preferredVoice = cachedVoices.find(
      (v) => v.lang.toLowerCase().startsWith(langPrefix) && (v.name.includes('Google') || v.name.includes('Natural') || v.localService)
    ) || cachedVoices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('TTS error:', err);
    return false;
  }
}
