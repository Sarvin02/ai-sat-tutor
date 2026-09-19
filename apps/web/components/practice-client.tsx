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
    if (!selected) return;
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
    return <p className="text-neutral-500">No questions available.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>
          Accuracy: {stats.accuracy}% ({stats.correctCount}/{stats.totalQuestions})
        </span>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {question.section === "math" ? "Math" : "Reading & Writing"}
          </span>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-600">
            {question.difficulty}
          </span>
        </div>

        {question.passage && (
          <p className="mb-4 border-l-2 border-neutral-300 pl-4 text-sm italic text-neutral-600">
            {question.passage}
          </p>
        )}

        <p className="whitespace-pre-line text-lg text-neutral-900">
          {question.prompt}
        </p>

        <div className="mt-6 space-y-3">
          {question.options.map((opt) => {
            const isCorrect = revealed && opt.id === question.correctOptionId;
            const isWrong =
              revealed && opt.id === selected && !isCorrect;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={revealed}
                className={[
                  "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition",
                  isCorrect
                    ? "border-green-500 bg-green-50"
                    : isWrong
                      ? "border-red-500 bg-red-50"
                      : selected === opt.id
                        ? "border-brand-500 bg-brand-50"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50",
                ].join(" ")}
              >
                <span className="font-semibold text-neutral-500">
                  {opt.id}.
                </span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-6 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-700">
            <p className="font-semibold text-neutral-900">Explanation</p>
            <p className="mt-1">{question.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={!selected}
            className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="rounded-lg bg-neutral-900 px-5 py-2.5 font-medium text-white transition hover:bg-neutral-700"
          >
            {isLast ? "Restart" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}
