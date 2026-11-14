import { lazy, Suspense, useEffect } from 'react';
import { initNarrator } from './lib/narrator';
import Gate from './ui/Gate';
import Captions from './ui/Captions';
import KineticTitles from './ui/KineticTitles';
import RelayTrack from './ui/RelayTrack';
import Dock from './ui/Dock';
import Sketchbook from './ui/Sketchbook';
import SourcesDrawer from './ui/SourcesDrawer';
import BadgeMaker from './ui/BadgeMaker';
import WorldBoundary from './ui/WorldBoundary';

// the whole 3D world loads as its own chunk so the first screen paints fast
const World = lazy(() => import('./world/World'));

// how tall the invisible scroll track is (the story is ~160 s of narration)
const STORY_HEIGHT = '1800vh';

export default function App() {
  useEffect(() => initNarrator(), []);
  return (
    <>
      <div className="world" aria-hidden="true">
        <WorldBoundary>
          <Suspense fallback={<div className="world-fallback" />}>
            <World />
          </Suspense>
        </WorldBoundary>
      </div>
      <div className="scroll-track" style={{ height: STORY_HEIGHT }} aria-hidden="true" />
      <main className="overlay">
        <Gate />
        <KineticTitles />
        <Captions />
        <Sketchbook />
      </main>
      <RelayTrack />
      <Dock />
      <SourcesDrawer />
      <BadgeMaker />
    </>
  );
}
