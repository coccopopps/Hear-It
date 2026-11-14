// OWNER: whoever is free. Plays a different placeholder sound per map.
// Replace with real audio files in /public/sounds and data-driven sonification.
import { useEffect, useRef } from "react";
import { useApp } from "../../shared/AppContext.jsx";

function startSound(ctx, map) {
  const out = ctx.createGain();
  out.gain.value = 0.08;
  out.connect(ctx.destination);
  const nodes = [out];

  if (map === "wildfire") {
    // crackling noise
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() < 0.02 ? Math.random() * 2 - 1 : 0;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true; src.connect(out); src.start();
    nodes.push(src);
  } else {
    const osc = ctx.createOscillator();
    osc.type = map === "co2" ? "square" : "sine";
    osc.frequency.value = map === "co2" ? 110 : 65;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = map === "co2" ? 3 : 0.3; // pulse speed
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain).connect(out.gain);
    osc.connect(out); osc.start(); lfo.start();
    nodes.push(osc, lfo);
  }
  return () => nodes.forEach((n) => { try { n.stop?.(); n.disconnect(); } catch {} });
}

export default function Soundscape() {
  const { state } = useApp();
  const ctxRef = useRef(null);

  useEffect(() => {
    if (!state.sound) return;
    // Browsers block audio until the user interacts, so create it on first use.
    ctxRef.current ??= new (window.AudioContext || window.webkitAudioContext)();
    const ctx = ctxRef.current;
    ctx.resume();
    const stop = startSound(ctx, state.map);
    return stop;
  }, [state.map, state.sound]);

  return null;
}
