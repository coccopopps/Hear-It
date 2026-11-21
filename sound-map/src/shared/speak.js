// Text-to-speech helper.
let currentUtterance = null;

export function speak(text, { rate = 1, pitch = 1 } = {}) {
  if (!("speechSynthesis" in window) || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  u.pitch = pitch;
  // Prefer a natural English voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith("en") && v.localService) || voices[0];
  if (preferred) u.voice = preferred;
  currentUtterance = u;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  window.speechSynthesis.cancel();
}
