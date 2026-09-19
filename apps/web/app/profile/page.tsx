"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  CheckIcon,
  FlameIcon,
  TargetIcon,
  UserIcon,
} from "@/components/icons";

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true);
  const [adaptive, setAdaptive] = useState(true);

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account and goals." />

      {/* Identity card */}
      <div className="card flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-3xl font-bold text-white">
          S
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Student</h2>
            <span className="chip bg-brand-600/20 text-brand-300">
              Free plan
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            student@example.com
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-ink-muted">
              <FlameIcon size={15} className="text-amber-400" /> 6-day streak
            </span>
            <span className="flex items-center gap-1.5 text-ink-muted">
              <TargetIcon size={15} className="text-brand-400" /> Goal: 1400
            </span>
          </div>
        </div>
        <button className="btn-ghost">Edit profile</button>
      </div>

      {/* Goals */}
      <div className="card mt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Study goal</h3>
          <button className="text-xs font-medium text-brand-300 hover:text-brand-400">
            Change
          </button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">Target score</span>
          <span className="font-semibold">1400</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
            style={{ width: "78%" }}
          />
        </div>
        <p className="mt-2 text-xs text-ink-faint">
          1385 / 1400 — you&apos;re 78% of the way there.
        </p>
      </div>

      {/* Settings */}
      <div className="card mt-4">
        <h3 className="mb-4 font-semibold">Preferences</h3>
        <div className="divide-y divide-line">
          <SettingRow
            title="Adaptive difficulty"
            desc="Questions adjust to your level automatically."
            checked={adaptive}
            onToggle={() => setAdaptive((v) => !v)}
          />
          <SettingRow
            title="Study reminders"
            desc="Get a nudge when it's time to practice."
            checked={notifications}
            onToggle={() => setNotifications((v) => !v)}
          />
        </div>
      </div>

      {/* Account */}
      <div className="card mt-4">
        <h3 className="mb-4 font-semibold">Account</h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="btn-ghost flex-1">
            <UserIcon size={16} /> Manage subscription
          </button>
          <button className="btn-ghost flex-1 text-red-300 hover:bg-red-500/10">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  desc,
  checked,
  onToggle,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-ink-muted">{desc}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-brand-600" : "bg-surface-2",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white transition-all",
            checked ? "left-[22px]" : "left-0.5",
          ].join(" ")}
        >
          {checked ? <CheckIcon size={12} className="text-brand-600" /> : null}
        </span>
      </button>
    </div>
  );
}
