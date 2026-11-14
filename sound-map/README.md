# Sound Map

Accessible, audio-driven maps (climate change, wildfires, CO2) with keyboard navigation,
spoken buttons, and a voice assistant. Built for NASA Space Apps.

## Run it
```bash
npm install
cp .env.example .env
npm run dev
```
Open the URL Vite prints (use Chrome or Edge for voice input).

## Who owns what
| Folder | Owner | Job |
|---|---|---|
| `src/components/maps/` | Map person | Map rendering, datasets |
| `src/components/ui/` | UI person | Buttons, arrow-key navigation, layout, styling |
| `src/components/chatbot/` | Chatbot/voice person | Mic, assistant, speech output |
| `src/components/audio/` | Whoever is free | Sounds and beats per map |
| `src/shared/` | **Everyone (discuss first)** | Commands and shared state |

## How the parts talk
Nobody calls anyone else's code. Everything goes through shared state:

```js
const { state, dispatch } = useApp();
dispatch({ action: ACTIONS.SELECT_MAP, value: "wildfire" });
```
Allowed commands live in `src/shared/commands.js`. To add a feature, add an action there
and a `case` in `src/shared/AppContext.jsx`, then tell the team.

## Git workflow
1. `git checkout -b your-feature` (never code on `main`).
2. Commit small and often, `git push origin your-feature`.
3. Open a Pull Request into `main`; one teammate glances at it, then merge.
4. `git pull origin main` regularly to stay in sync.
5. Keep `App.jsx` and `src/shared/` edits tiny and announce them in the group chat.

## Secrets
Never commit `.env`. Real LLM calls should go through a small backend (set `VITE_CHAT_ENDPOINT`);
without it the assistant uses a keyword fallback so everyone can still test.
