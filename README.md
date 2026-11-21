# Hear-It

**Hear-It** is an accessible, audio-driven environmental data experience created for NASA Space Apps. It turns climate and Earth-science information into interactive maps, spoken descriptions, keyboard navigation, soundscapes, and voice-assisted exploration.

## About the Project

Environmental datasets can be difficult to interpret through text or visuals alone. Hear-It explores more accessible ways to understand information about:

- Wildfires
- Carbon dioxide and climate change
- Environmental and geographic patterns

The project combines maps, audio cues, speech synthesis, and voice interaction so users can navigate and understand environmental data through multiple senses.

## Features

- Interactive Leaflet-based maps
- Audio cues and map-specific soundscapes
- Spoken buttons and descriptions
- Keyboard and arrow-key navigation
- Browser voice recognition
- Voice assistant interface
- Shared application state for predictable component communication
- Offline keyword fallback for testing without an LLM endpoint
- Optional backend integration through `VITE_CHAT_ENDPOINT`

## NASA Space Apps Challenge

This project was developed for a NASA Space Apps Challenge. It uses NASA-inspired Earth-science concepts and focuses on making environmental data more accessible, understandable, and engaging.

## Technology Stack

- React 18
- Vite 5
- JavaScript
- HTML and CSS
- Leaflet
- React Leaflet
- Web Speech API
- Optional external LLM endpoint

## Project Structure

```text
sound-map/
├── public/
│   └── sounds/          # Audio assets
├── src/
│   ├── components/
│   │   ├── audio/       # Sound playback and audio cues
│   │   ├── chatbot/     # Voice and assistant interface
│   │   ├── maps/        # Map rendering and datasets
│   │   └── ui/          # Navigation and interface components
│   ├── shared/
│   │   ├── AppContext.jsx
│   │   ├── commands.js
│   │   └── speak.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
