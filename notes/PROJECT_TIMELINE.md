# AI SAT Tutor — Project Timeline (Planning Stages + Tasks)

> **What this is:** A complete, ready-to-use timeline of every planning stage
> and task needed to build the **custom SAT tutor model** and wire it into the
> `ai-sat-tutor` app. It is organized so each **Phase** can become a milestone
> and each **Task** can become a card/item in a GitHub Project timeline.
>
> **Source of truth:** the model project at `AI/sat-tutor-model/`
> (specifically `PLAN.md`, `README.md`, `data_gen/README.md`,
> `training/config.yaml`, `serving/README.md`, and `phase0-setup.sh`).
>
> **Last updated:** 2026-09-19

---

## How to use this file

- **For a GitHub Project timeline:** each `### Phase N` = a **milestone**;
  each `- [ ]` task = a **card/item**. Copy the task title into the item title
  and the indented detail into the item description.
- **Where it happens:** most work is on the **DGX Spark (Linux/Arm64)** in the
  `sat-tutor-model` repo. **Phase 4** also touches the **`ai-sat-tutor` app
  repo** (Windows) — that is the only phase that edits the app.
- **Definition of done:** each phase lists a **Verification** line — treat it
  as the acceptance criteria for that milestone.

---

## Summary (at a glance)

| Phase | Milestone | Goal | Where |
| --- | --- | --- | --- |
| **0** | Environment & Infrastructure | Reproducible Linux training + serving env on both Sparks | DGX Spark |
| **1** | Data Collection & Curation | High-quality multi-task dataset → `data/final/{train,val,test}.jsonl` | DGX Spark |
| **2** | Fine-tuning | LoRA adapter teaching all six behaviors → merged model | DGX Spark |
| **3** | Evaluation | Prove the model is Aniko-like and beats base/stock | DGX Spark |
| **4** | Serving & App Integration | App uses the custom model end-to-end (web + mobile) | Spark + app |
| **5** | Testing, Tuning & Launch | Clean end-to-end run, tuned latency, launch runbook | Spark + app |

**The six behaviors the model must learn (v1 scope):**
1. Socratic tutor chat (conversational, hint-first)
2. Question generation (structured `Question` JSON)
3. Step-by-step explanations (tailored to the student's chosen option)
4. Adaptive difficulty (targets weak skills)
5. Personalized study plans (test date + target score)
6. Full-length practice-test generation

**Locked decisions (from PLAN.md):**
- **Compute:** 2× NVIDIA DGX Spark (GB10, 128 GB unified mem, Linux/Arm64, CUDA/Blackwell)
- **Model approach:** LoRA fine-tune of an open-weights base model
  - **Primary:** `Qwen/Qwen2.5-14B-Instruct` (quality; fits 128 GB easily)
  - **Fast iteration:** `Qwen/Qwen2.5-7B-Instruct`
  - **Alternative:** `meta-llama/Llama-3.1-8B-Instruct`
  - **Deployment constraint:** students download the fine-tuned model to their
    own machines, so it must be small (~3 GB at Q4) and fast for interactive chat.
- **Hosting:** self-hosted locally (vLLM primary, Ollama for quick dev)
- **Training data:** synthetic (frontier LLM) + public SAT datasets + user's scanned worksheets
- **Key split:** app dev on **Windows** (`ai-sat-tutor`); model training +
  serving on the **DGX Spark**. The app talks to the model over the network via
  an OpenAI-compatible endpoint.

---

## Phase 0 — Environment & Infrastructure

**Milestone:** `Phase 0 — Environment & Infrastructure`
**Goal:** A reproducible Linux training + serving environment on both Sparks.
**Where:** DGX Spark (Linux/Arm64)
**Verification:** `python -c "import torch; print(torch.cuda.get_device_properties(0))"`
shows 128 GB; `vllm serve` boots a test model and answers a chat completion via `curl`.

- [ ] **Provision both Sparks** — confirm CUDA + PyTorch with Blackwell
  (sm_121) support (PyTorch ≥ 2.7 / CUDA ≥ 12.8). Verify
  `torch.cuda.is_available()` and 128 GB visible.
- [ ] **Set up the training stack** (venv): `transformers`, `peft` (LoRA),
  `trl` (SFTTrainer), `datasets`, `accelerate`, `bitsandbytes` (optional 4-bit
  base), `wandb` (or `tensorboard`) for logging.
- [ ] **Set up the serving stack:** `vllm` (OpenAI-compatible server +
  guided/structured decoding via outlines/xgrammar) and `ollama` (quick local dev).
- [ ] **Set up data tooling:** Python + `pandas`, OCR for worksheets
  (`ocrmypdf`/`tesseract`, or a vision LLM for math-heavy scans), `pydantic`
  JSON schema validators, JSONL handling.
- [ ] **Confirm repo layout** exists (this repo, lives on the Spark):
  `data/{raw,generated,final}`, `data_gen/`, `training/`, `eval/`, `serving/`.
- [ ] **Confirm network reachability** — the Windows app can reach a Spark's
  vLLM port (e.g. `http://<spark-ip>:8000/v1`). Note the endpoint + model name
  for the app's `.env.local`.
- [ ] **Run the bootstrap script** — `chmod +x phase0-setup.sh && ./phase0-setup.sh`
  (does steps 1–5 automatically: verify env, create venv, install stack,
  scaffold layout, git init).

---

## Phase 1 — Data Collection & Curation

**Milestone:** `Phase 1 — Data Collection & Curation`
**Goal:** A high-quality multi-task dataset in chat format matching the app's
schemas. **This is the make-or-break phase.**
**Where:** DGX Spark
**Target volume:** ~5,000–10,000 training examples across the six tasks; hold
out 10–20% for eval. **Quality > quantity.**
**Verification:** every record passes schema validation; correctness
spot-checks pass; task/skill/difficulty distribution is balanced; a human reads
a sample and confirms Aniko-like tone.

- [ ] **Define the data schema** (single source of truth, mirrors
  `ai-sat-tutor/packages/shared/src/types.ts`):
  - Chat record: `{"task": <tag>, "messages":[{"role":"system"},...,{"role":"user"},{"role":"assistant"}]}`
  - Task tags: `tutor_chat`, `question_gen`, `explain`, `study_plan`, `full_test`
    (adaptive is folded into the others via skill-score context in the prompt).
  - Structured outputs reuse the app's types: `Question` (JSON), `StudyPlan`
    (JSON), `PracticeTest` = `Question[]`.
- [ ] **Pull public SAT datasets** from HuggingFace (search "SAT questions" /
  "digital SAT"); normalize into the `Question` schema; tag skill + difficulty.
  - Command: `python -m data_gen.converters --public data/raw/sat_dump.jsonl`
- [ ] **Transcribe the user's scanned worksheets** — OCR/vision-LLM
  transcription (vision LLM preferred for math + handwriting) → clean into
  `Question` records. High-value, real SAT-style problems. Manual spot-check.
  - Command: `python -m data_gen.converters --worksheet data/raw/scan_001.png`
- [ ] **Generate synthetic data** (frontier LLM, e.g. GPT-4o / Claude) — one
  generator prompt per task (in `data_gen/prompts/`), with varied
  skills/difficulties/student personas:
  - `tutor_chat`: multi-turn Socratic dialogues (hints → guiding questions →
    reveal only after attempt; encouraging, concise, specific).
  - `question_gen`: (skill, difficulty, section) → valid `Question` JSON with
    plausible distractors.
  - `explain`: (question + student's chosen option) → step-by-step reasoning,
    plain-text/LaTeX for math.
  - `study_plan`: (test date, target score, per-skill scores) → personalized
    plan JSON.
  - `full_test`: (section, N, difficulty mix) → `Question[]`.
  - Budget: ~$50–200 API credits.
  - Commands:
    - `python -m data_gen.generate --dry-run` (preview filled prompts)
    - `python -m data_gen.generate --task question_gen --count 200`
    - `python -m data_gen.generate --all` (all five tasks)
  - Suggested per-task volume (in `data_gen/config.yaml`):
    `tutor_chat` ~1,500 · `question_gen` ~3,000 · `explain` ~2,000 ·
    `study_plan` ~500 · `full_test` ~300.
- [ ] **Run the quality pipeline (filter before training):**
  1. Schema validation (pydantic) for all structured outputs.
  2. Correctness check: verify `correctOptionId` is actually correct (math
     solver / LLM judge); drop or fix failures.
  3. Distractor quality check (no two correct, no trivially-wrong).
  4. Dedup + near-dup removal; balance across skills/difficulties.
  5. **Manual sample review** (100–200 examples) to anchor style + correctness.
- [ ] **Assemble + split** — write `train.jsonl`, `val.jsonl`, `test.jsonl`
  (task-balanced). Keep a frozen `test` set for final eval.
  - Command: `python -m data_gen.assemble --val-frac 0.1 --test-frac 0.1`

---

## Phase 2 — Fine-tuning

**Milestone:** `Phase 2 — Fine-tuning`
**Goal:** A LoRA adapter that teaches all six behaviors.
**Where:** DGX Spark
**Verification:** val loss stable/improving; probe metrics (JSON validity,
correctness) beat the base model; no catastrophic forgetting of general chat.

- [ ] **Pick the base model** — `Qwen/Qwen2.5-14B-Instruct` (primary; strong
  math + JSON). Fast-iteration option: `Qwen/Qwen2.5-7B-Instruct`.
  (Llama 3.1 8B as alternative.)
- [ ] **Configure LoRA (PEFT)** — target
  `q_proj,v_proj,k_proj,o_proj,gate_proj,up_proj,down_proj`; `r=16–32`,
  `alpha=32–64`, `dropout=0.05–0.1`. Base in bf16 (fits easily in 128 GB).
  - Current `training/config.yaml`: `r=16`, `alpha=32`, `dropout=0.05`.
- [ ] **Configure SFT (TRL SFTTrainer)** — chat template = base model's;
  `max_seq_length` 2048–4096; batch sized to fit 128 GB (use gradient
  accumulation); 2–4 epochs; cosine LR ~1e-4→1e-5; save checkpoint per epoch +
  on val-loss improvement.
  - Current `training/config.yaml`: `max_seq_length=4096`,
    `per_device_train_batch_size=1`, `gradient_accumulation_steps=8`,
    `num_train_epochs=3`, `learning_rate=1.0e-4`, `lr_scheduler_type=cosine`,
    `warmup_ratio=0.03`, `metric_for_best_model=eval_loss`.
- [ ] **Use both Sparks:**
  - **Iteration loop (recommended):** Spark A trains; Spark B serves the latest
    checkpoint via vLLM and runs the eval suite in parallel → fast feedback.
  - **Final run:** DDP across both Sparks (~2× throughput) for the full dataset.
- [ ] **Monitor** — wandb/tensorboard: train/val loss, and a periodic
  **task-specific probe** (JSON validity rate, answer-correctness rate) to
  catch over/under-fit early.
- [ ] **Run the training** — `python training/train.py` (consumes
  `training/config.yaml`).
- [ ] **Merge** — merge the best LoRA into the base → a standalone fine-tuned
  model for serving (`output.merge: true`, `merged_dir: checkpoints/merged`).

---

## Phase 3 — Evaluation

**Milestone:** `Phase 3 — Evaluation`
**Goal:** Prove the fine-tuned model is Aniko-like and better than base/stock on
the six tasks.
**Where:** DGX Spark
**Verification:** a written eval report with per-task scores + baselines;
fine-tuned model meets a pre-agreed quality bar (e.g. ≥95% JSON validity,
correctness ≥ base+stock).

- [ ] **Prepare the frozen eval set** (from Phase 1 `test.jsonl`, task-balanced).
- [ ] **Run automated metrics:**
  - `question_gen` / `full_test`: JSON schema validity rate;
    answer-correctness rate; distractor quality; skill/difficulty coverage.
  - `explain`: LLM-as-judge (correctness, step-by-step clarity, matches the
    student's chosen option).
  - `tutor_chat`: LLM-as-judge (Socratic behavior, does NOT reveal answer
    prematurely, encouraging/concise/specific).
  - `study_plan`: LLM-as-judge (personalization to date/target/skills,
    feasibility).
  - Command: `python eval/run_eval.py --model checkpoints/merged`
    (judge prompts in `eval/judge_prompts.md`).
- [ ] **Establish baselines** — compare fine-tuned vs (a) base model,
  (b) a stock frontier model with the same prompts.
- [ ] **Measure latency/throughput** — tokens/s and p50/p95 latency on vLLM at
  target context lengths.
- [ ] **Iterate** — if a task lags, add targeted data and retrain (loop back to
  Phase 1/2).

---

## Phase 4 — Serving & App Integration

**Milestone:** `Phase 4 — Serving & App Integration`
**Goal:** The app uses the custom model end-to-end (web + mobile parity).
**Where:** DGX Spark (serving) + `ai-sat-tutor` app repo (integration)
**Verification:** `curl` the route for each task returns valid typed JSON; web
`/study` + `/practice` render model output; mobile shows the same; switching
`TUTOR_API_BASE` to a stock model still works.

> ⚠️ **This phase edits the `ai-sat-tutor` app (a separate repo).** Do that work
> in the app repo, not in `sat-tutor-model`.

- [ ] **Serve the merged model** on a Spark via **vLLM** (OpenAI-compatible,
  `/v1`), with **guided/structured decoding** (outlines/xgrammar) for
  `question_gen`/`full_test`/`study_plan` to force valid JSON. Keep **Ollama**
  for quick local dev.
  - Command: `./serving/serve-vllm.sh checkpoints/merged`
  - Ollama (quick dev): `ollama create sat-tutor -f Modelfile && ollama serve`
    → app points at `http://<spark-ip>:11434/v1` with `TUTOR_MODEL=sat-tutor`.
- [ ] **Extend the shared package** (`ai-sat-tutor/packages/shared/src/`):
  - Add a `TutorTask` type + task-specific system prompts alongside the
    existing `buildTutorSystemPrompt()`.
  - Add a typed request/response contract for each task (reuse `Question`,
    add `StudyPlan`, `PracticeTest`).
  - Add a JSON validator for `Question` (and friends) to run server-side
    before returning to clients.
- [ ] **Create the API route** `ai-sat-tutor/apps/web/app/api/tutor/route.ts`:
  - Read endpoint + model from env (`TUTOR_API_BASE`, `TUTOR_MODEL`) —
    provider-agnostic (works for vLLM/Ollama or any OpenAI-compatible host).
  - Accept a task + context (skill scores, target, etc.); call the model;
    validate structured output; return typed JSON.
  - Use `computeSkillScores` + `pickNextSkill` to feed adaptive context into
    the request.
- [ ] **Wire adaptive difficulty** — pass the student's `SkillScore[]` into the
  prompt so the model targets the weak skill at the right difficulty.
- [ ] **Mobile parity** — point the Expo app at the same route (shared base
  URL) so both clients get identical behavior.
- [ ] **Update config** — set `DEFAULT_TUTOR_CONFIG` (model name, temperature
  ~0.4, maxTokens) to the custom model; keep a stock-model fallback flag.

---

## Phase 5 — Testing, Tuning & Launch

**Milestone:** `Phase 5 — Testing, Tuning & Launch`
**Goal:** A clean, tuned, launchable end-to-end experience.
**Where:** DGX Spark + `ai-sat-tutor` app repo
**Verification:** a clean end-to-end run on both web and mobile; latency within
target; no secrets in repo; runbook works from a cold start.

- [ ] **End-to-end tests** — full practice session, study session, review,
  stats — with the custom model live.
- [ ] **Performance tuning** — vLLM `gpu_memory_utilization`, max batch,
  context length; target acceptable p95 latency for chat.
- [ ] **Guardrails** — server-side JSON validation + retry-on-invalid; content
  safety; rate limiting; key/endpoint secrets in `.env.local` (git-ignored).
- [ ] **Monitoring** — log token usage, latency, JSON-failure rate; alert on
  regressions.
- [ ] **Launch runbook** — document: start vLLM on Spark, point app env,
  verify. Keep the seed question bank as offline fallback.

---

## Cross-cutting considerations (from PLAN.md)

- **Base model size:** 14B (recommended for quality, fits 128 GB easily) vs
  7B (faster iteration, slightly lower ceiling). **Recommend: iterate on 7B,
  finalize on 14B.**
- **One model vs. per-task models:** recommend a single multi-task model
  (simpler serving, shared style). Per-task models only if one task
  consistently underperforms.
- **Worksheet IP/privacy:** confirm you have rights to the scanned worksheets
  and that no student PII is in them before using them in training data. Use
  only lawfully-obtained/public SAT material; do not use College Board
  proprietary content.

## Scope boundaries (v1)

- **In scope:** the model pipeline (data → train → eval → serve) + app
  integration for the six behaviors.
- **Out of scope (v1):** user accounts/auth, billing, score guarantee, Desmos
  course content.

## Relevant files (in the app repo, for reference)

- `ai-sat-tutor/packages/shared/src/types.ts` — `Question`, `SkillScore`,
  `TutorConfig`, `TutorMessage` (the data contract the model must emit).
- `ai-sat-tutor/packages/shared/src/ai.ts` — `buildTutorSystemPrompt()`,
  `computeSkillScores()`, `pickNextSkill()`, `DEFAULT_TUTOR_CONFIG`
  (extend with task prompts + adaptive context in Phase 4).
- `ai-sat-tutor/packages/shared/src/questions.ts` — seed bank (offline
  fallback + eval reference).
- `ai-sat-tutor/apps/web/app/api/tutor/route.ts` — **to create in Phase 4**
  (the model endpoint integration).
- `ai-sat-tutor/docs/ARCHITECTURE.md` + `notes/PROJECT_NOTES.md` — §7
  "Extending with a real / custom LLM" is the intended integration path.

## Critical architecture to reuse

- The app is already **provider-agnostic by design**: a server-side route +
  `buildTutorSystemPrompt()` + `TutorConfig`. The custom model plugs in as an
  OpenAI-compatible endpoint — no client changes beyond the base URL.
- `Question` is the structured-output schema; vLLM guided decoding enforces it
  at inference time.
- `computeSkillScores` + `pickNextSkill` drive adaptive targeting (feed into
  the model's context).
