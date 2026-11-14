// OWNER: UI person. Arrow keys move between buttons; each button is spoken aloud.
import { useRef } from "react";
import { useApp } from "../../shared/AppContext.jsx";
import { ACTIONS, MAPS } from "../../shared/commands.js";
import { speak } from "../../shared/speak.js";

export default function NavButtons() {
  const { state, dispatch } = useApp();
  const refs = useRef([]);

  const items = [
    ...Object.entries(MAPS).map(([id, m]) => ({
      key: id,
      label: m.label,
      speech: `${m.label} map. ${m.description} Press enter to open.`,
      onActivate: () => dispatch({ action: ACTIONS.SELECT_MAP, value: id }),
      pressed: state.map === id,
    })),
    {
      key: "sound",
      label: state.sound ? "Sound on" : "Sound off",
      speech: "Toggle map sounds. Press enter to switch.",
      onActivate: () => dispatch({ action: ACTIONS.TOGGLE_SOUND, value: !state.sound }),
      pressed: state.sound,
    },
  ];

  function onKeyDown(e, i) {
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % items.length;
    if (e.key === "ArrowLeft") next = (i - 1 + items.length) % items.length;
    if (next !== null) {
      e.preventDefault();
      refs.current[next].focus();
    }
  }

  return (
    <nav aria-label="Maps" className="nav">
      {items.map((it, i) => (
        <button
          key={it.key}
          ref={(el) => (refs.current[i] = el)}
          aria-pressed={it.pressed}
          onFocus={() => speak(it.speech)}
          onKeyDown={(e) => onKeyDown(e, i)}
          onClick={it.onActivate}
        >
          {it.label}
        </button>
      ))}
    </nav>
  );
}
