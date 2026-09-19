"use client";

import { useMemo, useState } from "react";
import type { Question } from "@ai-sat-tutor/shared";
import { summarizeSession } from "@ai-sat-tutor/shared";

export function PracticeClient({ questions }: { questions: Question[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedOptionId: string; correct: boolean }[]
  >([]);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const stats = useMemo(
    () =>
      summarizeSession({
        id: "live",
        startedAt: new Date().toISOString(),
        section: question?.section ?? "math",
        answers: answers.map((a) => ({
          questionId: a.questionId,
          selectedOptionId: a.selectedOptionId,
          correct: a.correct,
          timeSpentMs: 0,
          answeredAt: new Date().toISOString(),
        })),
      }),
    [answers, question]
  );

  function handleSelect(optionId: string) {
    if (revealed) return;
    setSelected(optionId);
  }

  function handleReveal() {
    if (!selected || !question) return;
    setRevealed(true);
    setAnswers((prev) => [
      ...prev,
      {
        questionId: question.id,
        selectedOptionId: selected,
        correct: selected === question.correctOptionId,
      },
    ]);
  }

  function handleNext() {
    if (isLast) {
      // Reset for a fresh run.
      setAnswers([]);
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
    setSelected(null);
    setRevealed(false);
  }

  if (!question) {
    return <p className="text-ink-muted">No questions available.</p>;
  }

  const progress = Math.round(((index + 1) / questions.length) * 100);

  return (
    <div className="space-y-5">
      {/* Progress header */}
      <div className="card">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Question {index + 1}
            <span className="text-ink-faint"> / {questions.length}</span>
          </span>
          <span className="text-ink-muted">
            Accuracy {stats.accuracy}%
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="chip bg-brand-600/20 text-brand-300">
            {question.section === "math" ? "Math" : "Reading & Writing"}
          </span>
          <span className="chip bg-surface-2 capitalize text-ink-muted">
            {question.difficulty}
          </span>
          {question.aiGenerated ? (
            <span className="chip bg-surface-2 text-ink-faint">AI</span>
          ) : null}
        </div>

        {question.passage ? (
          <p className="mb-4 border-l-2 border-brand-500/40 pl-4 text-sm italic text-ink-muted">
            {question.passage}
          </p>
        ) : null}

        <p className="whitespace-pre-line text-lg leading-relaxed">
          {question.prompt}
        </p>

        <div className="mt-6 space-y-3">
          {question.options.map((opt) => {
            const isCorrect =
              revealed && opt.id === question.correctOptionId;
            const isWrong = revealed && opt.id === selected && !isCorrect;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={revealed}
                className={[
                  "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition",
                  isCorrect
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : isWrong
                      ? "border-red-500/60 bg-red-500/10"
                      : selected === opt.id
                        ? "border-brand-500 bg-brand-600/10"
                        : "border-line hover:border-[#3a3a4a] hover:bg-surface-2",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                    isCorrect
                      ? "bg-emerald-500 text-white"
                      : isWrong
                        ? "bg-red-500 text-white"
                        : selected === opt.id
                          ? "bg-brand-600 text-white"
                          : "bg-surface-2 text-ink-muted",
                  ].join(" ")}
                >
                  {opt.id}
                </span>
                <span className="pt-0.5">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {revealed ? (
          <div className="mt-6 rounded-xl border border-line bg-surface-2/60 p-4 text-sm">
            <p className="font-semibold text-brand-300">Explanation</p>
            <p className="mt-1 leading-relaxed text-ink-muted">
              {question.explanation}
            </p>
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleNext}
          className="btn-ghost"
          aria-label="Restart"
        >
          Restart
        </button>
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={!selected}
            className="btn-primary px-6"
          >
            Check answer
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary px-6">
            {isLast ? "Finish" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}
