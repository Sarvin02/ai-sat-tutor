"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav";
import { SparklesIcon } from "./icons";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface/60 backdrop-blur md:flex">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-glow">
          <SparklesIcon size={18} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">AI SAT Tutor</p>
          <p className="text-[11px] text-ink-faint">Adaptive prep</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-brand-600/15 font-semibold text-brand-300"
                  : "text-ink-muted hover:bg-surface-2 hover:text-ink",
              ].join(" ")}
            >
              <span
                className={[
                  "transition",
                  active
                    ? "text-brand-400"
                    : "text-ink-faint group-hover:text-ink-muted",
                ].join(" ")}
              >
                <Icon size={19} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / profile teaser */}
      <div className="border-t border-line p-3">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-surface-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
            S
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium">Student</p>
            <p className="truncate text-[11px] text-ink-faint">
              Free plan
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
