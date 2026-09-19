import { PracticeClient } from "@/components/practice-client";
import { PageHeader } from "@/components/page-header";
import { SEED_QUESTIONS } from "@ai-sat-tutor/shared";

export const metadata = { title: "Practice Test — AI SAT Tutor" };

export default function PracticePage() {
  return (
    <div>
      <PageHeader
        title="Practice Test"
        subtitle="Adaptive questions that adjust to your level."
      />
      <PracticeClient questions={SEED_QUESTIONS} />
    </div>
  );
}
