import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Master the SAT with an AI tutor
        </h1>
        <p className="max-w-xl text-lg text-neutral-600">
          Adaptive practice questions, instant step-by-step explanations, and
          skill tracking — for both Reading &amp; Writing and Math.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            href="/practice"
            className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            Start practicing
          </Link>
          <a
            href="https://github.com/Sarvin02/ai-sat-tutor"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-neutral-300 px-5 py-2.5 font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            View on GitHub
          </a>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          title="Adaptive questions"
          body="The tutor adjusts difficulty to your demonstrated skill level."
        />
        <FeatureCard
          title="Instant explanations"
          body="Every answer comes with a clear, step-by-step breakdown."
        />
        <FeatureCard
          title="Skill tracking"
          body="See your proficiency per skill and focus on weak areas."
        />
      </section>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600">{body}</p>
    </div>
  );
}
