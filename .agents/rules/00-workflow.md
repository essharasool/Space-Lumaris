# Workflow rules (save tokens, avoid breakage)

The person prompting you is a kid learning to code. Explain in 1–3 short, plain sentences at the end of each task: what changed and how to see it.

1. **One task per request.** Only touch the files the task names. If another file must change, say which one and why, in one line.
2. **Never rewrite a whole file to change a few lines.** Make targeted edits.
3. **Do not read** `node_modules/`, `dist/`, `public/audio/`, `public/models/`, `public/img/`, or `package-lock.json`.
4. **Content lives in data files.** Story text, numbers, captions and sources go in `src/data/missions.js` and `src/data/narration.js`. Components never hard-code facts.
5. **No new npm packages** beyond those in `10-stack.md` unless the user approves.
6. **Two-strike rule:** if a fix fails twice, stop. Explain the error simply and suggest a `git` rollback instead of looping.
7. After each working step, suggest a commit message (e.g. `feat: add audio dock`).
8. Run `npm run build` after big changes. A failing build is not "done".
9. Don't produce long explanations, summaries of unchanged code, or TODO essays.
10. Never invent facts, numbers, quotes, image IDs or URLs. If a fact is missing from `30-facts.md`, leave `/* VERIFY */` and tell the user.
