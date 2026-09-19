import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BoltIcon,
  BookIcon,
  ChartIcon,
  ChatIcon,
  FlameIcon,
  RefreshIcon,
  TargetIcon,
} from "@/components/icons";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <p className="text-sm text-ink-muted">Welcome back</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Ready to study?
        </h1>
      </div>

      {/* Hero: practice test */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-brand-700/30 via-surface to-surface p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <span className="chip bg-brand-600/20 text-brand-300">
              Adaptive · 45 min
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">
              Start a Practice Test
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              A full-length, adaptive SAT section that adjusts to your level in
              real time.
            </p>
          </div>
          <Link
            href="/practice"
            className="btn-primary w-full px-6 py-3 text-base shadow-glow sm:w-auto"
          >
            <BoltIcon size={18} />
            Begin test
          </Link>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<FlameIcon size={18} />}
          label="Day streak"
          value="6"
          hint="Best: 12"
        />
        <StatCard
          icon={<TargetIcon size={18} />}
          label="Avg. score"
          value="1385"
          hint="+40 this week"
        />
        <StatCard
          icon={<BoltIcon size={18} />}
          label="Questions"
          value="248"
          hint="This month"
        />
        <StatCard
          icon={<ChartIcon size={18} />}
          label="Accuracy"
          value="82%"
          hint="Top 15%"
        />
      </section>

      {/* Quick actions */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-faint">
          Jump back in
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            href="/study"
            icon={<ChatIcon size={20} />}
            title="Study Session"
            body="Chat with your AI tutor and work through weak skills."
          />
          <QuickAction
            href="/vocab"
            icon={<BookIcon size={20} />}
            title="Vocab"
            body="Review today's SAT word flashcards."
          />
          <QuickAction
            href="/review"
            icon={<RefreshIcon size={20} />}
            title="Review Quizzes"
            body="Revisit the questions you got wrong."
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-muted">{label}</span>
        <span className="text-brand-400">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-ink-faint">{hint}</p>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  body,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="card card-hover group flex items-start gap-4"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600/15 text-brand-300 transition group-hover:bg-brand-600/25">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{title}</h4>
          <ArrowRightIcon
            size={16}
            className="text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-brand-300"
          />
        </div>
        <p className="mt-1 text-sm text-ink-muted">{body}</p>
      </div>
    </Link>
  );
}
