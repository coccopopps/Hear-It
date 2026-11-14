// THE CONTRACT. Agree on this file together; change it only with the whole team.

export const MAPS = {
  climate: { label: "Climate change", description: "Regions most affected by climate change." },
  wildfire: { label: "Wildfires", description: "Where wildfires are burning." },
  co2: { label: "CO2 emissions", description: "Carbon dioxide emissions by region." },
};

export const ACTIONS = {
  SELECT_MAP: "SELECT_MAP",     // value: "climate" | "wildfire" | "co2"
  ZOOM_TO: "ZOOM_TO",           // value: { region: "Algeria" }
  TOGGLE_SOUND: "TOGGLE_SOUND", // value: true | false
};

// Shape of any command: { action: ACTIONS.X, value: ... }
