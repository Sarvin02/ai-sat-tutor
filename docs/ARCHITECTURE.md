# Architecture

## Overview

`ai-sat-tutor` is a **pnpm + Turborepo monorepo** with two apps and one shared
package. The goal is a single source of truth for the SAT domain so the web
and mobile clients never drift apart.

```
┌─────────────────────────────────────────────────────────────┐
│                        apps/web                             │
│   Next.js 14 (App Router) + Tailwind CSS                    │
│   - Home page, /practice (interactive question player)      │
└───────────────────────────┬─────────────────────────────────┘
                            │ imports
┌───────────────────────────┴─────────────────────────────────┐
│                     packages/shared                          │
│   - types.ts      (Question, AnswerRecord, SkillScore, ...) │
│   - questions.ts  (seed question bank + lookup)             │
│   - ai.ts         (scoring, adaptive selection, prompts)    │
└───────────────────────────┬─────────────────────────────────┘
                            │ imports
┌───────────────────────────┴─────────────────────────────────┐
│                      apps/mobile                             │
│   Expo / React Native                                        │
│   - PracticeScreen (same question player, native UI)        │
└─────────────────────────────────────────────────────────────┘
```

## Why a monorepo?

- **Shared domain logic.** Types, the question bank, and scoring live in one
  place. A change to the `Question` schema is caught by the type-checker in
  both apps at once.
- **Atomic cross-app changes.** Adding a new field to a question is one commit
  that updates the shared package and both consumers.
- **Turborepo caching.** Builds and type-checks are cached per package, so
  re-running only re-does what changed.

## The shared package (`packages/shared`)

| File           | Responsibility                                              |
| -------------- | ----------------------------------------------------------- |
| `types.ts`     | All domain types: `Question`, `AnswerRecord`, `SkillScore`, `TutorMessage`, `TutorConfig` |
| `questions.ts` | A deterministic seed question bank + `getSeedQuestion()`    |
| `ai.ts`        | `computeSkillScores`, `pickNextSkill`, `summarizeSession`, `buildTutorSystemPrompt` |

The package is consumed as raw TypeScript (`main`/`types` point at
`src/index.ts`). The web app transpiles it via Next.js
`transpilePackages`; Expo handles it through its Babel pipeline. No build step
is required for the shared package in dev.

## Web app (`apps/web`)

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Pages**
  - `/` — landing page with feature highlights
  - `/practice` — interactive question player (client component)
- **Key component:** `components/practice-client.tsx`
  - Renders the current question, tracks selection, reveals the answer,
    shows the explanation, and computes live accuracy via
    `summarizeSession`.

## Mobile app (`apps/mobile`)

- **Framework:** Expo SDK 51 + React Native 0.74 + TypeScript
- **Styling:** `StyleSheet` (inline) — no extra UI dependencies
- **Entry:** `index.ts` → `App.tsx` → `components/PracticeScreen.tsx`
- Mirrors the web question player with native `Pressable`/`ScrollView`
  components and the same shared scoring logic.

## Data flow (practice session)

1. The app loads `SEED_QUESTIONS` from the shared package.
2. The user selects an option → `handleSelect`.
3. "Check answer" → `handleReveal` records an `AnswerRecord` and shows the
   explanation.
4. "Next question" advances the index; on the last question it resets.
5. Live accuracy is derived from the accumulated answers via
   `summarizeSession`.

## Extending with a real LLM

The intended path to AI-generated questions:

1. **API route** (`apps/web/app/api/tutor/route.ts`) — server-side, calls the
   LLM provider using `buildTutorSystemPrompt()` and the `TutorConfig`.
2. **Structured output** — the model returns a `Question` (JSON), validated
   against the shared type before being sent to the client.
3. **Adaptive selection** — use `computeSkillScores` + `pickNextSkill` to
   choose which skill the next generated question should target.
4. **Mobile parity** — the mobile app calls the same API route, so both
   clients get identical AI behavior.

Keep provider keys in environment variables (`.env.local`, git-ignored) and
only read them on the server.

## Conventions

- TypeScript `strict` mode everywhere (via `tsconfig.base.json`).
- pnpm workspaces; internal deps use the `workspace:*` protocol.
- Turborepo tasks: `dev` (persistent, no cache), `build`, `lint`,
  `typecheck`, `test`.
- No secrets in the repo; `.env*` files are git-ignored.
