// THE CONTRACT. Shared by all components.

export const MAPS = {
  climate: {
    label: "Temperature Anomaly",
    icon: "🌡️",
    description: "NASA GIBS – Land surface temperature deviation from baseline.",
    nasaLayer: "MODIS_Terra_Land_Surface_Temp_Day",
    color: "#ef5350",
  },
  wildfire: {
    label: "Active Fires",
    icon: "🔥",
    description: "NASA FIRMS – Active fire detections from MODIS/VIIRS.",
    nasaLayer: "MODIS_Terra_Thermal_Anomalies_All",
    color: "#ff9800",
  },
  co2: {
    label: "CO₂ Emissions",
    icon: "💨",
    description: "NASA OCO-2 – Atmospheric carbon dioxide column.",
    nasaLayer: "AIRS_CO2_Daily",
    color: "#7c4dff",
  },
  aerosol: {
    label: "Aerosol Index",
    icon: "🌫️",
    description: "NASA MERRA-2 – Aerosol optical depth.",
    nasaLayer: "MERRA2_Total_Aerosol_Optical_Thickness_550nm_Scattering_Monthly",
    color: "#26c6da",
  },
};

export const BASEMAPS = {
  dark: { label: "Dark", url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" },
  satellite: { label: "Satellite", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" },
  nasa_blue: { label: "Blue Marble", url: "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg" },
};

export const REGIONS = {
  world:         { center: [20, 0],      zoom: 2 },
  africa:        { center: [5, 20],      zoom: 3 },
  europe:        { center: [50, 10],     zoom: 4 },
  northamerica:  { center: [45, -100],   zoom: 3 },
  southamerica:  { center: [-15, -60],   zoom: 3 },
  asia:          { center: [35, 100],    zoom: 3 },
  australia:     { center: [-25, 134],   zoom: 4 },
  algeria:       { center: [28, 2],      zoom: 5 },
  california:    { center: [37, -120],   zoom: 6 },
  amazon:        { center: [-5, -60],    zoom: 5 },
  arctic:        { center: [75, 0],      zoom: 3 },
  mediterranean: { center: [37, 15],     zoom: 4 },
};

export const ACTIONS = {
  SELECT_MAP:    "SELECT_MAP",    // value: map key
  SELECT_BASEMAP:"SELECT_BASEMAP",// value: basemap key
  ZOOM_TO:       "ZOOM_TO",      // value: { region: string }
  TOGGLE_SOUND:  "TOGGLE_SOUND", // value: boolean
};
