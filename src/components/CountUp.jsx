import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CountUp({ value, unit, label }) {
  const elRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // If value has non-digit prefixes like "about 10.5" or "over 14"
    const numericMatch = String(value).match(/([\d.]+)/);
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!numericMatch || isReduced) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseFloat(numericMatch[1]);
    const prefix = String(value).substring(0, numericMatch.index);
    const suffix = String(value).substring(numericMatch.index + numericMatch[1].length);

    const obj = { val: 0 };
    const st = ScrollTrigger.create({
      trigger: elRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: targetNumber,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            const formatted = Number.isInteger(targetNumber)
              ? Math.round(obj.val)
              : obj.val.toFixed(targetNumber.toString().split('.')[1]?.length || 1);
            setDisplayValue(`${prefix}${formatted}${suffix}`);
          },
        });
      },
    });

    return () => st.kill();
  }, [value]);

  return (
    <div ref={elRef} className="flex flex-col p-3 rounded-lg border border-[var(--muted)]/20 bg-[var(--surface)]/50">
      <span className="hud-label text-xs text-[var(--muted)]">{label}</span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="font-mono text-2xl md:text-3xl font-bold text-[var(--ink)] tracking-tight">
          {displayValue}
        </span>
        {unit && (
          <span className="text-sm font-medium text-[var(--muted)] font-mono">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
