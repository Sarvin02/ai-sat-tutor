"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  RefreshIcon,
} from "@/components/icons";

/**
 * Placeholder flashcard deck. No real content — just UI structure.
 * Replace `word` / `definition` with real data later.
 */
const DECK = [
  { word: "Word", definition: "Definition placeholder goes here." },
  { word: "Word", definition: "Definition placeholder goes here." },
  { word: "Word", definition: "Definition placeholder goes here." },
  { word: "Word", definition: "Definition placeholder goes here." },
  { word: "Word", definition: "Definition placeholder goes here." },
];

export default function VocabPage() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [learning, setLearning] = useState(0);

  const card = DECK[index];
  const isLast = index === DECK.length - 1;

  function flip() {
    setFlipped((f) => !f);
  }

  function mark(kind: "known" | "learning") {
    if (kind === "known") setKnown((n) => n + 1);
    else setLearning((n) => n + 1);
    if (isLast) {
      // Reset the deck for another pass.
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
    setFlipped(false);
  }

  if (!card) return null;

  return (
    <div>
      <PageHeader
        title="Vocab"
        subtitle="Flip through today's word cards."
        action={
          <div className="flex gap-2 text-xs">
            <span className="chip bg-emerald-500/15 text-emerald-300">
              <CheckIcon size={13} /> {known} known
            </span>
            <span className="chip bg-amber-500/15 text-amber-300">
              <RefreshIcon size={13} /> {learning} learning
            </span>
          </div>
        }
      />

      {/* Progress */}
      <div className="mb-4 flex items-center gap-3 text-xs text-ink-muted">
        <span>
          Card {index + 1} of {DECK.length}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${((index + 1) / DECK.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div
        onClick={flip}
        className="card relative h-64 cursor-pointer select-none overflow-hidden"
      >
        <div
          className={[
            "absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center transition",
            flipped ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <span className="chip bg-brand-600/20 text-brand-300">
            <BookIcon size={13} /> Word
          </span>
          <p className="text-3xl font-bold tracking-tight">{card.word}</p>
          <p className="text-xs text-ink-faint">Tap to reveal definition</p>
        </div>
        <div
          className={[
            "absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center transition",
            flipped ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <span className="chip bg-surface-2 text-ink-muted">Definition</span>
          <p className="max-w-sm text-lg leading-relaxed text-ink-muted">
            {card.definition}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button onClick={() => mark("learning")} className="btn-ghost flex-1">
          <RefreshIcon size={16} /> Still learning
        </button>
        <button
          onClick={flip}
          className="btn-ghost hidden sm:inline-flex"
        >
          Flip
        </button>
        <button onClick={() => mark("known")} className="btn-primary flex-1">
          <CheckIcon size={16} /> Got it
        </button>
      </div>

      {/* Deck strip */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {DECK.map((c, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              setFlipped(false);
            }}
            className={[
              "flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border text-xs transition",
              i === index
                ? "border-brand-500 bg-brand-600/15 text-brand-300"
                : "border-line bg-surface text-ink-faint hover:bg-surface-2",
            ].join(" ")}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-ink-faint">
        <ArrowRightIcon size={14} />
        Tip: mark words you know to build your personal study list.
      </div>
    </div>
  );
}
