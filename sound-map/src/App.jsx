// App.jsx only ASSEMBLES the pieces. Keep it tiny so merges stay easy.
import { AppProvider } from "./shared/AppContext.jsx";
import NavButtons from "./components/ui/NavButtons.jsx";
import MapView from "./components/maps/MapView.jsx";
import ChatButton from "./components/chatbot/ChatButton.jsx";
import Soundscape from "./components/audio/Soundscape.jsx";

export default function App() {
  return (
    <AppProvider>
      <header className="topbar">
        <h1>Sound Map</h1>
        <NavButtons />
      </header>
      <main>
        <MapView />
      </main>
      <Soundscape />
      <ChatButton />
    </AppProvider>
  );
}
