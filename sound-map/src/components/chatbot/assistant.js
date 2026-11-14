// OWNER: chatbot/voice person. Turns a user message into { reply, command }.
import { ACTIONS } from "../../shared/commands.js";

const ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT;

/*
  If VITE_CHAT_ENDPOINT is set, your backend should call the LLM with a system prompt like:
  "You control a map app. Reply ONLY with JSON:
   { "reply": "...", "command": { "action": "SELECT_MAP"|"ZOOM_TO"|"TOGGLE_SOUND"|null, "value": ... } }
   Maps: climate, wildfire, co2."
  and return that JSON. NEVER put the API key in frontend code.
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

// Works with no API key, so everyone can test the whole app.
function keywordFallback(text) {
  const t = text.toLowerCase();
  if (t.includes("fire")) return { reply: "Showing wildfires.", command: { action: ACTIONS.SELECT_MAP, value: "wildfire" } };
  if (t.includes("co2") || t.includes("carbon")) return { reply: "Showing CO2 emissions.", command: { action: ACTIONS.SELECT_MAP, value: "co2" } };
  if (t.includes("climate")) return { reply: "Showing climate change.", command: { action: ACTIONS.SELECT_MAP, value: "climate" } };
  if (t.includes("mute") || t.includes("sound off")) return { reply: "Sound off.", command: { action: ACTIONS.TOGGLE_SOUND, value: false } };
  if (t.includes("sound on") || t.includes("unmute")) return { reply: "Sound on.", command: { action: ACTIONS.TOGGLE_SOUND, value: true } };
  for (const r of ["algeria", "europe", "africa", "world"]) {
    if (t.includes(r)) return { reply: `Zooming to ${r}.`, command: { action: ACTIONS.ZOOM_TO, value: { region: r } } };
  }
  return { reply: "Sorry, I can switch maps, zoom to a region, or turn sound on and off.", command: null };
}
