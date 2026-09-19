import type { Question } from "./types";

/**
 * A small built-in question bank used for:
 *  - bootstrapping the app before any AI-generated content exists
 *  - unit-testing the scoring / analytics logic
 *  - offline demo mode
 *
 * In production the AI tutor generates far more questions; these are just
 * a deterministic seed set.
 */
export const SEED_QUESTIONS: Question[] = [
  {
    id: "q-rw-001",
    section: "reading-writing",
    skill: "words-in-context",
    difficulty: "easy",
    prompt:
      "Choose the word that best completes the sentence.\n\nThe scientist's hypothesis was ______ by the new experimental data.",
    options: [
      { id: "A", text: "corroborated" },
      { id: "B", text: "obscured" },
      { id: "C", text: "diminished" },
      { id: "D", text: "contradicted" },
    ],
    correctOptionId: "A",
    explanation:
      "To 'corroborate' means to confirm or provide evidence for. The new data supported the hypothesis, so 'corroborated' fits best.",
    timeLimitSeconds: 32,
  },
  {
    id: "q-rw-002",
    section: "reading-writing",
    skill: "command-of-evidence",
    difficulty: "medium",
    passage:
      "A 2024 study of 1,200 urban commuters found that those who cycled to work reported 22% lower weekly stress levels than those who drove, even after controlling for income and commute distance.",
    prompt:
      "Which choice most logically completes the argument?\n\nThe researchers conclude that cycling to work reduces stress. The strongest support for this conclusion is that the effect held:",
    options: [
      { id: "A", text: "only among participants who cycled more than 30 minutes" },
      { id: "B", text: "after controlling for income and commute distance" },
      { id: "C", text: "in cities with dedicated bike lanes" },
      { id: "D", text: "during the summer months" },
    ],
    correctOptionId: "B",
    explanation:
      "Controlling for income and commute distance rules out alternative explanations, making the causal claim (cycling → lower stress) much stronger.",
    timeLimitSeconds: 35,
  },
  {
    id: "q-math-001",
    section: "math",
    skill: "linear-equations",
    difficulty: "easy",
    prompt: "If 3x + 7 = 22, what is the value of x?",
    options: [
      { id: "A", text: "3" },
      { id: "B", text: "4" },
      { id: "C", text: "5" },
      { id: "D", text: "6" },
    ],
    correctOptionId: "C",
    explanation:
      "Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5.",
    timeLimitSeconds: 30,
  },
  {
    id: "q-math-002",
    section: "math",
    skill: "functions",
    difficulty: "medium",
    prompt: "If f(x) = 2x² − 3x + 1, what is f(−1)?",
    options: [
      { id: "A", text: "0" },
      { id: "B", text: "2" },
      { id: "C", text: "6" },
      { id: "D", text: "−6" },
    ],
    correctOptionId: "C",
    explanation:
      "f(−1) = 2(−1)² − 3(−1) + 1 = 2(1) + 3 + 1 = 6.",
    timeLimitSeconds: 35,
  },
  {
    id: "q-math-003",
    section: "math",
    skill: "ratios-proportions",
    difficulty: "hard",
    prompt:
      "A recipe calls for a ratio of flour to sugar of 5:2. If you use 300 grams of flour, how many grams of sugar are needed to keep the same ratio?",
    options: [
      { id: "A", text: "90" },
      { id: "B", text: "100" },
      { id: "C", text: "120" },
      { id: "D", text: "150" },
    ],
    correctOptionId: "C",
    explanation:
      "5:2 means sugar = (2/5) × flour = (2/5) × 300 = 120 grams.",
    timeLimitSeconds: 40,
  },
];

/** Look up a seed question by id. */
export function getSeedQuestion(id: string): Question | undefined {
  return SEED_QUESTIONS.find((q) => q.id === id);
}
