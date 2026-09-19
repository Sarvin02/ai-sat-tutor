# AI SAT Tutor — Project Notes & Handoff

> **Purpose of this file:** A single, self-contained reference so that any AI
> assistant (or human) can pick up this project, understand what it is, what
> has been done so far, and what the goals are — without needing to re-explore
> the codebase. Read this top to bottom first.
>
> **Last updated:** 2026-09-19

---

## 1. The Big Picture / Goal

**Project:** `ai-sat-tutor` — an **AI-powered SAT tutoring app** with adaptive
practice questions, instant step-by-step explanations, and per-skill progress
tracking. It ships as **two clients** (web + mobile) that share one domain core.

**North-star goal (NOT yet implemented — noted for future work):**
> Build the AI SAT Tutor app so that it uses a **custom model** (a
> fine-tuned / self-hosted / custom LLM) instead of a stock provider model.
>
> ⚠️ **The custom model has NOT been built yet.** This is a stated goal to
> remember. The codebase is currently structured so that *any* LLM provider
> (OpenAI, Anthropic, or a custom endpoint) can be plugged in later via the
> shared `buildTutorSystemPrompt()` helper and a server-side API route. See
> §7 "Extending with a real / custom LLM" for the intended integration path.

---

## 2. GitHub Repository

| Item | Value |
| --- | --- |
| **Remote (origin)** | `https://github.com/Sarvin02/ai-sat-tutor.git` |
| **Default branch** | `main` |
| **Local branch** | `main` (tracks `origin/main`) |
| **License** | MIT |
| **Commits so far** | `ee909d6` Initial commit: AI SAT tutor monorepo (web + mobile + shared) · `3ce87cc` Add dark-mode UI: dashboard, practice, study, vocab, review, stats, profile |

The local working copy is kept in sync with GitHub (`git pull` → "Already up to
date" as of 2026-09-19).

---

## 3. What Has Been Done So Far (Session Log)

Chronological record of work performed in this environment:

1. **Inspected the repo** — confirmed it is a pnpm + Turborepo monorepo
   (web + mobile + shared). Read `package.json`, `README.md`,
   `docs/ARCHITECTURE.md`, and the shared package sources.
2. **Checked the GitHub remote** — `origin` = `Sarvin02/ai-sat-tutor`, on
   `main`.
3. **Pulled from GitHub** — `git pull` → already up to date (nothing new).
4. **Verified prerequisites** — Node.js `v24.13.1` present; pnpm was missing.
5. **Installed pnpm** — `npm install -g pnpm@9` (pnpm v9.15.9).
6. **Installed dependencies** — `pnpm install` (all 4 workspace packages).
7. **Started the dev server** — `pnpm dev` → Next.js 14.2.35 ready on
   `http://localhost:3000`. Verified the home page renders (dashboard with
   streak, avg. score, practice test, study session, vocab, etc.).
8. **Created a double-click launcher** — `scripts/start-server.bat` (see §6).
   Tested it: it correctly detects an already-running server on port 3000 and
   just opens the browser.
9. **Created this notes file** — `notes/PROJECT_NOTES.md`.

---

## 4. Repository Layout

```
ai-sat-tutor/
├── apps/
│   ├── web/          # Next.js 14 web app (App Router) + Tailwind CSS
│   │   ├── app/      #   routes: /, /practice, /study, /vocab, /review, /stats, /profile
│   │   └── components/  # icons, mobile-nav, nav, page-header, practice-client, sidebar
│   └── mobile/       # Expo / React Native mobile app
│       ├── App.tsx
│       └── components/PracticeScreen.tsx
├── packages/
│   └── shared/       # Shared types, seed question bank, AI helpers
│       └── src/
│           ├── index.ts
│           ├── types.ts      # Question, AnswerRecord, SkillScore, TutorMessage, TutorConfig
│           ├── questions.ts  # seed question bank + getSeedQuestion()
│           └── ai.ts         # scoring, adaptive selection, prompts
├── docs/
│   └── ARCHITECTURE.md
├── scripts/
│   └── start-server.bat      # double-click launcher (added this session)
├── notes/
│   └── PROJECT_NOTES.md      # this file
├── turbo.json                # Turborepo task pipeline
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

**Why a monorepo:** one source of truth for the SAT domain (types, question
bank, scoring) so the web and mobile clients never drift. Cross-app changes
are a single commit; Turborepo caches builds/type-checks per package.

---

## 5. Tech Stack & Key Details

| Layer | Technology |
| --- | --- |
| **Monorepo tooling** | pnpm workspaces + Turborepo (`workspace:*` internal deps) |
| **Web app** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **Mobile app** | Expo SDK 51, React Native 0.74, TypeScript |
| **Shared package** | Raw TypeScript (no build step; consumed via `transpilePackages` on web, Babel on Expo) |
| **Language** | TypeScript `strict` everywhere (via `tsconfig.base.json`) |
| **Node requirement** | ≥ 18.18 (this env runs v24.13.1) |
| **pnpm requirement** | ≥ 9 (this env runs v9.15.9) |

### Shared package (`packages/shared`) — the domain core

| File | Responsibility |
| --- | --- |
| `types.ts` | All domain types: `Question`, `AnswerRecord`, `PracticeSession`, `SkillScore`, `TutorMessage`, `TutorConfig` |
| `questions.ts` | Deterministic seed question bank + `getSeedQuestion()` |
| `ai.ts` | `computeSkillScores`, `pickNextSkill`, `summarizeSession`, `buildTutorSystemPrompt`, `DEFAULT_TUTOR_CONFIG` |

Key domain types (from `types.ts`):
- `SatSection` = `"reading-writing" | "math"`
- `Difficulty` = `"easy" | "medium" | "hard"`
- `Question` — `id`, `section`, `skill`, `difficulty`, `prompt`, `passage?`,
  `options[]`, `correctOptionId`, `explanation`, `timeLimitSeconds?`,
  `aiGenerated?`
- `AnswerRecord` — `questionId`, `selectedOptionId`, `correct`, `timeSpentMs`,
  `answeredAt`
- `SkillScore` — `skill`, `section`, `score` (0–100), `sampleSize`,
  `lastPracticedAt`
- `TutorConfig` — `model`, `maxTokens`, `temperature`
  - `DEFAULT_TUTOR_CONFIG` = `{ model: "gpt-4o-mini", maxTokens: 1024, temperature: 0.4 }`

AI helpers (from `ai.ts`):
- `computeSkillScores(answers, skillToSection)` — lightweight client-side
  proficiency heuristic (correct-rate, recency-weighted). A production system
  would use a Bayesian / IRT model server-side.
- `pickNextSkill(scores, minSampleSize=3)` — targets the weakest skill with
  enough sample size; falls back to overall weakest.
- `summarizeSession(session)` — total/correct/incorrect, accuracy %, avg time.
- `buildTutorSystemPrompt()` — the tutor's system prompt, kept in the shared
  package so web and mobile use identical instructions.

### Web app pages (`apps/web/app/`)
- `/` — landing / dashboard
- `/practice` — interactive question player (client component)
- `/study` — AI tutor study session
- `/vocab` — SAT word flashcards
- `/review` — review quizzes (revisit wrong answers)
- `/stats` — progress / stats
- `/profile` — user profile

Key component: `components/practice-client.tsx` — renders the current
question, tracks selection, reveals the answer + explanation, and computes
live accuracy via `summarizeSession`.

### Mobile app
- Entry: `index.ts` → `App.tsx` → `components/PracticeScreen.tsx`
- Mirrors the web question player with native `Pressable`/`ScrollView` and the
  same shared scoring logic.

### Data flow (practice session)
1. App loads `SEED_QUESTIONS` from the shared package.
2. User selects an option → `handleSelect`.
3. "Check answer" → `handleReveal` records an `AnswerRecord` and shows the
   explanation.
4. "Next question" advances the index; on the last question it resets.
5. Live accuracy is derived from accumulated answers via `summarizeSession`.

---

## 6. How to Run It

### Prerequisites
- Node.js ≥ 18.18
- pnpm ≥ 9 (`npm i -g pnpm` if missing)
- For mobile: Expo Go on your phone, or Xcode / Android Studio for native builds

### Option A — Double-click launcher (easiest)
Double-click **`scripts/start-server.bat`**. It will:
1. Check Node.js is installed (auto-installs pnpm if missing).
2. If a server is already running on port 3000, just open the browser.
3. On first run, run `pnpm install` automatically.
4. Start `pnpm dev` and auto-open `http://localhost:3000` when ready.

To stop: press `Ctrl+C` in the terminal window (or close it).

### Option B — Manual commands
```bash
# 1. Install dependencies
pnpm install

# 2. Run everything in dev mode (web on :3000)
pnpm dev
```
Open http://localhost:3000.

### Run a single app
```bash
# Web only
pnpm --filter @ai-sat-tutor/web dev

# Mobile only (starts the Expo dev server)
pnpm --filter @ai-sat-tutor/mobile start
```
Then press `a` (Android), `i` (iOS simulator), or `w` (web) in the Expo prompt,
or scan the QR code with the Expo Go app.

### Common commands
| Command | What it does |
| --- | --- |
| `pnpm dev` | Run all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm typecheck` | Type-check every package |
| `pnpm lint` | Lint every package |
| `pnpm format` | Format the repo with Prettier |

---

## 7. Extending with a Real / Custom LLM (the stated goal)

The app works **out of the box with no API key** using the seed question bank
in `packages/shared/src/questions.ts`. The **app-side integration for the
custom model is now built** (2026-09-19); the model itself is still to be
trained on the DGX Spark.

**What exists now (app-side):**
- `apps/web/app/api/tutor/route.ts` — a **provider-agnostic** POST route. It
  reads `TUTOR_API_BASE`, `TUTOR_MODEL`, `TUTOR_API_KEY` (plus optional
  `TUTOR_TEMPERATURE`, `TUTOR_MAX_TOKENS`) from env and calls any
  OpenAI-compatible `/chat/completions` endpoint. Point it at the fine-tuned
  model on the Spark (vLLM/Ollama) or a stock provider.
- **Six tasks** (`TutorTask`): `tutor_chat`, `question_gen`, `explain`,
  `study_plan`, `full_test` — each with a tuned system prompt
  (`buildTaskSystemPrompt`) and adaptive-context instruction
  (`buildTaskUserPrompt` / `buildTutorMessages`).
- **Server-side validation** of structured output: `validateQuestion`,
  `validatePracticeTest`, `validateStudyPlan`, with `extractJson` to strip
  LLM artifacts (code fences / prose). Invalid JSON → HTTP 502 with the raw
  output for debugging.
- **New shared types**: `TutorTask`, `TutorContext`, `TutorRequest`,
  `TutorResponse`, `StudyPlan`, `PracticeTest` (in `packages/shared/src/types.ts`).
- **Study page wired up**: `apps/web/app/study/page.tsx` now calls
  `/api/tutor` for `tutor_chat` and falls back to a friendly placeholder when
  no model is configured.
- **Env example**: `apps/web/.env.local.example`.

**To use the custom model:**
1. Train + serve the model on the DGX Spark (vLLM, OpenAI-compatible, port 8000).
2. In `apps/web/.env.local`, set `TUTOR_API_BASE=http://<spark-ip>:8000/v1`
   and `TUTOR_MODEL=<your-model-name>`.
3. Restart the web app. The study page (and any future practice/review
   features) will use the custom model.

**Full planning stages & task list:** see
[`notes/PROJECT_TIMELINE.md`](./PROJECT_TIMELINE.md) — a complete,
ready-to-use timeline of every phase (0–5) and task for building the custom
model (data → train → eval → serve → integrate → launch), organized so each
phase can become a GitHub Project milestone and each task a card. A
CSV version for import is at [`notes/PROJECT_TIMELINE.csv`](./PROJECT_TIMELINE.csv).
The source of truth is the model project at `AI/sat-tutor-model/`
(`PLAN.md`, `README.md`, `data_gen/`, `training/`, `eval/`, `serving/`).

**Security conventions:**
- Keep provider keys in environment variables (`.env.local`, git-ignored) and
  only read them on the server.
- No secrets in the repo; `.env*` files are git-ignored.

> **Reminder:** the custom model itself has **not** been trained yet. This
> section documents the (now-complete) app-side integration and *where* the
> model plugs in.

---

## 8. Conventions & Gotchas

- TypeScript `strict` mode everywhere (via `tsconfig.base.json`).
- pnpm workspaces; internal deps use the `workspace:*` protocol.
- Turborepo tasks: `dev` (persistent, no cache), `build`, `lint`, `typecheck`,
  `test`.
- The shared package is consumed as **raw TypeScript** — no build step in dev.
- `computeSkillScores` currently groups by `questionId` as a stand-in for
  skill; a real implementation would carry the skill on the `AnswerRecord`.
- On Windows, the launcher is a `.bat` file; if SmartScreen warns, click
  "More info" → "Run anyway" (it's a local script).

---

## 9. Quick Reference (copy-paste)

```bash
# Install (first time)
npm install -g pnpm@9
pnpm install

# Run
pnpm dev            # web on http://localhost:3000

# Or double-click: scripts\start-server.bat

# Git
git pull            # sync with https://github.com/Sarvin02/ai-sat-tutor.git
```
