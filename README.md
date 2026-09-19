# 🎓 AI SAT Tutor

An AI-powered SAT tutoring app with adaptive practice questions, instant
step-by-step explanations, and per-skill progress tracking — available on the
**web** and **mobile**.

Built as a pnpm + Turborepo monorepo so the web and mobile apps share the same
domain types, question bank, and AI logic.

## Features

- **Adaptive practice** — questions adjust to your demonstrated skill level
- **Instant explanations** — every answer includes a clear breakdown
- **Skill tracking** — proficiency scores per skill (Reading & Writing + Math)
- **Cross-platform** — Next.js web app + Expo (React Native) mobile app
- **Shared core** — one source of truth for types, questions, and AI helpers

## Repository layout

```
ai-sat-tutor/
├── apps/
│   ├── web/        # Next.js 14 web app (Tailwind CSS)
│   └── mobile/     # Expo / React Native mobile app
├── packages/
│   └── shared/     # Shared types, seed question bank, AI helpers
├── turbo.json      # Turborepo task pipeline
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a deeper dive.

## Prerequisites

- [Node.js](https://nodejs.org) ≥ 18.18
- [pnpm](https://pnpm.io) ≥ 9 (`npm i -g pnpm`)
- For the mobile app: [Expo Go](https://expo.dev/go) on your phone, or Xcode /
  Android Studio for native builds

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. Run everything in dev mode (web on :3000)
pnpm dev
```

Open http://localhost:3000 to use the web app.

### Run a single app

```bash
# Web only
pnpm --filter @ai-sat-tutor/web dev

# Mobile only (starts the Expo dev server)
pnpm --filter @ai-sat-tutor/mobile start
```

Then press `a` (Android), `i` (iOS simulator), or `w` (web) in the Expo prompt,
or scan the QR code with the Expo Go app.

## Common commands

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `pnpm dev`          | Run all apps in dev mode              |
| `pnpm build`        | Build all apps                        |
| `pnpm typecheck`    | Type-check every package              |
| `pnpm lint`         | Lint every package                    |
| `pnpm format`       | Format the repo with Prettier         |

## Adding AI features

The shared package exposes `buildTutorSystemPrompt()` and a `TutorConfig` type
(`packages/shared/src/ai.ts`). To wire up a real LLM:

1. Add an API route in `apps/web/app/api/tutor/route.ts` that calls your
   provider (OpenAI, Anthropic, etc.) using `buildTutorSystemPrompt()`.
2. Read the provider key from an environment variable (e.g.
   `OPENAI_API_KEY`) — never commit secrets.
3. Have the route return a `Question` object (see
   `packages/shared/src/types.ts`) so both apps can render it identically.

The seed question bank in `packages/shared/src/questions.ts` works with no
API key, so the app is fully functional out of the box.

## License

MIT — see [LICENSE](LICENSE).
