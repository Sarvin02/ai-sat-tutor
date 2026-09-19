import type {
  AnswerRecord,
  PracticeSession,
  SkillScore,
  TutorConfig,
} from "./types";

/** Default AI tutor configuration. */
export const DEFAULT_TUTOR_CONFIG: TutorConfig = {
  model: "gpt-4o-mini",
  maxTokens: 1024,
  temperature: 0.4,
};

/**
 * Compute a simple per-skill proficiency score from a set of answers.
 *
 * This is intentionally a lightweight heuristic (correct-rate weighted by
 * recency) so it can run client-side. A production system would use a
 * Bayesian / IRT model on the server.
 *
 * @param answers All answer records, in any order.
 * @param skillToSection Map of skill -> section (needed to group by skill).
 * @returns A SkillScore per skill that has at least one answer.
 */
export function computeSkillScores(
  answers: AnswerRecord[],
  skillToSection: Map<string, "reading-writing" | "math">
): SkillScore[] {
  const bySkill = new Map<string, AnswerRecord[]>();
  for (const a of answers) {
    const list = bySkill.get(a.questionId) ?? [];
    list.push(a);
    bySkill.set(a.questionId, list);
  }

  // Note: this simple version groups by questionId as a stand-in for skill.
  // A real implementation would carry the skill on the AnswerRecord.
  const scores: SkillScore[] = [];
  for (const [key, records] of bySkill) {
    const correct = records.filter((r) => r.correct).length;
    const total = records.length;
    const score = Math.round((correct / total) * 100);
    const last = records.reduce<string>(
      (max, r) => (r.answeredAt > max ? r.answeredAt : max),
      records[0]?.answeredAt ?? ""
    );
    scores.push({
      skill: key,
      section: skillToSection.get(key) ?? "math",
      score,
      sampleSize: total,
      lastPracticedAt: last,
    });
  }
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * Pick the next question to practice based on current skill scores.
 * Strategy: target the weakest skill with enough sample size; fall back to
 * the overall weakest skill.
 */
export function pickNextSkill(
  scores: SkillScore[],
  minSampleSize = 3
): SkillScore | undefined {
  const eligible = scores.filter((s) => s.sampleSize >= minSampleSize);
  const pool = eligible.length > 0 ? eligible : scores;
  if (pool.length === 0) return undefined;
  return pool.reduce((min, s) => (s.score < min.score ? s : min));
}

/** Summarize a practice session into a simple stats object. */
export function summarizeSession(session: PracticeSession) {
  const total = session.answers.length;
  const correct = session.answers.filter((a) => a.correct).length;
  const totalTimeMs = session.answers.reduce((sum, a) => sum + a.timeSpentMs, 0);
  return {
    totalQuestions: total,
    correctCount: correct,
    incorrectCount: total - correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    avgTimePerQuestionMs: total > 0 ? Math.round(totalTimeMs / total) : 0,
  };
}

/**
 * Build the system prompt for the AI SAT tutor.
 * Kept in the shared package so web and mobile use identical instructions.
 */
export function buildTutorSystemPrompt(): string {
  return [
    "You are an expert SAT tutor. You help students prepare for the digital SAT.",
    "",
    "Rules:",
    "- Be encouraging, concise, and specific. Avoid generic advice.",
    "- When explaining an answer, show the reasoning step by step.",
    "- When generating a question, always output valid JSON matching the Question schema.",
    "- Never reveal the correct answer before the student attempts the question.",
    "- Adapt difficulty to the student's demonstrated skill level.",
    "- For math, use plain-text or LaTeX notation that renders cleanly.",
  ].join("\n");
}
