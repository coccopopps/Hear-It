// OWNER: chatbot/voice person.
import { useState } from "react";
import { useApp } from "../../shared/AppContext.jsx";
import { speak } from "../../shared/speak.js";
import { askAssistant } from "./assistant.js";
import { useVoice } from "./useVoice.js";

export default function ChatButton() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [log, setLog] = useState([]);

  async function send(message) {
    if (!message.trim()) return;
    setLog((l) => [...l, { who: "you", text: message }]);
    try {
      const { reply, command } = await askAssistant(message, state);
      if (command?.action) dispatch(command); // the contract in action
      setLog((l) => [...l, { who: "bot", text: reply }]);
      speak(reply);
    } catch {
      const msg = "The assistant could not be reached. Check your connection and try again.";
      setLog((l) => [...l, { who: "bot", text: msg }]);
      speak(msg);
    }
  }

  const voice = useVoice(send);

  return (
    <aside className="chat">
      <button className="chat-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Close assistant" : "Ask the assistant"}
      </button>
      {open && (
        <div className="chat-panel">
          <ul aria-live="polite">
            {log.map((m, i) => (
              <li key={i} className={m.who}>{m.text}</li>
            ))}
          </ul>
          <div className="chat-row">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { send(text); setText(""); } }}
              placeholder="Try: show wildfires"
              aria-label="Message"
            />
            {voice.supported && (
              <button onClick={voice.listening ? voice.stop : voice.start}>
                {voice.listening ? "Stop listening" : "Speak"}
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
