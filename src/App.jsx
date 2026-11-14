import { useNarration } from './hooks/useNarration';
import { missions } from './data/missions';

import RelayTrack from './components/RelayTrack';
import AudioDock from './components/AudioDock';
import SuitPicker from './components/SuitPicker';

import Prologue from './scenes/Prologue';
import ActScene from './scenes/ActScene';
import Epilogue from './scenes/Epilogue';
import Credits from './scenes/Credits';

export default function App() {
  const narration = useNarration();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] selection:bg-[var(--accent)] selection:text-[var(--bg)] transition-colors duration-250">
      {/* Fixed Relay Progress Track at the very top */}
      <RelayTrack />

      {/* Floating Suit Picker in top corner */}
      <aside className="fixed top-14 right-4 z-40 hidden sm:block">
        <SuitPicker />
      </aside>

      {/* Main Story Flow */}
      <main>
        {/* Prologue: The Bedroom Window */}
        <Prologue narration={narration} />

        {/* Dynamic 3 Mission Acts rendered from verified missions.js */}
        {missions.map((mission, index) => (
          <ActScene
            key={mission.id}
            mission={mission}
            narration={narration}
            actIndex={index + 1}
          />
        ))}

        {/* Epilogue: The Baton is Yours */}
        <Epilogue narration={narration} />
      </main>

      {/* Bottom Sticky Glassmorphic Audio Dock */}
      <AudioDock narration={narration} />

      {/* Credits & Official Space Apps Disclosures */}
      <Credits />
    </div>
  );
}
