import type { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import {
  BoltIcon,
  ChartIcon,
  FlameIcon,
  TargetIcon,
} from "@/components/icons";

/** Placeholder data — no real content. */
const SCORE_TREND = [1280, 1300, 1290, 1330, 1350, 1345, 1385];
const WEEK = [
  { day: "M", value: 40 },
  { day: "T", value: 65 },
  { day: "W", value: 30 },
  { day: "T", value: 80 },
  { day: "F", value: 55 },
  { day: "S", value: 90 },
  { day: "S", value: 20 },
];
const SKILLS = [
  { name: "Skill", value: 88 },
  { name: "Skill", value: 72 },
  { name: "Skill", value: 64 },
  { name: "Skill", value: 45 },
];

export default function StatsPage() {
  return (
    <div>
      <PageHeader
        title="Stats"
        subtitle="Track your progress over time."
        action={
          <div className="flex gap-2 text-xs">
            <button className="btn-ghost px-3 py-2">7d</button>
            <button className="btn-primary px-3 py-2">30d</button>
          </div>
        }
      />

      {/* Top metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric icon={<TargetIcon size={18} />} label="Avg. score" value="1385" />
        <Metric icon={<BoltIcon size={18} />} label="Questions" value="248" />
        <Metric icon={<ChartIcon size={18} />} label="Accuracy" value="82%" />
        <Metric icon={<FlameIcon size={18} />} label="Streak" value="6 days" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Score trend */}
        <div className="card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Score trend</h3>
            <span className="text-xs text-ink-faint">Last 7 sessions</span>
          </div>
          <LineChart data={SCORE_TREND} />
        </div>

        {/* Weekly activity */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Activity</h3>
            <span className="text-xs text-ink-faint">This week</span>
          </div>
          <BarChart data={WEEK} />
        </div>
      </div>

      {/* Skill proficiency */}
      <div className="card mt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Skill proficiency</h3>
          <span className="text-xs text-ink-faint">Estimated</span>
        </div>
        <div className="space-y-4">
          {SKILLS.map((s, i) => (
            <div key={i}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-ink-muted">{s.name}</span>
                <span className="font-medium">{s.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                  style={{ width: `${s.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-muted">{label}</span>
        <span className="text-brand-400">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

/** Minimal SVG line/area chart. */
function LineChart({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const w = 320;
  const h = 140;
  const pad = 8;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);

  const points = data.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  const last = points[points.length - 1]!;
  const first = points[0]!;
  const area = `${line} L${last[0].toFixed(1)},${h - pad} L${first[0].toFixed(1)},${h - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-40 w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c6cff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7c6cff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaFill)" />
      <path
        d={line}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#0a0a0f" stroke="#a78bfa" strokeWidth="2" />
      ))}
    </svg>
  );
}

/** Minimal CSS bar chart. */
function BarChart({ data }: { data: { day: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <div className="flex h-40 items-end justify-between gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-brand-700 to-brand-400"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-faint">{d.day}</span>
        </div>
      ))}
    </div>
  );
}
