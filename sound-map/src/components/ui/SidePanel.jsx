// SidePanel – unified floating panel with layers, basemap, voice, chat
import { useState, useRef, useEffect } from "react";
import { useApp } from "../../shared/AppContext.jsx";
import { ACTIONS, MAPS, BASEMAPS } from "../../shared/commands.js";
import { speak } from "../../shared/speak.js";
import { askAssistant } from "../chatbot/assistant.js";
import { useVoice } from "../chatbot/useVoice.js";

export default function SidePanel({ open, onClose }) {
  const { state, dispatch } = useApp();
  const [log, setLog] = useState([
    { who: "bot", text: "Hello! I can switch map layers, zoom to regions, or change the basemap. Try asking me something." },
  ]);
  const [text, setText] = useState("");
  const logEndRef = useRef(null);

  async function send(message) {
    if (!message.trim()) return;
    setLog(l => [...l, { who: "you", text: message }]);
    try {
      const { reply, command } = await askAssistant(message, state);
      if (command?.action) dispatch(command);
      setLog(l => [...l, { who: "bot", text: reply }]);
      speak(reply);
    } catch {
      const msg = "Could not reach the assistant. Check your connection.";
      setLog(l => [...l, { who: "bot", text: msg }]);
      speak(msg);
    }
  }

  const voice = useVoice(send);

  // Auto-scroll chat
  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [log]);

  return (
    <aside className={`side-panel${open ? " open" : ""}`} aria-label="Controls">

      {/* ── Brand ─────────────────────────────────────────────── */}
      <div className="brand">
        <span className="brand-icon">🌍</span>
        <div>
          <h1>Hear It</h1>
          <small>NASA Environmental Sound Map</small>
        </div>
      </div>

      {/* ── Map layers ────────────────────────────────────────── */}
      <section>
        <p className="panel-section-title">Data Layers</p>
        <div className="layer-grid">
          {Object.entries(MAPS).map(([id, m]) => (
            <button
              key={id}
              className="layer-btn"
              aria-pressed={state.map === id}
              onClick={() => {
                dispatch({ action: ACTIONS.SELECT_MAP, value: id });
                speak(`${m.label}. ${m.description}`);
              }}
            >
              <span className="layer-icon">{m.icon}</span>
              <span className="layer-text">
                <strong>{m.label}</strong>
                <small>{m.description}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Basemap ───────────────────────────────────────────── */}
      <section>
        <p className="panel-section-title">Basemap</p>
        <div className="basemap-row">
          {Object.entries(BASEMAPS).map(([id, b]) => (
            <button
              key={id}
              className="basemap-btn"
              aria-pressed={state.basemap === id}
              onClick={() => dispatch({ action: ACTIONS.SELECT_BASEMAP, value: id })}
            >
              {id === "dark" ? "🌑 " : id === "satellite" ? "🛰️ " : "🌐 "}{b.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Sound ─────────────────────────────────────────────── */}
      <section>
        <p className="panel-section-title">Soundscape</p>
        <div className="sound-row">
          <span>🔊 Ambient sound</span>
          <label className="toggle-switch" title="Toggle sound">
            <input
              type="checkbox"
              checked={state.sound}
              onChange={() => dispatch({ action: ACTIONS.TOGGLE_SOUND, value: !state.sound })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </section>

      {/* ── Voice + Chat ──────────────────────────────────────── */}
      <section className="voice-section" style={{ flex: 1 }}>
        <p className="panel-section-title">Voice Assistant</p>

        {/* Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="status-pill">
            <span className={`status-dot${voice.listening ? "" : " inactive"}`} />
            {voice.listening ? "Listening…" : "Ready"}
          </span>
          {voice.transcript && (
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontStyle: "italic" }}>
              "{voice.transcript}"
            </span>
          )}
        </div>

        {/* Mic button */}
        {voice.supported ? (
          <button
            className={`mic-btn${voice.listening ? " listening" : ""}`}
            onClick={voice.listening ? voice.stop : voice.start}
            aria-label={voice.listening ? "Stop listening" : "Start voice command"}
          >
            <span style={{ fontSize: "1.3rem" }}>{voice.listening ? "⏹️" : "🎤"}</span>
            {voice.listening ? "Stop listening" : "Tap to speak"}
          </button>
        ) : (
          <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            Voice not supported in this browser. Use Chrome or Edge.
          </p>
        )}

        {/* Chat log */}
        <ul className="chat-log" aria-live="polite">
          {log.map((m, i) => (
            <li key={i} className={`chat-msg ${m.who}`}>{m.text}</li>
          ))}
          <li ref={logEndRef} />
        </ul>

        {/* Text input */}
        <div className="chat-row">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && text.trim()) { send(text); setText(""); } }}
            placeholder="e.g. show fires in California…"
            aria-label="Message to assistant"
          />
          <button
            className="send-btn"
            onClick={() => { if (text.trim()) { send(text); setText(""); } }}
            aria-label="Send"
          >
            ↩
          </button>
        </div>

        {/* Quick commands */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {[
            "Show wildfires",
            "Zoom to Arctic",
            "Satellite map",
            "CO₂ emissions",
            "Zoom to Amazon",
            "Mute",
          ].map(q => (
            <button
              key={q}
              onClick={() => send(q)}
              style={{
                fontSize: "0.68rem", padding: "0.3rem 0.6rem",
                borderRadius: "20px",
                border: "1px solid var(--panel-border)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--muted)", cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { e.target.style.color = "var(--accent)"; e.target.style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { e.target.style.color = "var(--muted)"; e.target.style.borderColor = "var(--panel-border)"; }}
            >
              {q}
            </button>
          ))}
        </div>
      </section>

    </aside>
  );
}
