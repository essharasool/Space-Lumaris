import { useRef, lazy, Suspense } from 'react';
import CountUp from '../components/CountUp';
import ScienceFile from '../components/ScienceFile';
import Karaoke from '../components/Karaoke';

import TrenchDig from '../components/interactions/TrenchDig';
import ThenNow from '../components/interactions/ThenNow';
import SizeRuler from '../components/interactions/SizeRuler';
import RatGrind from '../components/interactions/RatGrind';
import DustStorm from '../components/interactions/DustStorm';

const Globe3D = lazy(() => import('./Globe3D'));

export default function ActScene({ mission, narration, actIndex }) {
  const { currentTrack, activeLineIndex } = narration;
  const sectionRef = useRef(null);

  const isCurrentTrack = currentTrack?.id === mission.id;

  return (
    <section
      id={`act-${mission.id}`}
      ref={sectionRef}
      data-planet={mission.planet}
      className="relative min-h-screen py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--muted)]/20 transition-colors"
    >
      {/* HUD Telemetry Strip */}
      <header className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[var(--muted)]/20 mb-10">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[var(--accent)]" />
          <span className="hud-label text-xs font-bold text-[var(--accent)]">
            LEG 0{actIndex}: {mission.title.toUpperCase()}
          </span>
          <span className="hud-label text-xs text-[var(--muted)] hidden sm:inline">
            [{mission.nssdcaId}]
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)]">
          <span>DATE: {mission.date}</span>
          <span>LOCATION: {mission.place}</span>
          <span className="text-[var(--ink)] font-bold">COORDS: {mission.coords}</span>
        </div>
      </header>

      {/* Asymmetric 7/5 Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (Desktop 7 cols): Photos, Globe, and Visual Artifacts */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main NASA Photo Frame */}
          <div className="rounded-2xl overflow-hidden border border-[var(--muted)]/30 bg-black/60 shadow-xl relative">
            <div className="relative aspect-4/3 w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
              {mission.photos?.[0] && (
                <img
                  src={mission.photos[0].file}
                  alt={mission.photos[0].alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Placeholder fallback if user has not downloaded the asset yet
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              {/* Museum caption */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-wrap justify-between items-end gap-2 text-white">
                <div>
                  <span className="hud-label text-[10px] text-amber-300 block">
                    {mission.photos?.[0]?.credit || 'NASA'}
                  </span>
                  <p className="text-xs sm:text-sm font-medium">
                    {mission.photos?.[0]?.alt}
                  </p>
                </div>
                <span className="hud-label text-[10px] bg-white/20 px-2 py-1 rounded">
                  {mission.photos?.[0]?.id}
                </span>
              </div>
            </div>
          </div>

          {/* Hands-on Interactive Experience for this Act */}
          {mission.id === 'surveyor' && (
            <div className="space-y-6">
              <TrenchDig />
              <ThenNow />
            </div>
          )}

          {mission.id === 'sojourner' && (
            <div className="space-y-6">
              <SizeRuler />
            </div>
          )}

          {mission.id === 'opportunity' && (
            <div className="space-y-6">
              <RatGrind />
              <DustStorm />
            </div>
          )}

          {/* Lazy 3D Globe Radar */}
          <Suspense fallback={<div className="h-48 rounded-xl bg-[var(--surface)] animate-pulse" />}>
            <Globe3D planet={mission.planet} />
          </Suspense>
        </div>

        {/* Right Column (Desktop 5 cols): Story, Baton, Stats, Karaoke, Science File */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="hud-label text-xs text-[var(--accent)] tracking-widest font-semibold">
              Mission Dossier
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[var(--ink)] mt-1">
              {mission.title}
            </h2>
            <p className="text-base sm:text-lg text-[var(--muted)] font-medium mt-1">
              "{mission.nickname}" · {mission.planet.toUpperCase()}
            </p>
          </div>

          {/* The Cosmic Baton Quote */}
          <div className="p-4 rounded-xl border-l-4 border-[var(--accent)] bg-[var(--surface)] shadow-sm">
            <span className="hud-label text-[11px] text-[var(--accent)] block mb-1">
              THE RELAY BATON CARRIED:
            </span>
            <blockquote className="text-lg sm:text-xl font-display italic text-[var(--ink)] leading-snug">
              {mission.batonLine}
            </blockquote>
          </div>

          {/* Verified Stats Grid with CountUp */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {mission.stats.map((stat, i) => (
              <CountUp key={i} label={stat.label} value={stat.value} unit={stat.unit} />
            ))}
          </div>

          {/* Synchronized Karaoke Captions */}
          {isCurrentTrack && (
            <Karaoke track={currentTrack} activeLineIndex={activeLineIndex} />
          )}

          {/* Ticket-stub Secret Science File */}
          <ScienceFile file={mission.scienceFile} missionTitle={mission.title} />
        </div>
      </div>
    </section>
  );
}
