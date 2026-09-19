"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav";
import { SparklesIcon } from "./icons";

/**
 * Horizontal, scrollable tab bar shown on small screens where the sidebar is
 * hidden. Mirrors the same navigation as the desktop sidebar.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 border-b border-line bg-[var(--background)]/90 backdrop-blur md:hidden">
      <div className="flex items-center gap-2 px-4 pt-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <SparklesIcon size={16} />
        </div>
        <span className="text-sm font-semibold">AI SAT Tutor</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
                active
                  ? "bg-brand-600/20 text-brand-300"
                  : "text-ink-muted hover:bg-surface-2",
              ].join(" ")}
            >
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
