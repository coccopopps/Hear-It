// MapView – full-screen, NASA GIBS tile overlay + chosen basemap
import { useEffect, useRef } from "react";
import {
  MapContainer, TileLayer, CircleMarker, Tooltip, useMap
} from "react-leaflet";
import { useApp } from "../../shared/AppContext.jsx";
import { MAPS, BASEMAPS, REGIONS } from "../../shared/commands.js";

// NASA GIBS WMTS base URL
const GIBS = "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/{layer}/default/2024-11-01/GoogleMapsCompatible_Level6/{z}/{y}/{x}.jpg";

// Representative hotspot data per layer
const HOTSPOTS = {
  wildfire: [
    { name: "Amazon Basin", pos: [-5, -60],  v: 0.9 },
    { name: "California",   pos: [37, -120], v: 0.75 },
    { name: "Australia",    pos: [-28, 134], v: 0.65 },
    { name: "Siberia",      pos: [60, 110],  v: 0.6  },
    { name: "Central Africa", pos: [-5, 25], v: 0.8  },
  ],
  climate: [
    { name: "Arctic",         pos: [75, 0],   v: 1.0 },
    { name: "Sahel",          pos: [14, 2],   v: 0.85 },
    { name: "Mediterranean",  pos: [37, 15],  v: 0.6  },
    { name: "Greenland",      pos: [72, -40], v: 0.9  },
    { name: "Indian Ocean",   pos: [0, 75],   v: 0.5  },
  ],
  co2: [
    { name: "East Asia",      pos: [35, 115],  v: 1.0  },
    { name: "Eastern US",     pos: [40, -75],  v: 0.7  },
    { name: "Western Europe", pos: [51, 10],   v: 0.65 },
    { name: "India",          pos: [22, 80],   v: 0.75 },
    { name: "Amazon",         pos: [-5, -55],  v: 0.5  },
  ],
  aerosol: [
    { name: "Sahara",         pos: [22, 15],   v: 0.9  },
    { name: "South Asia",     pos: [25, 75],   v: 0.8  },
    { name: "East China",     pos: [32, 118],  v: 0.85 },
    { name: "West Africa",    pos: [12, 0],    v: 0.7  },
    { name: "Arabia",         pos: [25, 45],   v: 0.6  },
  ],
};

function Flyer({ region }) {
  const map = useMap();
  useEffect(() => {
    const r = region && REGIONS[region.toLowerCase()];
    if (r) map.flyTo(r.center, r.zoom, { duration: 1.8 });
  }, [region, map]);
  return null;
}

export default function MapView() {
  const { state } = useApp();
  const layer = MAPS[state.map];
  const basemap = BASEMAPS[state.basemap];
  const hotspots = HOTSPOTS[state.map] ?? [];

  const gibsUrl = GIBS.replace("{layer}", layer.nasaLayer);

  return (
    <section aria-label={`${layer.label} map`} className="map-wrap">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={8}
        zoomControl={true}
        className="leaflet-container"
        style={{ height: "100%", width: "100%" }}
      >
        {/* Basemap */}
        <TileLayer key={state.basemap} url={basemap.url} maxZoom={18} />

        {/* NASA GIBS overlay */}
        <TileLayer
          key={state.map}
          url={gibsUrl}
          opacity={0.72}
          maxZoom={6}
          tileSize={256}
        />

        <Flyer region={state.region} />

        {hotspots.map((p) => (
          <CircleMarker
            key={p.name}
            center={p.pos}
            radius={8 + p.v * 18}
            pathOptions={{
              color: layer.color,
              fillColor: layer.color,
              fillOpacity: 0.25,
              weight: 1.5,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              <br />
              <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                Intensity: {Math.round(p.v * 100)}%
              </span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Subtle credit */}
      <div className="map-credit">
        Imagery: NASA GIBS / EARTHDATA · Basemap: {basemap.label}
      </div>
    </section>
  );
}
