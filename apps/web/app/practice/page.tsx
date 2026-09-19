import { PracticeClient } from "@/components/practice-client";
import { SEED_QUESTIONS } from "@ai-sat-tutor/shared";

export const metadata = { title: "Practice — AI SAT Tutor" };

export default function PracticePage() {
  return <PracticeClient questions={SEED_QUESTIONS} />;
}
