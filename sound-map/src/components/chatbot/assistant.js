import { ACTIONS, MAPS, REGIONS } from "../../shared/commands.js";

const ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT;

/*
  Backend system prompt (store API key server-side):
  "You control an environmental map app. Reply ONLY with valid JSON:
   { \"reply\": \"<spoken reply>\", \"command\": { \"action\": \"SELECT_MAP\"|\"SELECT_BASEMAP\"|\"ZOOM_TO\"|\"TOGGLE_SOUND\"|null, \"value\": ... } }
   Maps: climate, wildfire, co2, aerosol.
   Basemaps: dark, satellite, nasa_blue.
   Regions: world, africa, europe, northamerica, southamerica, asia, australia, algeria, california, amazon, arctic, mediterranean."
*/
export async function askAssistant(message, state) {
  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, state }),
    });
    return res.json();
  }
  return keywordFallback(message);
}

function keywordFallback(text) {
  const t = text.toLowerCase();

  // ── Layer selection ───────────────────────────────────────────────────
  if (t.includes("fire") || t.includes("burn"))
    return { reply: "Switching to active fires layer from NASA FIRMS.", command: { action: ACTIONS.SELECT_MAP, value: "wildfire" } };
  if (t.includes("co2") || t.includes("carbon") || t.includes("emission"))
    return { reply: "Switching to CO₂ emissions layer from NASA OCO-2.", command: { action: ACTIONS.SELECT_MAP, value: "co2" } };
  if (t.includes("temperature") || t.includes("climate") || t.includes("heat"))
    return { reply: "Switching to land surface temperature anomaly layer.", command: { action: ACTIONS.SELECT_MAP, value: "climate" } };
  if (t.includes("aerosol") || t.includes("smoke") || t.includes("dust") || t.includes("haze"))
    return { reply: "Switching to aerosol optical depth layer.", command: { action: ACTIONS.SELECT_MAP, value: "aerosol" } };

  // ── Basemap ───────────────────────────────────────────────────────────
  if (t.includes("satellite"))
    return { reply: "Switching to satellite imagery basemap.", command: { action: ACTIONS.SELECT_BASEMAP, value: "satellite" } };
  if (t.includes("blue marble") || t.includes("nasa map") || t.includes("earth view"))
    return { reply: "Switching to NASA Blue Marble basemap.", command: { action: ACTIONS.SELECT_BASEMAP, value: "nasa_blue" } };
  if (t.includes("dark map") || t.includes("dark mode map"))
    return { reply: "Switching to dark basemap.", command: { action: ACTIONS.SELECT_BASEMAP, value: "dark" } };

  // ── Zoom / regions ────────────────────────────────────────────────────
  const regionMap = {
    "north america": "northamerica", "south america": "southamerica",
    "northamerica": "northamerica",  "southamerica": "southamerica",
  };
  for (const [phrase, key] of Object.entries(regionMap)) {
    if (t.includes(phrase))
      return { reply: `Zooming to ${phrase}.`, command: { action: ACTIONS.ZOOM_TO, value: { region: key } } };
  }
  for (const r of Object.keys(REGIONS)) {
    if (t.includes(r))
      return { reply: `Zooming to ${r}.`, command: { action: ACTIONS.ZOOM_TO, value: { region: r } } };
  }

  // ── Sound ─────────────────────────────────────────────────────────────
  if (t.includes("mute") || t.includes("sound off") || t.includes("quiet"))
    return { reply: "Sound muted.", command: { action: ACTIONS.TOGGLE_SOUND, value: false } };
  if (t.includes("sound on") || t.includes("unmute") || t.includes("audio on"))
    return { reply: "Sound on.", command: { action: ACTIONS.TOGGLE_SOUND, value: true } };

  // ── Help ──────────────────────────────────────────────────────────────
  if (t.includes("help") || t.includes("what can you"))
    return {
      reply: "I can switch layers — fires, CO₂, temperature, aerosol — change basemap to satellite or Blue Marble, zoom to any region like Africa, Europe, California, Amazon, or toggle sound.",
      command: null,
    };

  return {
    reply: "Try: 'show wildfires', 'zoom to California', 'satellite map', or 'mute'.",
    command: null,
  };
}
