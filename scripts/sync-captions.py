"""One-time helper: word + sentence timestamps for the 5 narration tracks -> src/data/narration.js

Run (needs a Python with faster-whisper, plus ffmpeg on PATH):
  HF_HOME=<cache> python scripts/sync-captions.py

How it works
1. ffmpeg `silencedetect` finds the real pauses in each mp3 (used to snap line edges).
2. faster-whisper transcribes with word timestamps.
3. Whisper's words are aligned to the EXACT script words (difflib), so caption text never changes,
   only the timing comes from the audio. Unmatched script words get times interpolated from neighbours.
4. Each line also gets a scroll range inside its act, proportional to its time in the track,
   so autopilot (time -> scroll) and self-pilot (scroll -> time) use the same map.
"""
from __future__ import annotations

import difflib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "public" / "audio"
OUT = ROOT / "src" / "data" / "narration.js"

# Script text is the source of truth (content/scripts.md). One entry = one caption line.
TRACKS = [
    {
        "id": "intro", "file": "01-intro.mp3", "title": "Prologue: Look Up", "act": 0, "range": [0.0, 0.2],
        "lines": [
            "Look up at the night sky.",
            "Past the clouds, past the floating satellites, all the way to the Moon and Mars.",
            "It looks quiet, doesn't it?",
            "But if you look really closely, you might see the tracks of the greatest relay race in history.",
            "A race that took decades, where the runners were made of metal, wire, and dreams.",
            "Our story begins not with a starting pistol, but with a rocket.",
        ],
    },
    {
        "id": "surveyor", "file": "02-surveyor.mp3", "title": "Leg 1: Surveyor 3", "act": 1, "range": [0.2, 0.42],
        "lines": [
            "Think of space like a giant, dark garden.",
            "Before humans could visit, we needed to know if the soil was safe.",
            "In 1967, a brave little scout named Surveyor 3 landed on the Moon.",
            "It didn't have wheels to run; it just sat quietly, digging a tiny trench in the dirt.",
            "It was planting one of the very first seeds of our cosmic garden,",
            "safely passing the baton to the Apollo astronauts who came to visit it two and a half years later.",
        ],
    },
    {
        "id": "sojourner", "file": "03-sojourner.mp3", "title": "Leg 2: Sojourner", "act": 2, "range": [0.42, 0.64],
        "lines": [
            "The race didn't stop at the Moon.",
            "In 1997, millions of miles away on Mars, a tiny rover named Sojourner rolled out.",
            "It was no bigger than a microwave, moving like a slow, careful skateboard.",
            "Using its special APXS tool, it sniffed the Martian rocks, tasting the chemistry of an alien world.",
            "The baton had made it all the way to Mars!",
        ],
    },
    {
        "id": "oppy", "file": "04-oppy.mp3", "title": "Leg 3: Opportunity", "act": 3, "range": [0.64, 0.86],
        "lines": [
            "Then came the marathon runner.",
            "In 2004, Opportunity bounced onto the red dirt.",
            "'Oppy' was built to run for just 90 days, but it kept going for fourteen years!",
            "It used a tough little tool called the RAT to grind into rocks, unlocking secrets about ancient water.",
            "But even marathon runners need to rest.",
            "When a massive dust storm blocked the sun, Oppy sent its last message home.",
            "It wasn't words, just numbers, but the numbers said: no power left, and the sky is dark.",
            "The great runner finally went to sleep in the dust.",
        ],
    },
    {
        "id": "outro", "file": "05-outro.mp3", "title": "Epilogue: Your Turn", "act": 4, "range": [0.86, 1.0],
        "lines": [
            "Some people look at Surveyor, Sojourner, and Opportunity and think they are abandoned.",
            "But they aren't lost. They are monuments.",
            "They are the finish lines for the next generation of explorers.",
            "They wait silently in the dark, holding the baton out, ready for us to come back and run the next lap.",
            "The race isn't over. It's just your turn to run.",
        ],
    },
]

def norm(w: str) -> str:
    return re.sub(r"[^a-z0-9]", "", w.lower())


def duration(mp3: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp3)],
                       capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def silences(mp3: Path) -> list[tuple[float, float]]:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(mp3), "-af", "silencedetect=noise=-35dB:d=0.18", "-f", "null", "-"],
                       capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    return list(zip(starts, ends))


def align(script_words: list[str], asr: list[dict]) -> list[tuple[float | None, float | None]]:
    a = [norm(w) for w in script_words]
    b = [norm(w["text"]) for w in asr]
    times: list[list[float | None]] = [[None, None] for _ in a]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                times[i1 + k] = [asr[j1 + k]["start"], asr[j1 + k]["end"]]
        elif tag == "replace" and j2 > j1:
            # e.g. "1967" vs "nineteen sixty-seven": spread the ASR span evenly over the script words
            s, e = asr[j1]["start"], asr[j2 - 1]["end"]
            n = i2 - i1
            for k in range(n):
                times[i1 + k] = [s + (e - s) * k / n, s + (e - s) * (k + 1) / n]
    return times


def fill(times, total):
    """Interpolate words Whisper missed between known neighbours."""
    n = len(times)
    for i in range(n):
        if times[i][0] is None:
            prev_end = next((times[j][1] for j in range(i - 1, -1, -1) if times[j][1] is not None), 0.0)
            j = next((j for j in range(i + 1, n) if times[j][0] is not None), None)
            nxt = times[j][0] if j is not None else total
            gap = (j if j is not None else n) - i
            step = (nxt - prev_end) / (gap + 0)
            times[i] = [prev_end, prev_end + step]
    return times


def snap_start(t: float, sil: list[tuple[float, float]]) -> float:
    # if a line starts just after a detected pause, start exactly where the pause ends
    for s, e in sil:
        if abs(t - e) < 0.25:
            return e
    return t


def snap_end(t: float, sil: list[tuple[float, float]]) -> float:
    for s, e in sil:
        if abs(t - s) < 0.25:
            return s
    return t


def main() -> None:
    import os
    import site

    # pip-installed CUDA libs (nvidia-cublas-cu12 etc.) ship DLLs Windows can't find on its own
    for sp in site.getsitepackages():
        for bin_dir in Path(sp, "nvidia").glob("*/bin"):
            os.add_dll_directory(str(bin_dir))
            os.environ["PATH"] = str(bin_dir) + os.pathsep + os.environ["PATH"]
    from faster_whisper import WhisperModel

    model = WhisperModel("large-v3", device="cuda", compute_type="float16", local_files_only=True)
    out_tracks = []
    for tr in TRACKS:
        mp3 = AUDIO / tr["file"]
        total = duration(mp3)
        sil = silences(mp3)
        script = " ".join(tr["lines"])
        segs, _ = model.transcribe(str(mp3), language="en", word_timestamps=True, beam_size=5,
                                   initial_prompt=script, condition_on_previous_text=False, vad_filter=False)
        asr = [{"text": w.word.strip(), "start": w.start, "end": w.end} for s in segs for w in (s.words or [])]
        words = [w for line in tr["lines"] for w in line.split()]
        times = fill(align(words, asr), total)
        matched = sum(1 for w in words if norm(w) in {norm(x["text"]) for x in asr})
        print(f"{tr['file']}: {total:.2f}s, {len(asr)} asr words, {matched}/{len(words)} script words matched, {len(sil)} pauses")

        lines_out, k = [], 0
        p0, p1 = tr["range"]
        for li, line in enumerate(tr["lines"]):
            ws = line.split()
            wt = times[k:k + len(ws)]
            k += len(ws)
            start = snap_start(wt[0][0], sil) if li else 0.0
            end = snap_end(wt[-1][1], sil)
            lines_out.append({
                "text": line,
                "start": round(start, 2),
                "end": round(max(end, start + 0.2), 2),
                "words": [{"w": w, "s": round(t[0], 2), "e": round(t[1], 2)} for w, t in zip(ws, wt)],
            })
        # scroll range per line: proportional to time; line i owns [its start, next start)
        for li, ln in enumerate(lines_out):
            t0 = ln["start"]
            t1 = lines_out[li + 1]["start"] if li + 1 < len(lines_out) else total
            ln["scroll"] = [round(p0 + (p1 - p0) * t0 / total, 4), round(p0 + (p1 - p0) * t1 / total, 4)]
        out_tracks.append({"id": tr["id"], "src": f"/audio/{tr['file']}", "title": tr["title"], "act": tr["act"],
                           "duration": round(total, 2), "scroll": tr["range"], "lines": lines_out})

    header = (
        "// AUTO-GENERATED by scripts/sync-captions.py (faster-whisper word timestamps + ffmpeg silencedetect).\n"
        "// Caption TEXT is the exact script (content/scripts.md); only the times come from the audio.\n"
        "// Re-run the script if a track is re-recorded. Do not hand-edit times.\n"
        "// line: { text, start, end (s), scroll: [p0, p1] (0..1 story progress), words: [{ w, s, e }] }\n\n"
    )
    body = "export const tracks = " + json.dumps(out_tracks, ensure_ascii=False, indent=1) + ";\n"
    OUT.write_text(header + body, encoding="utf-8")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
