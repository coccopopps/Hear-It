import { useState } from "react";
import { AppProvider } from "./shared/AppContext.jsx";
import SidePanel from "./components/ui/SidePanel.jsx";
import MapView from "./components/maps/MapView.jsx";
import Soundscape from "./components/audio/Soundscape.jsx";

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <AppProvider>
      {/* Mobile hamburger */}
      <button className="menu-toggle" onClick={() => setPanelOpen(o => !o)} aria-label="Toggle menu">
        {panelOpen ? "✕" : "☰"}
      </button>

      <div className="app-shell">
        <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />
        <MapView />
      </div>

      <Soundscape />
    </AppProvider>
  );
}
