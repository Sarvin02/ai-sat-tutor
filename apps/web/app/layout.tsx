import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI SAT Tutor",
  description:
    "AI-powered SAT practice with adaptive questions and instant explanations.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <span className="text-lg font-semibold tracking-tight">
                AI SAT Tutor
              </span>
            </div>
            <nav className="flex gap-6 text-sm font-medium text-neutral-600">
              <a href="/" className="hover:text-brand-600">
                Home
              </a>
              <a href="/practice" className="hover:text-brand-600">
                Practice
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
