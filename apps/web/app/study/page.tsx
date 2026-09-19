"use client";

import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SparklesIcon } from "@/components/icons";

type Msg = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const SUGGESTIONS = [
  "Explain this topic",
  "Give me a practice question",
  "What should I study today?",
];

export default function StudyPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hi! I'm your AI tutor. Ask me anything to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Msg = { id: Date.now(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    // UI-only: no model is wired up yet, so resolve with a placeholder.
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Your custom model will respond here once it's connected.",
        },
      ]);
    }, 900);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <PageHeader
        title="Study Session"
        subtitle="Chat with your AI tutor to work through weak skills."
      />

      {/* Messages */}
      <div className="card flex-1 overflow-y-auto p-0">
        <div className="flex min-h-full flex-col gap-4 p-5">
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          {thinking ? <TypingIndicator /> : null}
          <div ref={endRef} />
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 py-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="chip border border-line bg-surface-2 text-ink-muted transition hover:border-brand-500/50 hover:text-ink"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your tutor anything…"
          className="flex-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-ink-faint focus:border-brand-500/60"
        />
        <button
          type="submit"
          disabled={!input.trim() || thinking}
          className="btn-primary px-4"
          aria-label="Send"
        >
          <SparklesIcon size={18} />
        </button>
      </form>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={[
        "flex",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-brand-600 text-white"
            : "rounded-bl-sm border border-line bg-surface-2 text-ink",
        ].join(" ")}
      >
        {msg.text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-surface-2 px-4 py-3">
        <Dot delay="0ms" />
        <Dot delay="150ms" />
        <Dot delay="300ms" />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint"
      style={{ animationDelay: delay }}
    />
  );
}
