// Generative soundscape – one ambient texture per map layer.
import { useEffect, useRef } from "react";
import { useApp } from "../../shared/AppContext.jsx";

function buildSound(ctx, map) {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Fade in
  master.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 1.5);

  const nodes = [master];

  if (map === "wildfire") {
    // Crackling fire: white noise + low rumble
    const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() < 0.025 ? (Math.random() * 2 - 1) : 0;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass"; filter.frequency.value = 2000; filter.Q.value = 0.5;
    src.connect(filter); filter.connect(master); src.start();
    nodes.push(src, filter);

    const rumble = ctx.createOscillator();
    rumble.type = "sawtooth"; rumble.frequency.value = 55;
    const rumbleGain = ctx.createGain(); rumbleGain.gain.value = 0.3;
    rumble.connect(rumbleGain); rumbleGain.connect(master); rumble.start();
    nodes.push(rumble, rumbleGain);

  } else if (map === "co2") {
    // Industrial pulse: square wave + slow LFO tremolo
    const osc = ctx.createOscillator();
    osc.type = "square"; osc.frequency.value = 80;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 2.5;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.06;
    lfo.connect(lfoGain); lfoGain.connect(master.gain);
    osc.connect(master); osc.start(); lfo.start();
    nodes.push(osc, lfo, lfoGain);

  } else if (map === "aerosol") {
    // Eerie wind: filtered noise, slow fade
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass"; filter.frequency.value = 600;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 150;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
    src.connect(filter); filter.connect(master); src.start(); lfo.start();
    nodes.push(src, filter, lfo, lfoGain);

  } else {
    // Climate / temperature: deep drone with slow beat
    const osc = ctx.createOscillator();
    osc.type = "sine"; osc.frequency.value = 55;
    const osc2 = ctx.createOscillator();
    osc2.type = "sine"; osc2.frequency.value = 57.5; // slight detuning = beats
    const g1 = ctx.createGain(); g1.gain.value = 0.5;
    const g2 = ctx.createGain(); g2.gain.value = 0.5;
    osc.connect(g1); g1.connect(master);
    osc2.connect(g2); g2.connect(master);
    osc.start(); osc2.start();
    nodes.push(osc, osc2, g1, g2);
  }

  return () => {
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    setTimeout(() => nodes.forEach(n => { try { n.stop?.(); n.disconnect(); } catch {} }), 700);
  };
}

export default function Soundscape() {
  const { state } = useApp();
  const ctxRef = useRef(null);

  useEffect(() => {
    if (!state.sound) return;
    ctxRef.current ??= new (window.AudioContext || window.webkitAudioContext)();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    return buildSound(ctx, state.map);
  }, [state.map, state.sound]);

  return null;
}
