// OWNER: map person. Reads state.map and state.region from shared state.
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useApp } from "../../shared/AppContext.jsx";
import { MAPS } from "../../shared/commands.js";

// Placeholder data. Replace with real NASA datasets.
const DATA = {
  climate: [{ name: "Sahel", pos: [14, 2], v: 0.9 }, { name: "Mediterranean", pos: [37, 15], v: 0.6 }],
  wildfire: [{ name: "California", pos: [37, -120], v: 0.8 }, { name: "Algeria", pos: [36, 3], v: 0.5 }],
  co2: [{ name: "East Asia", pos: [35, 110], v: 1 }, { name: "Europe", pos: [50, 10], v: 0.6 }],
};

const REGIONS = {
  algeria: [28, 2, 5],
  europe: [50, 10, 4],
  africa: [5, 20, 3],
  world: [20, 0, 2],
};

function Flyer({ region }) {
  const map = useMap();
  useEffect(() => {
    const r = region && REGIONS[region.toLowerCase()];
    if (r) map.flyTo([r[0], r[1]], r[2]);
  }, [region, map]);
  return null;
}

export default function MapView() {
  const { state } = useApp();
  return (
    <section aria-label={`${MAPS[state.map].label} map`} className="map-wrap">
      <MapContainer center={[20, 0]} zoom={2} className="map">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Flyer region={state.region} />
        {DATA[state.map].map((p) => (
          <CircleMarker key={p.name} center={p.pos} radius={10 + p.v * 20} pathOptions={{ color: "#b3261e" }}>
            <Tooltip>{p.name}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </section>
  );
}
