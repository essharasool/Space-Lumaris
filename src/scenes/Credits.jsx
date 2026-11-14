export default function Credits() {
  return (
    <footer className="border-t border-[var(--muted)]/20 py-16 px-6 md:px-12 max-w-5xl mx-auto text-sm text-[var(--muted)] space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[var(--muted)]/20 pb-8">
        <div>
          <span className="hud-label text-xs text-[var(--accent)] font-bold">
            NASA Space Apps Challenge 2026
          </span>
          <h4 className="text-xl font-display font-bold text-[var(--ink)] mt-1">
            Echoes in the Dust: The Cosmic Relay Race
          </h4>
          <p className="text-xs text-[var(--muted)] mt-1">
            Challenge Category: <em>Abandoned but Not Forgotten</em>
          </p>
        </div>

        <div className="px-4 py-2 rounded-lg border border-[var(--muted)]/30 font-mono text-xs text-[var(--ink)] bg-[var(--surface)]">
          Space Apps Challenge 2026 Entry
        </div>
      </div>

      {/* Grid of Verified NASA Data & Credits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h5 className="hud-label text-xs text-[var(--ink)] font-bold mb-3">
            NASA Data & Photography
          </h5>
          <ul className="space-y-1.5 text-xs">
            <li>
              <a
                href="https://science.nasa.gov/surveyor-3"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[var(--accent)]"
              >
                Surveyor 3 (NSSDCA ID 1967-035A)
              </a>
            </li>
            <li>
              <a
                href="https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/a12_h_48_7133.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[var(--accent)]"
              >
                Apollo 12 Photo AS12-48-7133
              </a>
            </li>
            <li>
              <a
                href="https://photojournal.jpl.nasa.gov/catalog/PIA01122"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[var(--accent)]"
              >
                Sojourner at Ares Vallis (PIA01122)
              </a>
            </li>
            <li>
              <a
                href="https://photojournal.jpl.nasa.gov/catalog/PIA22929"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[var(--accent)]"
              >
                Opportunity Last Image (PIA22929)
              </a>
            </li>
            <li>
              <a
                href="https://photojournal.jpl.nasa.gov/catalog/PIA22908"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[var(--accent)]"
              >
                Perseverance Valley Panorama (PIA22908)
              </a>
            </li>
            <li>
              <a
                href="https://science.nasa.gov/resource/spirit-and-opportunity-rover-3d-model/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[var(--accent)]"
              >
                NASA 3D Resources MER Model
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="hud-label text-xs text-[var(--ink)] font-bold mb-3">
            Typography & Open Source
          </h5>
          <ul className="space-y-1.5 text-xs">
            <li>Display: <strong>Fraunces</strong> (Variable Serif, OFL)</li>
            <li>Body: <strong>Atkinson Hyperlegible Next</strong> (Braille Institute)</li>
            <li>Telemetry: <strong>Atkinson Hyperlegible Mono</strong></li>
            <li>Animation: <strong>GSAP 3 & ScrollTrigger</strong></li>
            <li>Smooth Scroll: <strong>Lenis</strong></li>
          </ul>
        </div>

        <div>
          <h5 className="hud-label text-xs text-[var(--ink)] font-bold mb-3">
            Ethical & AI Disclosure
          </h5>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            In compliance with challenge rules, robot visuals are exclusively verified public domain NASA photographs. Background mood scenes are original human prompts generated with Gemini AI (labeled "Illustration (AI-assisted)"). Narration is an AI voice actor. No kid under 18 faces or voices are depicted.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--muted)]/20 text-center text-xs font-mono">
        All hardware hardware left behind is a seed for tomorrow's travelers.
      </div>
    </footer>
  );
}
