// OWNER: chatbot/voice person. Speech-to-text via the browser SpeechRecognition API (Chrome/Edge).
import { useRef, useState } from "react";

export function useVoice(onResult) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const supported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  function start() {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US"; // change to "fr-FR" or "ar-DZ" if needed
    rec.interimResults = false;
    rec.onresult = (e) => onResult(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  }
  function stop() {
    recRef.current?.stop();
  }
  return { listening, supported, start, stop };
}
