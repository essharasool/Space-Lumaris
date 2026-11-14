import { useEffect, useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import { badge } from '../data/missions';
import { useStore } from '../lib/store';
import { closePanel } from '../lib/narrator';

const NIGHT = '#0d1226';
const GOLD = '#f4c46a';
const CREAM = '#f6efe2';

function drawBadge(ctx, name) {
  const S = 600;
  ctx.clearRect(0, 0, S, S);
  ctx.save();
  ctx.beginPath();
  ctx.arc(300, 300, 284, 0, Math.PI * 2);
  ctx.fillStyle = NIGHT;
  ctx.fill();
  ctx.clip();
  // stars
  let seed = 7;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = `rgba(246,239,226,${0.3 + r() * 0.6})`;
    ctx.beginPath();
    ctx.arc(r() * S, r() * S, 0.6 + r() * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  // Moon + Mars + relay arc
  ctx.fillStyle = '#b9b6ae';
  ctx.beginPath();
  ctx.arc(170, 200, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c0663a';
  ctx.beginPath();
  ctx.arc(430, 170, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(120, 330);
  ctx.quadraticCurveTo(170, 150, 300, 230);
  ctx.quadraticCurveTo(400, 290, 430, 170);
  ctx.stroke();
  ctx.setLineDash([]);
  // baton
  ctx.save();
  ctx.translate(300, 290);
  ctx.rotate(-0.5);
  ctx.fillStyle = GOLD;
  ctx.fillRect(-70, -13, 140, 26);
  ctx.fillStyle = CREAM;
  ctx.fillRect(-74, -15, 12, 30);
  ctx.fillRect(62, -15, 12, 30);
  ctx.restore();
  ctx.restore();
  // rings
  ctx.lineWidth = 14;
  ctx.strokeStyle = GOLD;
  ctx.beginPath();
  ctx.arc(300, 300, 284, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(244,196,106,0.6)';
  ctx.beginPath();
  ctx.arc(300, 300, 262, 0, Math.PI * 2);
  ctx.stroke();
  // text
  ctx.textAlign = 'center';
  ctx.fillStyle = CREAM;
  ctx.font = '600 22px "Atkinson Hyperlegible Mono", monospace';
  ctx.fillText(badge.lines[0], 300, 380);
  ctx.fillStyle = GOLD;
  const n = (name.trim() || badge.fallbackName).toUpperCase();
  ctx.font = `italic 600 ${n.length > 14 ? 34 : 44}px "Fraunces Variable", Georgia, serif`;
  ctx.fillText(n, 300, 432);
  ctx.fillStyle = 'rgba(246,239,226,0.8)';
  ctx.font = '15px "Atkinson Hyperlegible Mono", monospace';
  ctx.fillText(badge.lines[1], 300, 470);
  ctx.fillText(badge.lines[2], 300, 494);
}

/** "Pass the baton": make a personal relay badge (drawn locally, downloaded as PNG) */
export default function BadgeMaker() {
  const open = useStore((s) => s.panel === 'badge');
  const [name, setName] = useState('');
  const canvas = useRef();
  const input = useRef();

  useEffect(() => {
    if (!open) return undefined;
    input.current?.focus();
    const onKey = (e) => e.key === 'Escape' && closePanel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open && canvas.current) drawBadge(canvas.current.getContext('2d'), name);
  }, [open, name]);

  if (!open) return null;

  const download = () => {
    const a = document.createElement('a');
    a.download = `relay-badge-${(name.trim() || 'explorer').replace(/\s+/g, '-').toLowerCase()}.png`;
    a.href = canvas.current.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="drawer-backdrop is-center" onClick={closePanel}>
      <div className="badge-modal" role="dialog" aria-modal="true" aria-labelledby="badge-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn badge-close" onClick={closePanel} aria-label="Close badge maker">
          <X size={22} />
        </button>
        <canvas ref={canvas} width="600" height="600" className="badge-canvas" role="img" aria-label={`Relay badge for ${name || badge.fallbackName}`} />
        <div className="badge-side">
          <h2 id="badge-title" className="drawer-title">
            {badge.title}
          </h2>
          <p className="drawer-sub">{badge.intro}</p>
          <label htmlFor="badge-name" className="sr-only">
            {badge.placeholder}
          </label>
          <input
            ref={input}
            id="badge-name"
            className="badge-input"
            value={name}
            maxLength={22}
            placeholder={badge.placeholder}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          <button type="button" className="gate-primary" onClick={download}>
            <Download size={18} aria-hidden="true" /> {badge.download}
          </button>
        </div>
      </div>
    </div>
  );
}
