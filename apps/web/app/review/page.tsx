import { PageHeader } from "@/components/page-header";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  RefreshIcon,
} from "@/components/icons";

/**
 * Placeholder quiz list. No real content — just UI structure.
 */
const QUIZZES = [
  {
    id: "q1",
    title: "Quiz",
    topic: "Topic placeholder",
    total: 10,
    done: 6,
    status: "in-progress" as const,
  },
  {
    id: "q2",
    title: "Quiz",
    topic: "Topic placeholder",
    total: 10,
    done: 10,
    status: "complete" as const,
  },
  {
    id: "q3",
    title: "Quiz",
    topic: "Topic placeholder",
    total: 10,
    done: 0,
    status: "new" as const,
  },
  {
    id: "q4",
    title: "Quiz",
    topic: "Topic placeholder",
    total: 10,
    done: 3,
    status: "in-progress" as const,
  },
];

export default function ReviewPage() {
  return (
    <div>
      <PageHeader
        title="Review Quizzes"
        subtitle="Revisit the questions you got wrong and lock in the skill."
        action={
          <button className="btn-primary">
            <RefreshIcon size={16} /> New quiz
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {QUIZZES.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
}

function QuizCard({
  quiz,
}: {
  quiz: (typeof QUIZZES)[number];
}) {
  const pct = Math.round((quiz.done / quiz.total) * 100);
  const statusChip =
    quiz.status === "complete" ? (
      <span className="chip bg-emerald-500/15 text-emerald-300">
        <CheckIcon size={13} /> Complete
      </span>
    ) : quiz.status === "in-progress" ? (
      <span className="chip bg-brand-600/20 text-brand-300">In progress</span>
    ) : (
      <span className="chip bg-surface-2 text-ink-muted">New</span>
    );

  return (
    <div className="card card-hover flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{quiz.title}</h3>
          <p className="truncate text-sm text-ink-muted">{quiz.topic}</p>
        </div>
        {statusChip}
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>
            {quiz.done} / {quiz.total} questions
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-brand-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-ink-faint">
          <ClockIcon size={14} /> ~{quiz.total * 2} min
        </span>
        <button className="btn-ghost px-3 py-2 text-xs">
          {quiz.status === "complete" ? "Review" : "Continue"}
          <ArrowRightIcon size={14} />
        </button>
      </div>
    </div>
  );
}
