// Speech-to-text via Web Speech API (Chrome/Edge).
import { useRef, useState } from "react";

export function useVoice(onResult) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef(null);
  const supported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  function start() {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (e) => {
      const interim = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscript(interim);
      if (e.results[e.results.length - 1].isFinal) {
        onResult(interim);
        setTranscript("");
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => { setListening(false); setTranscript(""); };
    rec.start();
    recRef.current = rec;
    setListening(true);
  }

  function stop() {
    recRef.current?.stop();
    setListening(false);
  }

  return { listening, supported, transcript, start, stop };
}
